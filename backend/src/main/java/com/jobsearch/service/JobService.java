package com.jobsearch.service;

import com.jobsearch.dto.JobSyncDTO;
import com.jobsearch.dto.MatchUpdateDTO;
import com.jobsearch.dto.UserJobMatchResponse;
import com.jobsearch.model.Job;
import com.jobsearch.model.SearchProfile;
import com.jobsearch.model.User;
import com.jobsearch.model.UserJobMatch;
import com.jobsearch.model.enums.MatchStatus;
import com.jobsearch.repository.JobRepository;
import com.jobsearch.repository.SearchProfileRepository;
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
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class JobService {

    private final UserJobMatchRepository matchRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SearchProfileRepository profileRepository;

    public JobService(UserJobMatchRepository matchRepository,
                      JobRepository jobRepository,
                      UserRepository userRepository,
                      SearchProfileRepository profileRepository) {
        this.matchRepository = matchRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
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

                UserJobMatch saved = matchRepository.save(match);
                result.add(new UserJobMatchResponse(saved));
            }
        }

        return result;
    }

    /**
     * Aciona sob demanda a execução do pipeline Python (Scraper Gupy + IA Matching)
     * e retorna a lista atualizada de vagas compatíveis do usuário.
     */
    public Map<String, Object> triggerManualRefresh(Long userId) {
        Long targetUserId = userId != null ? userId : 1L;
        boolean scriptExecuted = false;
        String executionMessage = "Vagas sincronizadas.";

        // Recupera dados do usuário e perfil para guiar dinamicamente o scraping
        String userName = "Candidato";
        String keywords = "React, TypeScript, Java, Spring Boot, Git, REST";
        String chatId = "123456789";

        Optional<User> userOpt = userRepository.findById(targetUserId);
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            if (u.getName() != null && !u.getName().isBlank()) {
                userName = u.getName();
            }
            if (u.getTelegramChatId() != null && !u.getTelegramChatId().isBlank()) {
                chatId = u.getTelegramChatId();
            }
            List<SearchProfile> profiles = profileRepository.findByUserId(u.getId());
            if (!profiles.isEmpty() && profiles.get(0).getKeywords() != null && !profiles.get(0).getKeywords().isBlank()) {
                keywords = profiles.get(0).getKeywords();
            }
        }

        // 1. Tenta executar o pipeline Python com os parâmetros dinâmicos do usuário
        try {
            File scriptFile = new File("../python-service/main.py");
            if (!scriptFile.exists()) {
                scriptFile = new File("python-service/main.py");
            }

            if (scriptFile.exists()) {
                // Tenta comando python padrão (funciona no Windows e Linux)
                String pythonCmd = System.getProperty("os.name").toLowerCase().contains("win") ? "python" : "python3";
                ProcessBuilder pb = new ProcessBuilder(
                        pythonCmd, scriptFile.getName(),
                        "--user_id", String.valueOf(targetUserId),
                        "--name", userName,
                        "--keywords", keywords,
                        "--chat_id", chatId
                );
                pb.directory(scriptFile.getParentFile());
                pb.redirectErrorStream(true);
                Process process = pb.start();

                boolean finished = process.waitFor(40, TimeUnit.SECONDS);
                if (finished && process.exitValue() == 0) {
                    scriptExecuted = true;
                    executionMessage = "Vagas coletadas ao vivo da API da Gupy e sincronizadas via IA com sucesso para as suas skills.";
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
        List<UserJobMatchResponse> matches = getMatchesForUser(targetUserId, null, null, null, null);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", scriptExecuted ? "success" : "info");
        response.put("message", executionMessage);
        response.put("total_jobs", matches.size());
        response.put("updated_at", LocalDateTime.now());
        response.put("matches", matches);

        return response;
    }

    @Transactional
    public void recalculateMatchesForUser(Long userId, String keywords) {
        if (keywords == null || keywords.isBlank()) return;

        List<String> terms = Arrays.stream(keywords.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .toList();

        if (terms.isEmpty()) return;

        List<UserJobMatch> matches = matchRepository.findByUserId(userId);
        for (UserJobMatch match : matches) {
            Job job = match.getJob();
            if (job == null) continue;

            String text = ((job.getTitle() != null ? job.getTitle() : "") + " " +
                           (job.getDescription() != null ? job.getDescription() : "")).toLowerCase();

            int matchedCount = 0;
            for (String term : terms) {
                if (text.contains(term)) {
                    matchedCount++;
                }
            }

            // Nota base de 40% + proporcional até 98%
            double ratio = (double) matchedCount / terms.size();
            double calculatedScore = Math.min(98.0, Math.round((40.0 + (ratio * 58.0)) * 10.0) / 10.0);
            match.setScore(calculatedScore);
            match.setMatchedAt(LocalDateTime.now());
            matchRepository.save(match);
        }
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
