# ⚡ Job Search — Plataforma Inteligente de Carreiras & Match IA

> **Projeto Evolutivo — Disciplina de Desenvolvimento Front-End Frameworks (AV1 & AV2)**  
> Protótipo Front-End funcional e moderno desenvolvido com **React 19**, **TypeScript** e **Vite**, com gerenciamento de estado global, navegação SPA via React Router v7, persistência local e interface responsiva com design Dark/Neon em CSS Modules.

---

## 1. Problema e Público

### 1.1 O Problema
No cenário atual do mercado de tecnologia, profissionais perdem horas preenchendo formulários repetitivos em dezenas de plataformas de emprego diferentes (Gupy, LinkedIn, Glassdoor, etc.). Por outro lado, a falta de transparência sobre faixas salariais, requisitos reais e a ausência de retorno dos processos seletivos geram frustração e desmotivação nos candidatos.

### 1.2 O Público-Alvo
- **Desenvolvedores e Profissionais de Tecnologia** (níveis Estágio, Júnior, Pleno e Sênior) que buscam oportunidades alinhadas com suas stacks tecnológicas (React, Python, Java, Node.js, etc.).
- **Candidatos em Transição de Carreira** que necessitam de direcionamento rápido sobre a compatibilidade (Match Score) entre suas qualificações atuais e as exigências do mercado.

---

## 2. Integrantes e Contribuição

| Integrante | Contato / GitHub | Principais Contribuições no Projeto |
| :--- | :--- | :--- |
| **Álvaro Oliveira** | `alvarooliver1802@gmail.com` | • Estruturação e arquitetura Front-End (React 19 + TypeScript + Vite).<br>• Landing Page Institucional (`Init.tsx`) com renderização condicional de autenticação.<br>• Criação e controle de formulários com validação estrita de campos obrigatórios (`Register.tsx` e `Login.tsx`).<br>• Desenvolvimento do painel de gestão de candidaturas (`Candidaturas.tsx`) com cálculo de KPIs em tempo real.<br>• Arquitetura global de autenticação com Context API (`AuthContext.ts`, `AuthProvider.tsx`, `useAuth.ts`), persistência e sistema de Logout com feedback visual.<br>• Criação da base de sementes (`src/data/vagas.json`), revisão de conformidade com os critérios acadêmicos e unificação da estrutura de execução na raiz. |
| **Juan Pablo** | `juandeooliveira@gmail.com` | • Modelagem das interfaces TypeScript de domínio (`src/types/job.ts`: `Job`, `MatchStatus`, `UserJobMatch`).<br>• Implementação inicial da camada de repositório e persistência com `localStorage` (`src/services/jobStorage.ts`).<br>• Desenvolvimento dos componentes do feed de vagas (`JobCard.tsx` e modal de detalhes `JobModal.tsx`).<br>• Implementação da página principal de vagas (`Home.tsx`) com suporte a busca e filtros por nota de afinidade e favoritos.<br>• Estilização modular em CSS Modules (`home.module.css`, `jobCard.module.css`, `jobModal.module.css`).<br>• Setup inicial da arquitetura de backend em Spring Boot / FastAPI para a evolução na AV2. |

---

## 3. Estrutura do Repositório (Monorepo)

O projeto é estruturado de forma modular, com a aplicação Front-End rodando diretamente na raiz do repositório:

```plaintext
job_search/
├── src/                # 🚀 Front-End Principal (React 19 + TypeScript + Vite)
│   ├── components/     # Componentes reutilizáveis (Navbar, JobCard, JobModal, ResumeUpload, etc.)
│   ├── context/        # Autenticação global (AuthContext, AuthProvider)
│   ├── data/           # Semente inicial de vagas do domínio (vagas.json)
│   ├── hooks/          # Hooks customizados (useAuth.ts)
│   ├── pages/          # Telas (Init, Home, Candidaturas, Login, Register)
│   ├── services/       # Camada de persistência desacoplada (jobStorage.ts)
│   ├── styles/         # CSS Modules escopados por componente
│   ├── types/          # Tipagens e interfaces TypeScript (job.ts)
│   ├── App.tsx         # Roteamento central com React Router v7
│   ├── main.tsx        # Ponto de entrada da aplicação React
│   └── index.css       # Estilos globais e variáveis de tema
├── public/             # Arquivos estáticos e favicon
├── backend/            # ☕ Back-End RESTful em Java 21 LTS + Spring Boot 3/4
├── python-service/     # 🐍 Microserviço Python (Scraping, IA/NLP Matcher e Telegram Bot)
├── index.html          # HTML5 de entrada do Vite
├── vite.config.ts      # Configuração de build e plugins do Vite
├── tsconfig.json       # Configurações do compilador TypeScript
├── eslint.config.js    # Linter estrito com regras do React Hooks
└── package.json        # Dependências e scripts de execução do Front-End
```

