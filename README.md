# ⚡ Job Search — Plataforma Inteligente de Carreiras & Match IA

> **Projeto Evolutivo — Disciplina de Desenvolvimento de Software (AV1 & AV2)**  
> Plataforma Full-Stack integrada com Front-End em **React 19 + TypeScript + Vite**, Back-End RESTful em **Java 21 LTS + Spring Boot 3**, e Microsserviço de Coleta e Inteligência Artificial em **Python (Scraping Gupy + NLP Matcher + Telegram Alerts)**.

---

## 1. Problema e Público

### 1.1 O Problema
No mercado de tecnologia, candidatos perdem horas preenchendo formulários repetitivos e navegando por dezenas de portais distintos sem saber se seus perfis realmente atendem às exigências das vagas. A falta de transparência sobre competências necessárias e o longo tempo de resposta nos processos seletivos causam desgaste e desmotivação.

### 1.2 O Público-Alvo
- **Desenvolvedores e Profissionais de TI** (Estágio, Júnior, Pleno e Sênior) que buscam oportunidades compatíveis com suas stacks tecnológicas (React, TypeScript, Java, Python, Docker, etc.).
- **Profissionais em Transição de Carreira** que precisam de direcionamento ágil sobre sua aderência (Match Score) em relação aos requisitos reais demandados pelas empresas.

---

## 2. 👥 Integrantes da Equipe

| Integrante | Contato / GitHub | Principais Contribuições |
| :--- | :--- | :--- |
| **Álvaro Oliveira** | `alvarooliver1802@gmail.com` | • Arquitetura do monorepo e padronização do Front-End na raiz.<br>• Landing Page Institucional (`Init.tsx`) e renderização condicional de autenticação.<br>• Formulários controlados com validação estrita e mensagens em pt-BR (`Login.tsx`, `Register.tsx`).<br>• Painel de gestão de candidaturas (`Candidaturas.tsx`) com cálculo de KPIs em tempo real.<br>• Gerenciamento global de autenticação com Context API (`AuthContext`, `AuthProvider`, `useAuth`).<br>• Integração com JWT Bearer Token, configuração de CORS e resolução de compatibilidade do ecossistema. |
| **Juan Pablo** | `juandeooliveira@gmail.com` | • Modelagem do domínio de vagas (`Job`, `MatchStatus`, `UserJobMatch`) e perfil ativo.<br>• Criação da página de perfil e competências com autocomplete LinkedIn-style (`Perfil.tsx`, `skillsCatalog.ts`).<br>• Feed interativo de vagas (`JobCard.tsx`, `JobModal.tsx`) com badges de publicação recente e tempo relativo.<br>• Botão de atualização manual de vagas sob demanda e barra de sincronização na Home.<br>• Implementação do Scraper real da API da Gupy com SHA-256 e motor de IA/NLP em Python.<br>• Endpoints de skills (`SkillController`), perfis ativos e recálculo instantâneo no Spring Boot. |

---

## 3. 📁 Estrutura do Monorepo

O projeto está organizado na raiz do repositório em três módulos integrados:

```plaintext
job_search/
├── src/                    # 🚀 Front-End Principal (React 19 + TypeScript + Vite)
│   ├── components/         # Componentes reutilizáveis (JobCard, JobModal, Logo, Footer, ResumeUpload...)
│   ├── context/            # Autenticação global com Context API (AuthContext, AuthProvider)
│   ├── data/               # Catálogo canônico de 60+ skills de TI (skillsCatalog.ts) e fallback local
│   ├── hooks/              # Custom hook useAuth
│   ├── pages/              # Telas da aplicação (Init, Home, Candidaturas, Perfil, Login, Register)
│   ├── services/           # Camada de comunicação com API Spring Boot (api.ts, jobStorage.ts, profileService.ts)
│   ├── styles/             # CSS Modules escopados por tela/componente
│   ├── types/              # Definições estritas de tipos TypeScript (job.ts, profile.ts)
│   └── utils/              # Formatadores de data relativa e validação de publicação recente (dateUtils.ts)
├── backend/                # ☕ Back-End RESTful (Java 21 LTS + Spring Boot 3 + H2 Database)
│   ├── src/main/java/com/jobsearch/
│   │   ├── config/         # Carga inicial de sementes e configurações (DataSeeder.java)
│   │   ├── controller/     # Endpoints REST (AuthController, JobController, SearchProfileController, SkillController)
│   │   ├── dto/            # Data Transfer Objects (Login, Register, JobSync, Profile, MatchUpdate)
│   │   ├── model/          # Entidades JPA (User, Job, UserJobMatch, SearchProfile)
│   │   ├── repository/     # Interfaces Spring Data JPA (UserRepository, JobRepository, etc.)
│   │   ├── security/       # Spring Security, JWT Auth Filter e TokenService
│   │   └── service/        # Regras de negócio, recálculo de match e gatilho de scraping
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
├── python-service/         # 🐍 Microserviço de Scraping, IA e Notificações
│   ├── scraper.py          # Coleta ao vivo da API pública da Gupy com deduplicação por hash SHA-256
│   ├── ai_matcher.py       # Motor de processamento de linguagem natural (NLP) e cálculo de aderência
│   ├── telegram_notifier.py# Envio de alertas instantâneos de vagas de alto match para o Telegram
│   ├── sync_client.py      # Cliente HTTP para sincronização automática com o backend na porta 8082
│   └── main.py             # Orquestrador com suporte a CLI dinâmica (--keywords, --user_id, etc.)
├── package.json            # Configuração e scripts npm do Front-End
└── vite.config.ts          # Configuração do Vite
```

