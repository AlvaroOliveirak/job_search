# ⚡ Job Search — Plataforma Inteligente de Carreiras & Match IA

> **Projeto Evolutivo — Disciplina de Front-end Frameworks (AV1 & AV2) — Opção B (back-end próprio)**
> Front-End em **React 19 + TypeScript + Vite**, API RESTful em **Java 21 + Spring Boot 4.1.1** e pipeline de coleta e compatibilidade em **Python** (vagas reais da Gupy). Tudo neste mesmo repositório (monorepo): front-end na raiz, back-end em [`backend/`](backend/) e pipeline em [`python-service/`](python-service/).

---

## 1. Problema e Público

### 1.1 O Problema
No mercado de tecnologia, candidatos perdem horas preenchendo formulários repetitivos e navegando por dezenas de portais distintos sem saber se seus perfis realmente atendem às exigências das vagas. A falta de transparência sobre competências necessárias e o longo tempo de resposta nos processos seletivos causam desgaste e desmotivação.

### 1.2 O Público-Alvo
- **Desenvolvedores e Profissionais de TI** (Estágio, Júnior, Pleno e Sênior) que buscam oportunidades compatíveis com suas stacks tecnológicas (React, TypeScript, Java, Python, Docker, etc.).
- **Profissionais em Transição de Carreira** que precisam de direcionamento ágil sobre sua aderência (Match Score) em relação aos requisitos reais demandados pelas empresas.

---

## 2. 👥 Integrantes e Contribuição

| Integrante | Contato | Principais contribuições |
| :--- | :--- | :--- |
| **Álvaro Oliveira** | `alvarooliver1802@gmail.com` | **AV1:** estrutura inicial React + Vite, landing page (`Init.tsx`), formulários controlados (`Login.tsx`, `Register.tsx`), painel de candidaturas com KPIs (`Candidaturas.tsx`), Context API de autenticação (`AuthContext`, `useAuth`), seed `vagas.json`.<br>**AV2:** front-end movido para a raiz / monorepo (`65cda5d`), mensagens de erro de rede e HTTP em pt-BR (`4266f02`), integração das branches de perfil e scraper (`9bd62db`), revisão visual (`3375fb1`), README (`323fb46`, `1223147`), limpeza do repositório (`6e07c3a`, `df20d33`). |
| **Juan Pablo** | `juandeooliveira@gmail.com` | **AV1:** tipos de domínio (`types/job.ts`), repositório `jobStorage.ts` com `localStorage`, `JobCard`, `JobModal`, `Home.tsx` com busca e filtros.<br>**AV2:** cliente HTTP central com JWT (`b7b91b0`), login/cadastro na API (`688cb16`), `jobStorage` na API (`ada3d54`), porta 8082 (`529ec22`); página de Perfil, autocomplete de skills, `/api/skills`, perfil ativo com recálculo de score, scraper real da Gupy e botão "Atualizar Vagas" — commits `7fc99d7`, `5a4245b`, `148d227`, `cdc67fc`, `c1f4331`, `a0833f1` nas branches `feat/live-gupy-scraper` e `feat/user-skills-profile` (integradas ao `main` via `9bd62db`); filtro pelo perfil (`fb1b138`); correções de cadastro e de dados entre contas (`4d5526b`, `1d2ca56`); rota protegida, tratamento de 401/403, estados de erro e modo offline, token do sync (branch `feat/av2-pendencias`). |

---

## 3. 📁 Estrutura do Monorepo

