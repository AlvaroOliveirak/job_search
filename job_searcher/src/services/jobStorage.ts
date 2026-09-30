import type { UserJobMatch, MatchStatus } from "../types/job";
import vagasSeed from "../data/vagas.json";

const STORAGE_KEY = "job_search_matches";

// Dados locais iniciais carregados a partir de src/data/vagas.json (Requisito AV1)
const INITIAL_MOCK_JOBS: UserJobMatch[] = vagasSeed as unknown as UserJobMatch[];

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
            const parsed = JSON.parse(stored);
            const hasApplied = parsed.some((j: UserJobMatch) => j.status === "applied" || j.status === "interview");
            if (!hasApplied && parsed.length > 0) {
              parsed[0].status = "applied";
              if (parsed[2]) parsed[2].status = "interview";
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }
            resolve(parsed);
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