---

## 4. 🌟 Funcionalidades Implementadas

### 4.1 Front-End (React + TypeScript)
- [x] **Landing Page Institucional (`/`):** Comunicação de proposta de valor, métricas dinâmicas, categorias em destaque, FAQ interativo e cabeçalho com renderização condicional para usuários autenticados.
- [x] **Feed de Vagas Inteligente (`/home`):**
  - Vagas com badge de afinidade IA (`★ % Match`), plataforma de origem e indicador de vagas publicadas recentemente (`⚡ Recente`).
  - Data de publicação amigável relativa (`Há 2 horas`, `Ontem`, `Há 3 dias`).
  - Botão **"🚀 Buscar Vagas Manualmente"** para varrer a Gupy e recalcular compatibilidade em tempo real.
  - Barra de status de sincronização exibindo a fonte de dados e o timestamp da última coleta.
  - Modal com descrição integral dos requisitos e controle de status da candidatura.
- [x] **Perfil de Habilidades & Matching (`/perfil`):**
  - Autocomplete estilo LinkedIn conectado ao catálogo canônico de mais de 60 tecnologias de TI.
  - Inclusão e exclusão de tags de competências com navegação fluida por teclado (setas, Enter, Esc).
  - Configuração da nota mínima de corte para alertas e definição de Telegram Chat ID.
  - Ao salvar o perfil, a aderência de todas as vagas salvas é recalculada imediatamente pela IA.
- [x] **Painel de Acompanhamento de Candidaturas (`/candidaturas`):**
  - Painel de KPIs dinâmicos (Total de Candidaturas, Em Análise, Entrevistas Agendadas, Média de Match).
  - Abas de filtragem por etapa do processo seletivo e alteração de status em tempo real.
- [x] **Autenticação Segura (`/login` e `/Register`):**
  - Formulários controlados com validação reativa e exibição de mensagens amigáveis em português.
  - Armazenamento seguro de Token JWT e sincronização com Context API.
- [x] **Persistência Híbrida e Resiliência Offline:**
  - Acesso direto aos endpoints Spring Boot quando o servidor estiver ativo.
  - Fallback transparente com `localStorage` caso o serviço externo esteja temporariamente offline.

### 4.2 Back-End (Spring Boot 3 + Java 21)
- [x] **API de Autenticação JWT (`/api/auth`):** Registro e login criptografados com BCrypt e emissão de tokens JWT stateless.
- [x] **Taxonomia de Competências (`/api/skills`):** Catálogo padronizado de habilidades de tecnologia com busca instantânea via query parameter.
- [x] **Gerenciamento de Perfis Ativos (`/api/profiles/active`):** Consulta e atualização do perfil de busca e skills do candidato conectado.
- [x] **Sincronização de Vagas (`/api/jobs/sync`):** Endpoint que recebe lotes de vagas do pipeline Python, garantindo persistência deduplicada por `job_hash`.
- [x] **Gatilho de Atualização Manual (`POST /api/jobs/refresh`):** Executa o pipeline Python sob demanda repassando as competências do usuário e retornando as vagas atualizadas.
- [x] **Recálculo Instantâneo de Score:** Algoritmo no `JobService` que atualiza as notas de aderência logo após qualquer modificação nas habilidades do candidato.
- [x] **Segurança e CORS:** Rotas públicas e protegidas organizadas via `SecurityConfig`, suporte a chamadas cruzadas e visualizador Web do H2 Console.