```plaintext
job_search/
├── src/                    # Front-End (React 19 + TypeScript + Vite)
│   ├── pages/              # Telas ligadas a rotas (Init, Home, Candidaturas, Perfil, Login, Register)
│   ├── components/         # Peças reutilizáveis (JobCard, JobModal, Logo, Footer, ResumeUpload, ProtectedRoute)
│   ├── services/           # Única camada que acessa a rede: api.ts (fetch + JWT + erros), jobStorage.ts, profileService.ts
│   ├── context/            # Sessão global (AuthContext, AuthProvider)
│   ├── hooks/              # useAuth — acesso tipado ao contexto de autenticação
│   ├── types/              # Contratos TypeScript iguais ao JSON da API (job.ts, profile.ts)
│   ├── data/               # Dados estáticos: catálogo de skills e vagas de demonstração (contingência)
│   ├── utils/              # Funções puras de data (tempo relativo, selo "Nova")
│   └── styles/             # CSS Modules por tela/componente
├── backend/                # API REST (Java 21 + Spring Boot 4.1.1 + Spring Security + JWT + H2)
│   └── src/main/java/com/jobsearch/
│       ├── config/         # DataSeeder (usuários e perfis de demonstração)
│       ├── controller/     # AuthController, JobController, JobSyncController, SearchProfileController, SkillController
│       ├── dto/            # Corpos de requisição/resposta
│       ├── model/          # Entidades JPA (User, Job, UserJobMatch, SearchProfile)
│       ├── repository/     # Spring Data JPA
│       ├── security/       # SecurityConfig, JwtAuthenticationFilter, JwtTokenProvider, SyncTokenProvider
│       └── service/        # Regras de negócio, recálculo de score e disparo do pipeline Python
├── python-service/         # Pipeline de coleta (Gupy) + compatibilidade + sincronização (só biblioteca padrão)
├── .env.example            # VITE_API_URL do front-end
└── backend/.env.example    # JWT_SECRET e SYNC_TOKEN (opcionais em desenvolvimento)
```

---

## 4. 🌟 Funcionalidades

### 4.1 Front-End
- **Landing page (`/`):** proposta de valor, métricas, categorias, FAQ e cabeçalho que muda conforme a sessão.
- **Login e cadastro (`/login`, `/Register`):** formulários controlados com validação (e-mail, senha ≥ 6, confirmação de senha), mensagens de erro de API em pt-BR e upload de currículo no cadastro.
- **Área protegida:** `/home`, `/candidaturas` e `/perfil` só abrem com sessão; sem ela o usuário é levado ao login e volta para a página pedida depois de entrar.
- **Vagas (`/home`):** cards com nota de compatibilidade, origem, selo "Nova" e data relativa; busca, filtro por nota (inicializado pelo perfil) e favoritos; modal com descrição e status; botão **"Atualizar Vagas"** que busca vagas reais na Gupy.
- **Candidaturas (`/candidaturas`):** KPIs, abas por etapa e alteração de status.
- **Perfil (`/perfil`):** cargo, skills com autocomplete, nota mínima e Telegram Chat ID; salvar recalcula a nota das vagas.
- **Estados de requisição:** carregamento, sucesso, vazio e erro com **"Tentar novamente"** em Vagas, Candidaturas e Perfil.
- **Modo offline (contingência):** na tela de erro, "Usar dados salvos" exibe a última resposta da API guardada no navegador (ou vagas de demonstração), com faixa de aviso e alterações bloqueadas.

### 4.2 Back-End
- **Autenticação JWT (`/api/auth`):** cadastro e login com senha em BCrypt e token JWT stateless (24 h).
- **Proteção:** `/api/jobs/**` e `/api/profiles/**` exigem JWT válido; sem token ou com token inválido/expirado a resposta é **401**.
- **Vagas (`/api/jobs`):** listagem por usuário, alteração de favorito/status e `POST /api/jobs/refresh`, que executa o pipeline Python com as skills do usuário.
- **Perfil ativo (`/api/profiles/active`)** com recálculo imediato do score e **catálogo de skills (`/api/skills`)**, público.
- **Sincronização (`/api/jobs/sync`):** recebe as vagas do Python, deduplica por `job_hash` e exige o header `X-Sync-Token`.

### 4.3 Pipeline Python
- Coleta vagas reais da API pública da Gupy usando até 4 skills do usuário como termos de busca.
- Deduplica por SHA-256 (empresa + título + URL), calcula a compatibilidade e envia ao Spring Boot.
- Alerta de Telegram para nota ≥ 85% (**simulado**: a mensagem é impressa no console).

