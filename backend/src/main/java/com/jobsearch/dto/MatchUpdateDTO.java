package com.jobsearch.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobsearch.model.enums.MatchStatus;

public class MatchUpdateDTO {

    @JsonProperty("is_favorite")
    private Boolean isFavorite;

    private MatchStatus status;

    public MatchUpdateDTO() {
    }

    public MatchUpdateDTO(Boolean isFavorite, MatchStatus status) {
        this.isFavorite = isFavorite;
        this.status = status;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }
}
