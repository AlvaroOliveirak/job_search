package com.jobsearch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SearchProfileRequest {

    @NotBlank(message = "O nome do perfil é obrigatório.")
    private String name;

    @NotBlank(message = "As palavras-chave são obrigatórias.")
    private String keywords;

    @NotNull(message = "A pontuação mínima é obrigatória.")
    private Integer minScore;

    public SearchProfileRequest() {
    }

    public SearchProfileRequest(String name, String keywords, Integer minScore) {
        this.name = name;
        this.keywords = keywords;
        this.minScore = minScore;
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
}
