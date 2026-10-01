# ⚡ Job Search — Plataforma Inteligente de Carreiras & Match IA

> **Projeto Evolutivo — Disciplina de Desenvolvimento Front-End (AV1 & AV2)**  
> Protótipo Front-End funcional desenvolvido em React, TypeScript e Vite, com gerenciamento de estado, navegação via React Router, persistência local e interface responsiva com design Dark/Neon.

---

## 1. Problema e Público

### 1.1 O Problema

No cenário atual do mercado de tecnologia, profissionais perdem horas preenchendo formulários repetitivos em dezenas de plataformas de emprego diferentes (Gupy, LinkedIn, Glassdoor, etc.). Por outro lado, a falta de transparência sobre faixas salariais, requisitos reais e a ausência de retorno dos processos seletivos geram frustração e desmotivação nos candidatos.

### 1.2 O Público-Alvo

- **Desenvolvedores e Profissionais de Tecnologia** (níveis Estágio, Júnior, Pleno e Sênior) que buscam oportunidades alinhadas com suas stacks tecnológicas (React, Python, Node.js, etc.).
- **Candidatos em Transição de Carreira** que necessitam de direcionamento rápido sobre a compatibilidade (Match) entre suas qualificações atuais e as exigências do mercado.

---

## 2. Integrantes e Contribuição

| Integrante          | Contato / GitHub             | Principais Contribuições no Projeto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :------------------ | :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Álvaro Oliveira** | `alvarooliver1802@gmail.com` | • Estruturação inicial do projeto em React + TypeScript + Vite.<br>• Implementação da Landing Page Institucional (`Init.tsx`) com renderização condicional de autenticação.<br>• Criação e controle de formulários com validação estrita de campos obrigatórios (`Register.tsx` e `Login.tsx`).<br>• Desenvolvimento do painel de gestão de candidaturas (`Candidaturas.tsx`) com cálculo de KPIs em tempo real.<br>• Arquitetura global de autenticação com Context API (`AuthContext.tsx` e `useAuth.ts`), persistência e sistema de Logout com feedback visual.<br>• Criação da base de sementes (`src/data/vagas.json`), revisão de conformidade com os 9 critérios da AV1 e resolução de merges das branches. |

| **Juan Pablo** | `juandeooliveira@gmail.com` | • Modelagem das interfaces TypeScript de domínio (`src/types/job.ts`: `Job`, `MatchStatus`, `UserJobMatch`).<br>• Implementação inicial da camada de repositório e persistência com `localStorage` (`src/services/jobStorage.ts`).<br>• Desenvolvimento dos componentes do feed de vagas (`JobCard.tsx` e modal de detalhes `JobModal.tsx`).<br>• Implementação da página principal de vagas (`Home.tsx`) com suporte a busca e filtros por nota e favoritos.<br>• Estilização modular em CSS Modules (`home.module.css`, `jobCard.module.css`, `jobModal.module.css`).<br>• Setup inicial da arquitetura de backend em FastAPI + SQLAlchemy + JWT (`backend/`) para a evolução na AV2. |

---

## 3. Funcionalidades da Aplicação

- [x] **Página Inicial Institucional (`/`):** Apresentação clara do produto, métricas de mercado em tempo real, fluxo de funcionamento em 3 etapas, categorias em alta, FAQ interativo e chamada para ação (CTA).
- [x] **Renderização Condicional de Autenticação:** A página inicial e o cabeçalho adaptam seus botões e banners dependendo se o usuário está logado ou deslogado.
- [x] **Exploração & Feed de Vagas (`/home`):** Listagem de oportunidades com cards ricos contendo nota de afinidade IA (Match Score), empresa, localização e modal de requisitos completos.
- [x] **Filtros e Busca Controlados por Estado:**
  - Busca textual em tempo real por cargo, tecnologia ou empresa.
  - Filtro seletor por nota mínima de compatibilidade (+70%, +85%, +90%).
  - Filtro booleano exclusivo para vagas marcadas como "Favoritas".
- [x] **Acompanhamento de Candidaturas (`/candidaturas`):**
  - Painel de KPIs (Total de Candidaturas, Em Análise, Entrevistas Agendadas, Média de Match).
  - Abas de filtragem por status do processo.
  - Dropdown interativo para o candidato atualizar a etapa do processo seletivo em tempo real diretamente pelo card.
- [x] **Formulário de Cadastro Controlado (`/Register`):** Validação de campos obrigatórios (nome, e-mail válido, tamanho mínimo de senha e confirmação de senha) com exibição condicional de erros e feedback de sucesso.
- [x] **Autenticação Simulada (`/login`):** Login com persistência de sessão e suporte a login social (Google e LinkedIn).
- [x] **Feedback Visual de Ações (Toasts):** Mensagens flutuantes temporárias ao favoritar/desfavoritar vagas e ao atualizar o status de candidaturas.

---

## 4. Rotas da Aplicação

A navegação é implementada com **React Router v7** em modo SPA (Single Page Application):

