package com.jobsearch.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "message", "Job Searcher Spring Boot API está operacional",
                "framework", "Spring Boot 4.1.1 (Java 21 LTS)",
                "version", "1.0.0"
        ));
    }
}
