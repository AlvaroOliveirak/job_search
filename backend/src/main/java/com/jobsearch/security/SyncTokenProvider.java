package com.jobsearch.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.UUID;

/**
 * Token compartilhado entre o Spring Boot e o pipeline Python para o endpoint /api/jobs/sync.
 *
 * Se a variável SYNC_TOKEN estiver definida, ela é usada (permite rodar o Python manualmente).
 * Caso contrário, um token aleatório é gerado a cada inicialização e repassado ao Python
 * pela variável de ambiente do processo filho — nunca é impresso em log.
 */
@Component
public class SyncTokenProvider {

    private final String token;

    public SyncTokenProvider(@Value("${app.sync.token:}") String configuredToken) {
        this.token = (configuredToken == null || configuredToken.isBlank())
                ? UUID.randomUUID().toString()
                : configuredToken.trim();
    }

    public String getToken() {
        return token;
    }

    /** Comparação em tempo constante para não vazar o token por diferença de tempo de resposta. */
    public boolean matches(String candidate) {
        if (candidate == null) {
            return false;
        }
        return MessageDigest.isEqual(
                token.getBytes(StandardCharsets.UTF_8),
                candidate.getBytes(StandardCharsets.UTF_8)
        );
    }
}