---

## 5. 🗺️ Rotas da Aplicação

| Rota | Componente | Acesso | Finalidade |
| :--- | :--- | :--- | :--- |
| `/` | `<Init />` | Pública | Landing page institucional. |
| `/login` (`/Login`) | `<Login />` | Pública | Autenticação com JWT. |
| `/Register` | `<Register />` | Pública | Cadastro de candidato. |
| `/home` | `<Home />` | **Protegida** | Vagas recomendadas, filtros e "Atualizar Vagas". |
| `/candidaturas` (`/applications`) | `<Candidaturas />` | **Protegida** | Acompanhamento das etapas e KPIs. |
| `/perfil` (`/profile`) | `<Perfil />` | **Protegida** | Skills, nota mínima e preferências. |

As rotas protegidas ficam dentro de `<ProtectedRoute />` em [`src/App.tsx`](src/App.tsx).

---

## 6. 🛠️ Tecnologias

| Camada | Tecnologias |
| :--- | :--- |
| Front-End | React 19, TypeScript, Vite, React Router DOM 7, CSS Modules, Context API, Fetch API, `localStorage` |
| Back-End | Java 21, Spring Boot 4.1.1, Spring Web, Spring Security, Spring Data JPA, JJWT 0.12, BCrypt, H2 (em memória) |
| Pipeline | Python 3.10+ (somente biblioteca padrão: `urllib`, `json`, `hashlib`, `re`, `argparse`) |
| Ferramentas | ESLint, Maven Wrapper, Git/GitHub |

---

## 7. ▶️ Como Executar

### Pré-requisitos
- **Node.js 18+** e **npm**
- **Java JDK 21** no PATH
- **Python 3.10+** no PATH como `python` (Windows) ou `python3` (Linux/macOS), usado pelo botão "Atualizar Vagas"

### Passo 1 — Back-End (porta 8082)
```bash
cd backend
./mvnw spring-boot:run
```
- Variáveis **opcionais** (ver [`backend/.env.example`](backend/.env.example)): `JWT_SECRET` (chave Base64 de produção) e `SYNC_TOKEN` (só para rodar o Python manualmente).
- H2 Console: `http://localhost:8082/h2-console` — JDBC URL `jdbc:h2:mem:jobsearchdb`, usuário `sa`, senha em branco.

### Passo 2 — Front-End (porta 5173)
Na **raiz** do repositório:
```bash
cp .env.example .env      # opcional: o padrão já é http://localhost:8082
npm install
npm run dev
```
Build e validação de tipos: `npm run build` · Lint: `npm run lint`.

### Passo 3 — Pipeline Python (opcional, manual)
O botão **"Atualizar Vagas"** já executa o pipeline. Para rodar pelo terminal, inicie o back-end e o Python com o **mesmo** `SYNC_TOKEN` — instruções em [`python-service/README.md`](python-service/README.md).

### Usuários de demonstração
O banco H2 é recriado a cada inicialização com:

| E-mail | Senha | Perfil |
| :--- | :--- | :--- |
| `alvarooliver1802@gmail.com` | `123456` | Front-End & Full-Stack (React, TypeScript, Java) |
| `demo@jobsearch.com` | `123456` | Back-End & Dados (Python, SQL, Docker, AWS) |

> Senhas **apenas de demonstração** (armazenadas com BCrypt no banco em memória). Contas novas começam sem vagas: use "Atualizar Vagas" para coletar.

---

## 8. 💾 Dados e Persistência