---

## 4. Funcionalidades da Aplicação

- [x] **Página Inicial Institucional (`/`):** Apresentação clara do produto, métricas de mercado em tempo real, fluxo de funcionamento em 3 etapas, categorias em alta, FAQ interativo e chamada para ação (CTA).
- [x] **Renderização Condicional de Autenticação:** A página inicial e o cabeçalho adaptam seus botões e banners dependendo se o usuário está logado ou deslogado.
- [x] **Exploração & Feed de Vagas (`/home`):** Listagem de oportunidades com cards ricos contendo nota de afinidade IA (Match Score), empresa, localização e modal de requisitos completos.
- [x] **Filtros e Busca Controlados por Estado:**
  - Busca textual em tempo real por cargo, tecnologia ou empresa.
  - Filtro seletor por nota mínima de compatibilidade (+70%, +85%, +90%).
  - Filtro booleano exclusivo para vagas marcadas como "Favoritas".
- [x] **Acompanhamento de Candidaturas (`/candidaturas`):**
  - Painel de KPIs (Total de Candidaturas, Em Análise, Entrevistas Agendadas, Média de Match).
  - Abas de filtragem por status do processo seletivo.
  - Dropdown interativo para o candidato atualizar a etapa do processo seletivo em tempo real diretamente pelo card.
- [x] **Formulário de Cadastro Controlado (`/Register`):** Validação de campos obrigatórios (nome, e-mail válido, tamanho mínimo de senha e confirmação de senha) com exibição condicional de erros e feedback de sucesso.
- [x] **Autenticação Simulada & Sessão (`/login`):** Login com persistência de sessão em `localStorage`, cards de sessão ativa e suporte a logout com redirecionamento automático.
- [x] **Feedback Visual de Ações (Toasts):** Mensagens flutuantes temporárias ao favoritar/desfavoritar vagas, ao atualizar o status de candidaturas e ao encerrar sessão.

---

## 5. Rotas da Aplicação

A navegação é implementada com **React Router v7** em modo SPA (Single Page Application):

| Rota | Componente | Finalidade |
| :--- | :--- | :--- |
| `/` | `<Init />` | Landing page institucional com comunicação da proposta de valor. |
| `/home` | `<Home />` | Painel principal de busca e recomendação de vagas com filtros dinâmicos. |
| `/candidaturas` | `<Candidaturas />` | Painel de gestão e acompanhamento das etapas de processos seletivos. |
| `/applications` | `<Candidaturas />` | Alias/redirecionamento da rota de candidaturas. |
| `/Register` | `<Register />` | Formulário de cadastro de usuário com upload de currículo. |
| `/login` | `<Login />` | Formulário de login e controle de sessão do usuário. |

---

## 6. Tecnologias Utilizadas

- **React 19 & TypeScript:** Construção de componentes funcionais fortemente tipados com hooks nativos (`useState`, `useEffect`, `useMemo`, `useContext`, `useCallback`).
- **Vite:** Ferramenta de build de última geração com inicialização instantânea e Hot Module Replacement (HMR).
- **React Router DOM 7:** Roteamento declarativo no lado do cliente via HTML5 History API.
- **CSS Modules:** Estilização modular com escopo local, evitando colisões de classes globais.
- **Web Storage API (`localStorage`):** Persistência de dados do domínio e controle de sessão do usuário no navegador.

---

## 7. Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada).
- Gerenciador de pacotes **npm**.

### Passo a Passo

1. Na raiz do repositório (`job_search`), instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação no navegador:
   ```text
   http://localhost:5173
   ```

4. Para gerar o build de produção e verificar a tipagem TypeScript:
   ```bash
   npm run build
   ```

5. Para rodar o linter de código:
   ```bash
   npm run lint
   ```