| Rota            | Componente         | Finalidade                                                               |
| :-------------- | :----------------- | :----------------------------------------------------------------------- |
| `/`             | `<Init />`         | Landing page institucional com comunicação da proposta de valor.         |
| `/home`         | `<Home />`         | Painel principal de busca e recomendação de vagas com filtros dinâmicos. |
| `/candidaturas` | `<Candidaturas />` | Painel de gestão e acompanhamento das etapas de processos seletivos.     |
| `/applications` | `<Candidaturas />` | Alias/redirecionamento da rota de candidaturas.                          |
| `/Register`     | `<Register />`     | Formulário de cadastro de usuário com upload de currículo.               |
| `/login`        | `<Login />`        | Formulário de login e autenticação com alternativas sociais.             |

---

## 5. Tecnologias Utilizadas

- **React 19 & TypeScript:** Construção de componentes funcionais fortemente tipados com hooks nativos (`useState`, `useEffect`, `useMemo`, `useContext`).
- **Vite:** Ferramenta de build rápida e servidor de desenvolvimento otimizado com Hot Module Replacement (HMR).
- **React Router DOM 7:** Gerenciamento declarativo de rotas no lado do cliente.
- **CSS Modules:** Estilização modular com escopo local, evitando conflitos globais de nomenclatura.
- **Web Storage API (`localStorage`):** Persistência de dados do domínio e controle de sessão do usuário no navegador.

---

## 6. Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior instalada).
- Gerenciador de pacotes npm.

### Passo a passo

1. Clone o repositório ou acesse a pasta raiz do projeto:
   ```bash
   cd job_searcher
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador:
   ```
   http://localhost:5173
   ```
5. Para gerar o build de produção e validar a tipagem:
   ```bash
   npm run build
   ```

---

## 7. Dados e Persistência

Conforme exigido pelos critérios da AV1, os dados da aplicação são organizados da seguinte forma:

### 7.1 Dados Iniciais (Seed Local)

- **Localização:** `src/data/vagas.json`.
- **Descrição:** Arquivo JSON com a estrutura formal de dados do domínio (`UserJobMatch` contendo id, título, empresa, localização, pontuação IA, status e tags de tecnologias).
- **Carga:** O serviço `src/services/jobStorage.ts` importa esse arquivo na inicialização caso o navegador ainda não possua dados gravados.

### 7.2 Dados Persistidos (`localStorage`)

- **Chave `job_search_matches`:** Armazena a lista dinâmica de vagas, registrando permanentemente:
  - Marcação de vagas favoritas (`is_favorite: true/false`).
  - Atualização do status da candidatura (`status: "new" | "applied" | "interview" | "discarded"`).
- **Chave `job_search_auth`:** Armazena o estado da sessão do usuário autenticado (`isLoggedIn: true/false` e dados básicos de perfil).

---

## 8. Contrato da API (Planejamento para AV2)

Na AV2, a camada de persistência local (`localStorage`) será substituída pela integração com o back-end desenvolvido em **FastAPI** e banco de dados relacional. Abaixo está o contrato RESTful planejado:

| Método  | Endpoint                        | Descrição                                                 | Autenticação |
| :-----: | :------------------------------ | :-------------------------------------------------------- | :----------: |
| `POST`  | `/api/v1/auth/login`            | Autentica usuário e retorna JWT Bearer Token              |   Pública    |
| `POST`  | `/api/v1/auth/register`         | Cria uma nova conta de candidato                          |   Pública    |
|  `GET`  | `/api/v1/jobs`                  | Retorna lista de vagas disponíveis com filtros            | Bearer Token |
|  `GET`  | `/api/v1/matches`               | Retorna vagas recomendadas com pontuação de afinidade     | Bearer Token |
| `PATCH` | `/api/v1/matches/{id}/favorite` | Alterna status de favorito da vaga                        | Bearer Token |
| `PATCH` | `/api/v1/matches/{id}/status`   | Atualiza a etapa do processo (ex: `applied`, `interview`) | Bearer Token |

---

## 9. Evolução da AV1 para a AV2

1. **Substituição do Repositório Local por Client HTTP:** O atual `jobStorage.ts` continuará sendo a única camada consumida pelos componentes (Repository Pattern), bastando alterar sua implementação interna de `localStorage` para chamadas `fetch` / `axios` apontando para a API FastAPI.
2. **Autenticação Real:** Implementação de interceptores HTTP para anexar o token JWT no cabeçalho `Authorization: Bearer <token>`.
3. **Rotas Protegidas:** Implementação de guardas de rota no React Router para redirecionar usuários não autenticados que tentarem acessar `/home` ou `/candidaturas`.

---

## 10. Limitações e Contingência

- **Ambiente sem Back-End na AV1:** Como a entrega da AV1 é focada no front-end, simula-se um atraso artificial de 350ms em `jobStorage.ts` para testar os estados de loading (`spinner`) do React.
- **Limpeza do LocalStorage:** Caso o usuário queira restaurar as vagas e candidaturas para o estado padrão de fábrica, o serviço disponibiliza o método `resetMockData()`.

---

## 11. Uso de Inteligência Artificial

- Durante o desenvolvimento, ferramentas de inteligência artificial foram utilizadas como assistentes de programação em pair programming para:
  - Sugestão e refatoração de regras de CSS Modules (paleta dark/neon, glassmorphism e responsividade).
  - Criação de algoritmos de filtragem reativa em memória com `useMemo`.
  - Elaboração da documentação técnica e estruturação dos critérios da avaliação acadêmica.
  - A lógica de negócios e arquitetura de componentes foram revisadas e validadas pela equipe.
