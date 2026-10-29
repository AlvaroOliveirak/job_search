package com.jobsearch.service;

import com.jobsearch.dto.JobSyncDTO;
import com.jobsearch.dto.MatchUpdateDTO;
import com.jobsearch.dto.UserJobMatchResponse;
import com.jobsearch.model.Job;
import com.jobsearch.model.User;
import com.jobsearch.model.UserJobMatch;
import com.jobsearch.model.enums.MatchStatus;
import com.jobsearch.repository.JobRepository;
import com.jobsearch.repository.UserJobMatchRepository;
import com.jobsearch.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class JobService {

    private final UserJobMatchRepository matchRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(UserJobMatchRepository matchRepository, JobRepository jobRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public List<UserJobMatchResponse> getMatchesForUser(Long userId, MatchStatus status, Boolean isFavorite, Double minScore, String search) {
        List<UserJobMatch> matches = matchRepository.findMatchesWithFilters(userId, status, isFavorite, minScore, search);
        return matches.stream()
                .map(UserJobMatchResponse::new)
                .toList();
    }

    public UserJobMatchResponse getMatchById(Long matchId, Long userId) {
        UserJobMatch match = matchRepository.findByIdAndUserId(matchId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro de vaga não encontrado."));
        return new UserJobMatchResponse(match);
    }

    @Transactional
    public UserJobMatchResponse updateMatch(Long matchId, Long userId, MatchUpdateDTO updateDTO) {
        UserJobMatch match = matchRepository.findByIdAndUserId(matchId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro de vaga não encontrado."));

        if (updateDTO.getIsFavorite() != null) {
            match.setFavorite(updateDTO.getIsFavorite());
        }

        if (updateDTO.getStatus() != null) {
            match.setStatus(updateDTO.getStatus());
        }

        UserJobMatch saved = matchRepository.save(match);
        return new UserJobMatchResponse(saved);
    }

    @Transactional
    public List<UserJobMatchResponse> syncJobs(JobSyncDTO syncDTO) {
        List<UserJobMatchResponse> result = new ArrayList<>();

        if (syncDTO.getJobs() == null || syncDTO.getJobs().isEmpty()) {
            return result;
        }

        List<User> targetUsers = new ArrayList<>();
        if (syncDTO.getUserId() != null) {
            userRepository.findById(syncDTO.getUserId()).ifPresent(targetUsers::add);
        } else {
            targetUsers.addAll(userRepository.findAll());
        }

        for (JobSyncDTO.ScrapedJobItem item : syncDTO.getJobs()) {
            LocalDateTime parsedPostedAt = parsePostedAt(item.getPostedAt());
            Job job = jobRepository.findByJobHash(item.getJobHash())
                    .orElseGet(() -> {
                        Job newJob = new Job(
                                item.getJobHash(),
                                item.getTitle(),
                                item.getCompany(),
                                item.getLocation(),
                                item.getUrl(),
                                item.getDescription(),
                                item.getSource(),
                                parsedPostedAt
                        );
                        return jobRepository.save(newJob);
                    });

            if (job.getPostedAt() == null && parsedPostedAt != null) {
                job.setPostedAt(parsedPostedAt);
                jobRepository.save(job);
            }

            for (User user : targetUsers) {
                UserJobMatch match = matchRepository.findByUserIdAndJobId(user.getId(), job.getId())
                        .orElseGet(() -> new UserJobMatch(user, job, item.getScore() != null ? item.getScore() : 75.0, MatchStatus.NEW));

                if (item.getScore() != null) {
                    match.setScore(item.getScore());
                }
                match.setMatchedAt(LocalDateTime.now());

                UserJobMatch saved = matchRepository.save(match);
                result.add(new UserJobMatchResponse(saved));
            }
        }

        return result;
    }

    public Map<String, Object> triggerManualRefresh(Long userId) {
        boolean scriptExecuted = false;
        String executionMessage = "Busca executada com sucesso.";

        // 1. Tenta executar o pipeline Python (scraper real + matcher)
        try {
            File scriptFile = new File("../python-service/main.py");
            if (!scriptFile.exists()) {
                scriptFile = new File("python-service/main.py");
            }

            if (scriptFile.exists()) {
                ProcessBuilder pb = new ProcessBuilder("python3", scriptFile.getName());
                pb.directory(scriptFile.getParentFile());
                pb.redirectErrorStream(true);
                Process process = pb.start();

                boolean finished = process.waitFor(40, TimeUnit.SECONDS);
                if (finished && process.exitValue() == 0) {
                    scriptExecuted = true;
                    executionMessage = "Vagas coletadas ao vivo da API da Gupy e sincronizadas via IA com sucesso.";
                } else if (!finished) {
                    process.destroyForcibly();
                    executionMessage = "A sincronização externa levou mais tempo do que o esperado. Vagas em cache exibidas.";
                } else {
                    executionMessage = "Processo do scraper finalizou com código " + process.exitValue() + ". Vagas em cache exibidas.";
                }
            } else {
                executionMessage = "Script python-service/main.py não localizado no caminho padrão. Vagas atuais mantidas.";
            }
        } catch (Exception e) {
            executionMessage = "Aviso ao rodar scraper: " + e.getMessage() + ". Retornando dados atuais.";
        }

        // 2. Retorna a lista atualizada de vagas do usuário
        List<UserJobMatchResponse> matches = getMatchesForUser(userId != null ? userId : 1L, null, null, null, null);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", scriptExecuted ? "success" : "info");
        response.put("message", executionMessage);
        response.put("total_jobs", matches.size());
        response.put("updated_at", LocalDateTime.now());
        response.put("matches", matches);

        return response;
    }

    private LocalDateTime parsePostedAt(String postedAtStr) {
        if (postedAtStr == null || postedAtStr.isBlank()) {
            return LocalDateTime.now();
        }
        try {
            return OffsetDateTime.parse(postedAtStr).toLocalDateTime();
        } catch (Exception e1) {
            try {
                return Instant.parse(postedAtStr).atZone(ZoneId.systemDefault()).toLocalDateTime();
            } catch (Exception e2) {
                try {
                    return LocalDateTime.parse(postedAtStr);
                } catch (Exception e3) {
                    return LocalDateTime.now();
                }
            }
        }
    }
}
