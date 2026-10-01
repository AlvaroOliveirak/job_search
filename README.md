# ⚡ Job Search — Plataforma Inteligente de Carreiras & Match IA

> **Projeto Evolutivo — Disciplina de Desenvolvimento de Software**  
> **Entrega Oficial: Avaliação AV1 (Front-End)**  
> Protótipo Front-End funcional e moderno desenvolvido com **React 19**, **TypeScript** e **Vite**, com gerenciamento de rotas via React Router v7, arquitetura de contexto (`AuthContext`), persistência local (`localStorage`) e interface responsiva com design Dark/Neon em CSS Modules.

---

## 👥 Integrantes da Equipe

| Integrante | E-mail / GitHub | Principais Contribuições |
| :--- | :--- | :--- |
| **Álvaro Oliveira** | `alvarooliver1802@gmail.com` | • Arquitetura inicial Front-End (React + TypeScript + Vite).<br>• Landing Page Institucional (`Init.tsx`) e renderização condicional.<br>• Controle e validação de formulários (`Login.tsx`, `Register.tsx`).<br>• Painel de gestão de candidaturas (`Candidaturas.tsx`) com KPIs em tempo real.<br>• Autenticação e persistência global com Context API (`AuthContext.ts`, `AuthProvider.tsx`, `useAuth.ts`).<br>• Coordenação de merges e conformidade com os critérios da AV1. |
| **Juan Pablo** | `juandeooliveira@gmail.com` | • Modelagem das interfaces TypeScript de domínio (`Job`, `MatchStatus`, `UserJobMatch`).<br>• Camada de repositório e persistência com `localStorage` (`jobStorage.ts`).<br>• Feed de vagas (`JobCard.tsx`) e modal detalhado de requisitos (`JobModal.tsx`).<br>• Filtros dinâmicos por pontuação de compatibilidade e favoritos em `Home.tsx`.<br>• Estilização modular com CSS Modules. |

---

## 📁 Estrutura do Repositório

O projeto é estruturado em monorepo modular:

```plaintext
job_search/
├── job_searcher/       # 🚀 Front-End Principal (Escopo da Entrega AV1)
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis (Navbar, JobCard, JobModal, ResumeUpload, etc.)
│   │   ├── context/    # Autenticação global (AuthContext, AuthProvider, useAuth)
│   │   ├── data/       # Semente inicial de vagas (vagas.json)
│   │   ├── pages/      # Telas (Init, Home, Candidaturas, Login, Register)
│   │   ├── services/   # Camada de persistência (jobStorage.ts)
│   │   ├── styles/     # CSS Modules escopados por componente
│   │   └── types/      # Tipagens TypeScript (job.ts, match.ts)
│   ├── package.json
│   └── vite.config.ts
├── backend/            # ☕ Back-End RESTful em Java 21 LTS + Spring Boot 3
└── python-service/     # 🐍 Microserviço Python (Scraping, IA/NLP Matcher e Telegram Bot)
```

---

## 🚀 Como Executar o Front-End (AV1)

### Pré-requisitos
- **Node.js** (versão 18+ recomendada)
- **npm**

### Passo a Passo

1. Acesse o diretório da aplicação front-end:
   ```bash
   cd job_searcher
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no seu navegador:
   ```text
   http://localhost:5173
   ```

5. Para validar a compilação TypeScript e linter:
   ```bash
   npm run lint
   npm run build
   ```

---

## 📋 Critérios da AV1 Atendidos

- [x] **Comunicação e Proposta de Valor:** Landing page completa (`/`) com dados dinâmicos, métricas do mercado e FAQ.
- [x] **Formulários Controlados & Validação:** Validação reativa de campos obrigatórios, senhas e e-mails (`Register.tsx`, `Login.tsx`).
- [x] **Gestão de Estado Global:** Autenticação centralizada com `AuthContext` e custom hook `useAuth()`.
- [x] **Feed de Vagas & Compatibilidade:** Listagem com cálculo de afinidade IA, modais informativos e filtragem com `useMemo`.
- [x] **Painel de Candidaturas & KPIs:** Gestão de status do processo seletivo em tempo real com métricas agregadas (`/candidaturas`).
- [x] **Persistência de Dados:** Camada Repository com fallback para `vagas.json` e persistência via `localStorage`.
- [x] **Qualidade de Código:** 100% tipado com TypeScript, linter estrito sem erros e separação de responsabilidades.

---

## 🔮 Continuidade (Planejamento para AV2)

Para a entrega da AV2, o front-end passará a consumir a API RESTful implementada no diretório `backend/` (Spring Boot com Spring Security e JWT) integrada ao serviço de inteligência artificial em `python-service/`.
