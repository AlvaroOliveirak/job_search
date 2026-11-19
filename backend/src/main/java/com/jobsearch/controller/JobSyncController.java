package com.jobsearch.controller;

import com.jobsearch.dto.JobSyncDTO;
import com.jobsearch.dto.UserJobMatchResponse;
import com.jobsearch.security.SyncTokenProvider;
import com.jobsearch.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs/sync")
public class JobSyncController {

    private final JobService jobService;
    private final SyncTokenProvider syncTokenProvider;

    public JobSyncController(JobService jobService, SyncTokenProvider syncTokenProvider) {
        this.jobService = jobService;
        this.syncTokenProvider = syncTokenProvider;
    }

    /**
     * Recebe as vagas coletadas pelo pipeline Python.
     * Não usa JWT (o Python não tem usuário logado): exige o token interno no header X-Sync-Token.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> syncJobs(
            @RequestHeader(value = "X-Sync-Token", required = false) String syncToken,
            @RequestBody JobSyncDTO syncDTO
    ) {
        if (!syncTokenProvider.matches(syncToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token de sincronização ausente ou inválido.");
        }

        List<UserJobMatchResponse> synced = jobService.syncJobs(syncDTO);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Vagas sincronizadas com sucesso.",
                "total_synced", synced.size()
        ));
    }
}