| Dado | Onde fica | Observação |
| :--- | :--- | :--- |
| Usuários, perfis, vagas, favoritos, status | **API Spring Boot** (H2) | Fonte de verdade. Recriado a cada inicialização do back-end. |
| Vagas novas | **Gupy** → Python → `/api/jobs/sync` | Coletadas sob demanda pelo botão "Atualizar Vagas". |
| `job_search_token` | `localStorage` | Token JWT (expira em 24 h), enviado como `Authorization: Bearer`. |
| `job_search_auth` | `localStorage` | Dados públicos do usuário (id, nome, e-mail) para restaurar a sessão após F5. |
| `job_search_matches`, `job_search_user_profile`, `job_search_last_updated` | `localStorage` | **Cache** da última resposta da API, usado só no modo offline. Apagado no login e no logout. |
| Catálogo de skills | `src/data/skillsCatalog.ts` | Estático, usado no autocomplete. |
| Vagas de demonstração | `src/data/vagas.json` | Contingência quando a API está fora e não há cache (origem "Demonstração"). |

**A senha nunca é armazenada no navegador:** ela só trafega no corpo do `POST /api/auth/login` ou `/register`.

---

## 9. 📜 Contrato da API

**URL-base:** `http://localhost:8082` (configurável no front por `VITE_API_URL`, em [`src/services/api.ts`](src/services/api.ts)). JSON em todas as rotas. CORS liberado para `http://localhost:5173`, `http://127.0.0.1:5173` e `http://localhost:3000`.

**Autenticação:** rotas marcadas com 🔒 exigem `Authorization: Bearer <token>`.

| Método | Rota | Corpo | Resposta (sucesso) | Erros |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `{ name, email, password }` | `201` `{ access_token, token_type, user: { id, email, name, telegramChatId } }` | `400` e-mail já cadastrado ou dados inválidos |
| `POST` | `/api/auth/login` | `{ email, password }` | `200`, mesmo formato do cadastro | `401` credenciais inválidas · `403` usuário inativo |
| `GET` 🔒 | `/api/jobs` | — (filtros opcionais `status`, `isFavorite`, `minScore`, `search`) | `200` `[ { id, user_id, job_id, score, status, is_favorite, is_notified_telegram, matched_at, job: { id, job_hash, title, company, location, url, description, source, posted_at, created_at } } ]` | `401` |
| `PATCH` 🔒 | `/api/jobs/{id}` | `{ is_favorite }` e/ou `{ status }` (`new`, `viewed`, `applied`, `interview`, `rejected`, `discarded`) | `200` item atualizado | `401` · `404` |
| `POST` 🔒 | `/api/jobs/refresh` | — | `200` `{ status: "success" \| "info", message, total_jobs, updated_at, matches }` | `401` · o pipeline tem limite de 40 s; se falhar, `status: "info"` com as vagas já salvas |
| `GET` 🔒 | `/api/profiles/active` | — | `200` `{ id, name, keywords, min_score, created_at }` | `401` |
| `PUT` 🔒 | `/api/profiles/active` | `{ name, keywords, minScore }` | `200` perfil salvo (o score das vagas é recalculado) | `400` campos vazios · `401` |
| `GET` | `/api/skills?search=` | — | `200` `[ { name, category } ]` | — |
| `POST` | `/api/jobs/sync` | Header `X-Sync-Token` · `{ user_id, jobs: [ { job_hash, title, company, location, url, description, source, score, posted_at } ] }` | `200` `{ status, message, total_synced }` | `401` token de sincronização ausente/inválido |

**Formato dos erros:** `{ timestamp, status, error, message, path }`. O front exibe `message` quando existe e, caso contrário, uma frase em pt-BR por status (`0` rede, `400`, `401`, `403`, `404`, `409`, `422`, `5xx`).

**Como a interface reage:**
- `401` em rota protegida → sessão encerrada e redirecionamento para `/login` com "Sua sessão expirou".
- `401` no login → "E-mail ou senha incorretos." no formulário.
- `403` → mensagem "Acesso negado", sem encerrar a sessão.
- Falha de rede → estado de erro com "Tentar novamente" e "Usar dados salvos (offline)".

---

## 10. 🔄 Evolução da AV1 para a AV2

