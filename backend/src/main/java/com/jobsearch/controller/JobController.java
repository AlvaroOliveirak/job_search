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
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final AuthService authService;

    public JobController(JobService jobService, AuthService authService) {
        this.jobService = jobService;
        this.authService = authService;
    }

    // A rota só é alcançada com JWT válido (SecurityConfig); sem token o Spring já responde 401
    private Long resolveUserId(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<UserJobMatchResponse>> getJobs(
            @RequestParam(required = false) String status,
            @RequestParam(value = "is_favorite", required = false) Boolean isFavorite,
            @RequestParam(value = "min_score", required = false) Double minScore,
            @RequestParam(required = false) String search,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        MatchStatus matchStatus = null;
        if (status != null && !status.isBlank()) {
            matchStatus = MatchStatus.fromValue(status);
        }

        List<UserJobMatchResponse> matches = jobService.getMatchesForUser(
                userId,
                matchStatus,
                isFavorite,
                minScore,
                search
        );
        return ResponseEntity.ok(matches);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshJobs(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        Map<String, Object> result = jobService.triggerManualRefresh(userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserJobMatchResponse> getJobById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        UserJobMatchResponse match = jobService.getMatchById(id, userId);
        return ResponseEntity.ok(match);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserJobMatchResponse> updateMatch(
            @PathVariable Long id,
            @RequestBody MatchUpdateDTO updateDTO,
            Authentication authentication
    ) {
        Long userId = resolveUserId(authentication);
        UserJobMatchResponse updated = jobService.updateMatch(id, userId, updateDTO);
        return ResponseEntity.ok(updated);
    }
}