### 4.3 Pipeline Python (Scraping & IA)
- [x] **Live Gupy Scraper:** Consumo direto da API oficial da Gupy sem necessidade de navegadores headless pesados.
- [x] **Deduplicação Criptográfica:** Geração de hash SHA-256 combinando empresa, título e URL para evitar duplicatas no banco de dados.
- [x] **NLP Matcher:** Análise de relevância textual comparando as skills do usuário com o título e corpo da vaga.
- [x] **Notificações Telegram:** Disparo automático de alertas para oportunidades com match igual ou superior a 85%.

---

## 5. 🗺️ Rotas do Front-End

| Rota | Componente | Finalidade |
| :--- | :--- | :--- |
| `/` | `<Init />` | Landing page institucional de apresentação do produto. |
| `/home` | `<Home />` | Painel de oportunidades com busca, filtros de match e atualização ao vivo. |
| `/perfil` | `<Perfil />` | Gestão de competências, autocomplete LinkedIn-style e preferências de alertas. |
| `/candidaturas` | `<Candidaturas />` | Painel de controle e acompanhamento das etapas seletivas com KPIs. |
| `/Register` | `<Register />` | Formulário controlado para cadastro de novos candidatos. |
| `/login` | `<Login />` | Tela de autenticação com validação estrita e suporte a JWT. |

---

## 6. 🛠️ Como Executar a Aplicação

### Pré-requisitos
- **Node.js** (versão 18+) e **npm**
- **Java JDK 21** configurado no PATH
- **Python 3.10+** (para o serviço de coleta e IA)

---

### Passo 1: Executar o Back-End (Spring Boot)

Abra um terminal na pasta do backend:

```bash
cd backend
./mvnw spring-boot:run
```
*(No Windows PowerShell: `./mvnw spring-boot:run`)*

* **Porta:** `http://localhost:8082`
* **H2 Console:** `http://localhost:8082/h2-console`  
  * *JDBC URL:* `jdbc:h2:mem:jobsearchdb`  
  * *User:* `sa` | *Password:* *(em branco)*

---

### Passo 2: Executar o Front-End (React + Vite)

Abra outro terminal na **raiz do projeto**:

```bash
# Instalar as dependências (se ainda não tiver instalado)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

* **Acesso Web:** `http://localhost:5173`
* **Build de Produção e Validação TypeScript:**
  ```bash
  npm run build
  ```

---

### Passo 3: Executar o Pipeline de Coleta Python (Opcional / Manual)

O Spring Boot já consegue acionar o script Python automaticamente pelo botão **"Buscar Vagas Manualmente"** na interface. Caso deseje executar o pipeline de forma independente pelo terminal:

```bash
cd python-service
python main.py --user_id 1 --keywords "React, TypeScript, Java, Spring Boot, Docker"
```

---

## 7. 🔑 Usuários Pré-configurados (Seed Inicial)

O banco de dados H2 inicializa com usuários de demonstração prontos para teste:

| E-mail | Senha | Nome | Perfil / Stack |
| :--- | :--- | :--- | :--- |
| `alvarooliver1802@gmail.com` | `123456` | Alvaro Oliver | Front-End & Full-Stack (React, TypeScript, Java) |
| `demo@jobsearch.com` | `123456` | Usuário Demo | Back-End & Dados (Python, SQL, Docker, AWS) |

---

## 8. 📋 Conformidade de Critérios Acadêmicos

- [x] **Comunicação e Proposta de Valor:** Apresentação clara de benefícios, fluxo do produto e FAQ (`/`).
- [x] **Formulários Controlados e Validação:** Validação reativa de campos, tratamento de erros de rede e formato em pt-BR.
- [x] **Gestão de Estado Global:** Autenticação stateless via Context API e JWT tokens integrados.
- [x] **Feed de Vagas & Compatibilidade:** Listagem em grid responsivo com notas de aderência e filtros com `useMemo`.
- [x] **Gestão de Candidaturas & KPIs:** Atualização dinâmica de status (`applied`, `viewed`, `interview`, `discarded`) e cálculo de métricas agregadas.
- [x] **Página de Perfil Interativa:** Tags visuais de competências com autocomplete LinkedIn e recálculo instantâneo de aderência.
- [x] **Arquitetura em Camadas:** Repository Pattern no frontend com tolerância a falhas offline e separação estrita de responsabilidades no backend (Controller, Service, Repository, DTO).
- [x] **Design e Responsividade:** CSS Modules com paleta Dark/Neon, microinterações, estados de loading e toasts de feedback de ações.
