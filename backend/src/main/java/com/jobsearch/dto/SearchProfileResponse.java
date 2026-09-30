package com.jobsearch.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobsearch.model.SearchProfile;
import java.time.LocalDateTime;

public class SearchProfileResponse {

    private Long id;
    private String name;
    private String keywords;

    @JsonProperty("min_score")
    private Integer minScore;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public SearchProfileResponse() {
    }

    public SearchProfileResponse(SearchProfile profile) {
        if (profile != null) {
            this.id = profile.getId();
            this.name = profile.getName();
            this.keywords = profile.getKeywords();
            this.minScore = profile.getMinScore();
            this.createdAt = profile.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public Integer getMinScore() {
        return minScore;
    }

    public void setMinScore(Integer minScore) {
        this.minScore = minScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