---

## 8. Dados e Persistência

Os dados da aplicação são organizados conforme os critérios estabelecidos para o projeto:

### 8.1 Dados Iniciais (Seed Local)
- **Localização:** `src/data/vagas.json`.
- **Descrição:** Arquivo JSON com a estrutura formal de dados do domínio (`UserJobMatch` contendo `id`, `title`, `company`, `location`, `match_score`, `status`, `technologies`, etc.).
- **Carga:** O serviço `src/services/jobStorage.ts` importa esse arquivo na inicialização caso o navegador ainda não possua dados gravados.

### 8.2 Dados Persistidos (`localStorage`)
- **Chave `job_search_matches`:** Armazena a lista dinâmica de vagas, registrando permanentemente:
  - Marcação de vagas favoritas (`is_favorite: true/false`).
  - Atualização do status da candidatura (`status: "new" | "applied" | "interview" | "discarded"`).
- **Chave `job_search_auth`:** Armazena o estado da sessão do usuário autenticado (`isLoggedIn: true/false` e dados de perfil).

---

## 9. Contrato da API (Planejamento para AV2)

Na AV2, a camada de persistência local (`localStorage`) será substituída pela integração com o back-end RESTful desenvolvido em **Java Spring Boot / FastAPI** e banco de dados relacional:

| Método | Endpoint | Descrição | Autenticação |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Autentica usuário e retorna JWT Bearer Token | Pública |
| `POST` | `/api/auth/register` | Cria uma nova conta de candidato | Pública |
| `GET` | `/api/auth/me` | Retorna o perfil do usuário autenticado | Bearer Token |
| `GET` | `/api/jobs` | Retorna lista de vagas disponíveis com filtros | Bearer Token |
| `GET` | `/api/jobs/{id}` | Detalhes de uma vaga e da relação de match | Bearer Token |
| `PATCH` | `/api/jobs/{id}` | Atualiza etapa da candidatura ou status de favorito | Bearer Token |

---

## 10. Evolução da AV1 para a AV2

1. **Substituição do Repositório Local por Client HTTP:** O arquivo `src/services/jobStorage.ts` continuará sendo a única camada consumida pelos componentes visuais (Repository Pattern), bastando alterar sua implementação interna de `localStorage` para requisições assíncronas reais (`fetch` / `axios`) consumindo a API.
2. **Autenticação Real com JWT:** Implementação de interceptores HTTP para anexar o token JWT no cabeçalho `Authorization: Bearer <token>` em todas as chamadas privadas.
3. **Rotas Protegidas:** Implementação de guardas de rota no React Router com componente `<ProtectedRoute>` para redirecionar usuários não autenticados que tentarem acessar rotas restritas.
4. **Dupla Validação:** Validação reativa client-side no React combinada à validação server-side com persistência em banco relacional.

---

## 11. Limitações e Contingência

- **Ambiente sem Back-End na AV1:** Como o foco da primeira entrega foi a experiência do front-end, utiliza-se uma simulação com delay proposital de 350ms em `src/services/jobStorage.ts` para testar os estados de loading (`spinner`) do React.
- **Restauração de Fábrica:** Caso seja necessário restaurar as vagas e candidaturas para o estado padrão original, o serviço disponibiliza o método `resetMockData()`.

---

## 12. Uso de Inteligência Artificial

Durante o desenvolvimento do projeto, ferramentas de IA Generativa foram utilizadas como assistentes de **pair programming**, com postura crítica da equipe:
- **O que foi aproveitado:**
  - Sugestões para paleta Dark/Neon em CSS Modules com técnicas de Glassmorphism e responsividade.
  - Algoritmos de filtragem reativa em memória com `useMemo`.
  - Estruturação inicial da documentação técnica e critérios acadêmicos.
- **O que foi corrigido criticamente:**
  - A IA inicialmente gerou um componente `<Button>` que continha uma tag `<Link>` interna, o que permitia submeter o formulário de login burlando a validação. O erro foi identificado e corrigido pela equipe, substituindo por um formulário 100% controlado com validação estrita via React State (`validate()` e `errors`).
  - Chamadas diretas ao `localStorage` dentro dos componentes JSX foram refatoradas para a camada desacoplada de serviço `jobStorage.ts` (Repository Pattern).
