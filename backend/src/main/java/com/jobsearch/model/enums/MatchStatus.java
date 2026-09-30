package com.jobsearch.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MatchStatus {
    NEW("new"),
    VIEWED("viewed"),
    APPLIED("applied"),
    INTERVIEW("interview"),
    REJECTED("rejected"),
    DISCARDED("discarded");

    private final String value;

    MatchStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static MatchStatus fromValue(String value) {
        if (value == null) {
            return NEW;
        }
        for (MatchStatus status : values()) {
            if (status.value.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status de match inválido: " + value);
    }
}
