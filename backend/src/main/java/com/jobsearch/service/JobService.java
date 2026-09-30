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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
                                LocalDateTime.now()
                        );
                        return jobRepository.save(newJob);
                    });

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
}
