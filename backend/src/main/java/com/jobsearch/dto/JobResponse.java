package com.jobsearch.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobsearch.model.Job;
import java.time.LocalDateTime;

public class JobResponse {

    private Long id;

    @JsonProperty("job_hash")
    private String jobHash;

    private String title;
    private String company;
    private String location;
    private String url;
    private String description;
    private String source;

    @JsonProperty("posted_at")
    private LocalDateTime postedAt;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public JobResponse() {
    }

    public JobResponse(Job job) {
        if (job != null) {
            this.id = job.getId();
            this.jobHash = job.getJobHash();
            this.title = job.getTitle();
            this.company = job.getCompany();
            this.location = job.getLocation();
            this.url = job.getUrl();
            this.description = job.getDescription();
            this.source = job.getSource();
            this.postedAt = job.getPostedAt();
            this.createdAt = job.getCreatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
