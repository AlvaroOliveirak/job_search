# 🐍 Job Search — Microserviço Python de Coleta & IA

Módulo especializado em **Python 3** responsável pelas tarefas em que o ecossistema Python se destaca:
1. **Web Scraping & Normalização:** Coleta e deduplicação de vagas de portais de emprego (Gupy, LinkedIn, Infojobs) com geração de hash SHA-256 (`job_hash`).
2. **Motor de IA & NLP (`AIMatcher`):** Análise e cruzamento do perfil do candidato (palavras-chave e habilidades técnicas) com a descrição das oportunidades, calculando um índice de compatibilidade (*Score* de 0 a 100%).
3. **Bot de Notificações Telegram (`TelegramNotifier`):** Disparo de alertas imediatos quando vagas com alto índice de aderência (>= 85%) são detectadas.
4. **Sincronização com o Back-end Principal (`SpringBootSyncClient`):** Envio dos lotes de vagas e notas calculadas para a API Spring Boot em `http://localhost:8080/api/jobs/sync`.

---

## 🚀 Como Executar

### 1. Pré-requisitos
- Python 3.10 ou superior.

### 2. Instalação das dependências
```bash
pip install -r requirements.txt
```

### 3. Execução da esteira completa
```bash
python main.py
```

O script executará a coleta, o cálculo dos scores para o usuário e sincronizará automaticamente com o Spring Boot se o backend estiver em execução.
