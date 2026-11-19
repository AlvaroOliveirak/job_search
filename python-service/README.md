# 🐍 Job Search — Pipeline Python de Coleta & IA

Módulo em **Python 3** responsável pelas tarefas em que o ecossistema Python se destaca:

1. **Coleta real de vagas (`scraper.py`):** consulta a API pública do Portal Gupy (`portal.gupy.io/api/job-search/jobs`) com termos derivados das skills do usuário, normaliza a localização (Remoto / Híbrido / Presencial) e deduplica por hash SHA-256 de empresa + título + URL (`job_hash`).
2. **Motor de compatibilidade (`ai_matcher.py`):** compara as skills do candidato com o título e a descrição de cada vaga e calcula o *score* de 0 a 100%.
3. **Alertas (`telegram_notifier.py`):** para vagas com score ≥ 85% monta a mensagem de alerta. Nesta versão o envio é **simulado** (a mensagem é impressa no console).
4. **Sincronização (`sync_client.py`):** envia o lote de vagas pontuadas para `POST /api/jobs/sync` no Spring Boot, autenticando com o header `X-Sync-Token`.

O pipeline usa **apenas a biblioteca padrão** — não há dependências para instalar.

---

## 🚀 Como executar

### Pelo sistema (forma normal)
Com o back-end e o front-end rodando, clique em **"Atualizar Vagas"** na tela de Vagas. O Spring Boot executa `main.py` com as skills do usuário logado e repassa o `SYNC_TOKEN` automaticamente. A saída do script aparece no console do Spring Boot.

### Manualmente pelo terminal
O endpoint de sincronização exige o mesmo `SYNC_TOKEN` nos dois lados:

```bash
# 1. Inicie o back-end com um SYNC_TOKEN conhecido
cd backend
export SYNC_TOKEN=meu-token-local        # PowerShell: $env:SYNC_TOKEN="meu-token-local"
./mvnw spring-boot:run

# 2. Em outro terminal, rode o pipeline com o mesmo valor
cd python-service
export SYNC_TOKEN=meu-token-local        # PowerShell: $env:SYNC_TOKEN="meu-token-local"
python main.py --user_id 1 --name "Candidato" --keywords "React, TypeScript, Java, Spring Boot"
```

| Argumento | Padrão | Descrição |
| :--- | :--- | :--- |
| `--user_id` | `1` | ID do usuário no Spring Boot que receberá as vagas |
| `--name` | `Candidato` | Nome exibido no log e no alerta |
| `--keywords` | stack padrão | Skills separadas por vírgula (até 4 viram termos de busca) |
| `--chat_id` | `123456789` | Chat ID do Telegram (alerta simulado) |

| Variável de ambiente | Padrão | Descrição |
| :--- | :--- | :--- |
| `SYNC_TOKEN` | — | Token exigido por `/api/jobs/sync` (sem ele a sincronização responde 401) |
| `SPRING_API_URL` | `http://localhost:8082` | URL do back-end Spring Boot |

O script termina com código de saída `1` se a sincronização falhar; o Spring Boot usa isso para avisar o usuário em vez de exibir "sucesso".
