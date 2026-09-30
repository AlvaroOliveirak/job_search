package com.jobsearch.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class JobSyncDTO {

    public static class ScrapedJobItem {
        @JsonProperty("job_hash")
        private String jobHash;
        private String title;
        private String company;
        private String location;
        private String url;
        private String description;
        private String source;
        private Double score;

        public String getJobHash() {
            return jobHash;
        }

        public void setJobHash(String jobHash) {
            this.jobHash = jobHash;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }
    }

    @JsonProperty("user_id")
    private Long userId;

    private List<ScrapedJobItem> jobs;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ScrapedJobItem> getJobs() {
        return jobs;
    }

    public void setJobs(List<ScrapedJobItem> jobs) {
        this.jobs = jobs;
    }
}
