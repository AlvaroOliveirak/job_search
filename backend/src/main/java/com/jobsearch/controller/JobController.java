package com.jobsearch.controller;

import com.jobsearch.dto.MatchUpdateDTO;
import com.jobsearch.dto.UserJobMatchResponse;
import com.jobsearch.model.User;
import com.jobsearch.model.enums.MatchStatus;
import com.jobsearch.service.AuthService;
import com.jobsearch.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final AuthService authService;

    public JobController(JobService jobService, AuthService authService) {
        this.jobService = jobService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<UserJobMatchResponse>> getJobs(
            @RequestParam(required = false) String status,
            @RequestParam(value = "is_favorite", required = false) Boolean isFavorite,
            @RequestParam(value = "min_score", required = false) Double minScore,
            @RequestParam(required = false) String search,
            Authentication authentication
    ) {
        User user = authService.getUserByEmail(authentication.getName());
        MatchStatus matchStatus = null;
        if (status != null && !status.isBlank()) {
            matchStatus = MatchStatus.fromValue(status);
        }

        List<UserJobMatchResponse> matches = jobService.getMatchesForUser(
                user.getId(),
                matchStatus,
                isFavorite,
                minScore,
                search
        );
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserJobMatchResponse> getJobById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = authService.getUserByEmail(authentication.getName());
        UserJobMatchResponse match = jobService.getMatchById(id, user.getId());
        return ResponseEntity.ok(match);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserJobMatchResponse> updateMatch(
            @PathVariable Long id,
            @RequestBody MatchUpdateDTO updateDTO,
            Authentication authentication
    ) {
        User user = authService.getUserByEmail(authentication.getName());
        UserJobMatchResponse updated = jobService.updateMatch(id, user.getId(), updateDTO);
        return ResponseEntity.ok(updated);
    }
}
