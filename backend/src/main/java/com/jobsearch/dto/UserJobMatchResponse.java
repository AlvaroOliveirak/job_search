package com.jobsearch.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobsearch.model.UserJobMatch;
import com.jobsearch.model.enums.MatchStatus;
import java.time.LocalDateTime;

public class UserJobMatchResponse {

    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("job_id")
    private Long jobId;

    private Double score;

    @JsonProperty("is_notified_telegram")
    private boolean notifiedTelegram;

    @JsonProperty("is_favorite")
    private boolean favorite;

    private MatchStatus status;

    @JsonProperty("matched_at")
    private LocalDateTime matchedAt;

    private JobResponse job;

    public UserJobMatchResponse() {
    }

    public UserJobMatchResponse(UserJobMatch match) {
        if (match != null) {
            this.id = match.getId();
            this.userId = match.getUser() != null ? match.getUser().getId() : null;
            this.jobId = match.getJob() != null ? match.getJob().getId() : null;
            this.score = match.getScore();
            this.notifiedTelegram = match.isNotifiedTelegram();
            this.favorite = match.isFavorite();
            this.status = match.getStatus();
            this.matchedAt = match.getMatchedAt();
            this.job = match.getJob() != null ? new JobResponse(match.getJob()) : null;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public boolean isNotifiedTelegram() {
        return notifiedTelegram;
    }

    public void setNotifiedTelegram(boolean notifiedTelegram) {
        this.notifiedTelegram = notifiedTelegram;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public LocalDateTime getMatchedAt() {
        return matchedAt;
    }

    public void setMatchedAt(LocalDateTime matchedAt) {
        this.matchedAt = matchedAt;
    }

    public JobResponse getJob() {
        return job;
    }

    public void setJob(JobResponse job) {
        this.job = job;
    }
}
