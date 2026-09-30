package com.jobsearch.model;

import com.jobsearch.model.enums.MatchStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_job_matches",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_job", columnNames = {"user_id", "job_id"})
    }
)
public class UserJobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private Double score = 0.0;

    @Column(name = "is_notified_telegram", nullable = false)
    private boolean notifiedTelegram = false;

    @Column(name = "is_favorite", nullable = false)
    private boolean favorite = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MatchStatus status = MatchStatus.NEW;

    @Column(name = "matched_at", nullable = false)
    private LocalDateTime matchedAt = LocalDateTime.now();

    public UserJobMatch() {
    }

    public UserJobMatch(User user, Job job, Double score, MatchStatus status) {
        this.user = user;
        this.job = job;
        this.score = score;
        this.status = status != null ? status : MatchStatus.NEW;
        this.matchedAt = LocalDateTime.now();
        this.favorite = false;
        this.notifiedTelegram = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
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
}
