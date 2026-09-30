package com.jobsearch.controller;

import com.jobsearch.dto.JobSyncDTO;
import com.jobsearch.dto.UserJobMatchResponse;
import com.jobsearch.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs/sync")
public class JobSyncController {

    private final JobService jobService;

    public JobSyncController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> syncJobs(@RequestBody JobSyncDTO syncDTO) {
        List<UserJobMatchResponse> synced = jobService.syncJobs(syncDTO);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Vagas sincronizadas com sucesso.",
                "total_synced", synced.size()
        ));
    }
}