| Aspecto | Situação na AV1 | Evolução na AV2 | Evidência |
| :--- | :--- | :--- | :--- |
| Dados | `vagas.json` com 4 vagas lido do `localStorage` (atraso artificial de 350 ms) | Vagas da API Spring Boot, coletadas na Gupy pelo Python; `localStorage` vira cache do modo offline | `src/services/jobStorage.ts` (`fetchJobs`, `manualRefreshJobs`, `updateMatch`); commits `b7b91b0`, `ada3d54` |
| Autenticação | Simulada: qualquer e-mail entrava, sem checar senha | Login/cadastro com JWT, rota protegida, 401 encerra a sessão, logout limpa tudo; back-end exige token | `AuthProvider.tsx`, `ProtectedRoute.tsx`, `api.ts`, `SecurityConfig.java`; commits `688cb16`, `4266f02`, `4d5526b`, `1d2ca56` e branch `feat/av2-pendencias` |
| Estados da interface | Lista e vazio | Carregamento, sucesso, vazio, erro com "Tentar novamente" e modo offline | `Home.tsx`, `Candidaturas.tsx`, `Perfil.tsx`; commit `fb1b138` e branch `feat/av2-pendencias` |
| Organização | Front em `job_searcher/`, um único serviço | Front na raiz com `services/`, `types/`, `utils/`, `components/ProtectedRoute`; back-end e pipeline no mesmo repositório | commits `65cda5d`, `9bd62db` |
| Funcionalidades novas | — | Página de Perfil com skills, coleta real na Gupy, recálculo de score | branches `feat/live-gupy-scraper`, `feat/user-skills-profile` |
| Preservado da AV1 | — | Landing page, filtros, favoritos, modal de detalhes, KPIs de candidaturas, toasts, upload de currículo, mesmas rotas | `src/pages/*`, tag `entrega-av1` |
| Removido de propósito | Login social fictício (Google/LinkedIn), checkbox "Lembrar de mim" e link "Esqueceu a senha?" | Removidos por serem apenas visuais (sem funcionamento real) | `Login.tsx` |

---

## 11. ⚠️ Limitações e Contingência

**Contingência:** se a API cair, as telas mostram o erro com **"Tentar novamente"** e **"Usar dados salvos (offline)"**. No modo offline, os dados vêm da última resposta da API guardada no navegador ou, se não houver, das vagas de demonstração; uma faixa avisa que são dados locais e favoritar, mudar status e atualizar vagas ficam bloqueados até reconectar.

**Limitações conhecidas:**
- **H2 em memória:** reiniciar o back-end apaga usuários criados e vagas coletadas; tokens antigos passam a receber 401 e o usuário volta ao login.
- **Token no `localStorage`:** prático para o projeto, mas exposto a XSS; em produção usaríamos cookie `HttpOnly`.
- **Telegram simulado:** o alerta é impresso no console do pipeline.
- **Duas fórmulas de score:** o Python calcula a nota na coleta; ao salvar o perfil, o Java recalcula por proporção de skills encontradas (40 + proporção × 58).
- **"Atualizar Vagas" é síncrono:** a requisição espera o pipeline (limite de 40 s) e depende de `python` no PATH.
- **Sem recuperação de senha:** o link "Esqueceu a senha?" da AV1 era apenas visual e foi removido; não há fluxo de redefinição de senha.

---

## 12. 🤖 Uso de Inteligência Artificial

Foram utilizadas duas ferramentas de IA como apoio da equipe:

- **Claude Code** (Anthropic), no VS Code;
- **Gemini** (Google), por meio do **Antigravity**.

**Para quê:** comparação e revisão dos códigos na preparação da AV1 e da AV2. Isso incluiu comparar o estado do projeto entre as entregas, revisar o atendimento aos requisitos e apontar ajustes.

**Como validamos:** todas as sugestões foram revisadas pela equipe e testadas com `npm run build`, `npm run lint`, compilação do back-end, chamadas aos endpoints da API e uso da aplicação no navegador.
