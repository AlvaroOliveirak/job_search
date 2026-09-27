import type { UserJobMatch, MatchStatus } from "../types/job";

const STORAGE_KEY = "job_search_matches";

// Dados iniciais para simular o banco de dados e os scrapers
const INITIAL_MOCK_JOBS: UserJobMatch[] = [
  {
    id: 1,
    user_id: 1,
    job_id: 101,
    score: 95,
    is_notified_telegram: true,
    is_favorite: true,
    status: "new",
    matched_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    job: {
      id: 101,
      job_hash: "hash_gupy_001",
      title: "Desenvolvedor Front-end Júnior (React / TypeScript)",
      company: "Nubank",
      location: "Remoto - Brasil",
      url: "https://nubank.gupy.io",
      source: "Gupy",
      description: `Buscamos uma pessoa desenvolvedora Front-end Júnior com paixão por criar interfaces intuitivas, acessíveis e de alta performance.
      
Principais Responsabilidades:
- Construção e manutenção de componentes utilizando React, TypeScript e styled-components / CSS Modules.
- Consumo de APIs RESTful e integração com microserviços.
- Participação ativa em cerimônias ágeis (Scrum/Kanban) e code reviews.

Requisitos:
- Conhecimento sólido em HTML5, CSS3 e JavaScript Moderno (ES6+).
- Experiência prática com React e TypeScript.
- Familiaridade com Git e controle de versão.
- Desejável: Conhecimentos em testes automatizados (Jest, React Testing Library).`,
      posted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 2,
    user_id: 1,
    job_id: 102,
    score: 88,
    is_notified_telegram: true,
    is_favorite: false,
    status: "new",
    matched_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    job: {
      id: 102,
      job_hash: "hash_gupy_002",
      title: "Desenvolvedor Python / FastAPI Júnior",
      company: "Mercado Livre",
      location: "São Paulo, SP (Híbrido)",
      url: "https://mercadolivre.gupy.io",
      source: "Gupy",
      description: `Venha fazer parte do nosso time de tecnologia desenvolvendo APIs escaláveis e seguras para milhões de usuários diários.

Requisitos:
- Vivência com Python 3 e frameworks modernos (FastAPI ou Flask).
- Conceitos sólidos de APIs RESTful, HTTP status codes e autenticação JWT.
- Conhecimento em bancos relacionais (PostgreSQL, SQLite ou MySQL) com SQLAlchemy.
- Vontade de aprender e trabalhar em equipe multidisciplinar.`,
      posted_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 3,
    user_id: 1,
    job_id: 103,
    score: 82,
    is_notified_telegram: false,
    is_favorite: false,
    status: "new",
    matched_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    job: {
      id: 103,
      job_hash: "hash_gupy_003",
      title: "Desenvolvedor Full Stack Júnior (Node.js & React)",
      company: "Stone",
      location: "Rio de Janeiro, RJ (Remoto)",
      url: "https://stone.gupy.io",
      source: "Gupy",
      description: `Oportunidade para atuar ponta a ponta no ecossistema financeiro da Stone.

O que esperamos de você:
- Experiência com JavaScript/TypeScript tanto no client quanto no server.
- Conhecimento em React, consumo de APIs e gerenciamento de estado.
- Prática com Node.js (Express ou Fastify).
- Boas noções de Clean Code e documentação de software.`,
      posted_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 4,
    user_id: 1,
    job_id: 104,
    score: 65,
    is_notified_telegram: false,
    is_favorite: false,
    status: "new",
    matched_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    job: {
      id: 104,
      job_hash: "hash_gupy_004",
      title: "Estagiário em Engenharia de Software",
      company: "Embraer",
      location: "São José dos Campos, SP",
      url: "https://embraer.gupy.io",
      source: "Gupy",
      description: `Programa de estágio focado em formação técnica acelerada para estudantes de Ciência da Computação, Engenharia de Software ou correlatas.
      
Atividades:
- Apoiar equipes de produto no desenvolvimento de dashboards e automações.
- Aprender práticas de CI/CD, testes e versionamento.`,
      posted_at: new Date(Date.now() - 3600000 * 50).toISOString(),
      created_at: new Date().toISOString(),
    },
  },
];

/**
 * Camada de abstração de dados (Repository Pattern).
 * Utiliza LocalStorage agora e simula chamadas assíncronas
 * para preparar o Front-end para a integração transparente com a API FastAPI.
 */
export const jobStorageService = {
  // Simula busca assíncrona (com delay artificial de 350ms para testar o loading do React)
  async fetchJobs(): Promise<UserJobMatch[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_JOBS));
          resolve(INITIAL_MOCK_JOBS);
        } else {
          try {
            resolve(JSON.parse(stored));
          } catch {
            resolve(INITIAL_MOCK_JOBS);
          }
        }
      }, 350);
    });
  },

  async toggleFavorite(matchId: number): Promise<UserJobMatch[]> {
    const jobs = await this.fetchJobs();
    const updated = jobs.map((item) =>
      item.id === matchId ? { ...item, is_favorite: !item.is_favorite } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateStatus(matchId: number, status: MatchStatus): Promise<UserJobMatch[]> {
    const jobs = await this.fetchJobs();
    const updated = jobs.map((item) =>
      item.id === matchId ? { ...item, status } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  resetMockData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_JOBS));
  },
};

