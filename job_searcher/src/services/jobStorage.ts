import type { UserJobMatch, MatchStatus } from "../types/job";
import vagasSeed from "../data/vagas.json";
import { apiRequest, getAuthToken } from "./api";

const STORAGE_KEY = "job_search_matches";
const LAST_UPDATED_KEY = "job_search_last_updated";

// Dados locais iniciais carregados a partir de src/data/vagas.json (Fallback / Offline)
const INITIAL_MOCK_JOBS: UserJobMatch[] = vagasSeed as unknown as UserJobMatch[];

/**
 * Camada de repositório de vagas (Repository Pattern).
 * Conecta-se à API Spring Boot (/api/jobs) e mantém fallback transparente
 * para o LocalStorage caso o back-end esteja temporariamente indisponível.
 */
export const jobStorageService = {
  /**
   * Busca as vagas na API do Spring Boot.
   * Se o usuário estiver autenticado e o back-end estiver online, obtém dados reais.
   * Caso contrário, recorre ao cache local.
   */
  async fetchJobs(): Promise<UserJobMatch[]> {
    try {
      const remoteJobs = await apiRequest<UserJobMatch[]>("/api/jobs");
      if (remoteJobs && Array.isArray(remoteJobs) && remoteJobs.length > 0) {
        // Atualiza o cache local para resiliência offline
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteJobs));
        if (!localStorage.getItem(LAST_UPDATED_KEY)) {
          localStorage.setItem(
            LAST_UPDATED_KEY,
            remoteJobs[0]?.matched_at || new Date().toISOString()
          );
        }
        return remoteJobs;
      }
    } catch (err: unknown) {
      console.warn(
        "Não foi possível buscar vagas na API Spring Boot. Usando dados locais como fallback.",
        (err as Error).message
      );
    }

    // Fallback: carrega do LocalStorage ou mock inicial
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_JOBS));
          resolve(INITIAL_MOCK_JOBS);
        } else {
          try {
            const parsed = JSON.parse(stored);
            resolve(parsed);
          } catch {
            resolve(INITIAL_MOCK_JOBS);
          }
        }
      }, 200);
    });
  },

  /**
   * Dispara a busca e atualização manual de vagas diretamente na API do Spring Boot (/api/jobs/refresh).
   * O Spring Boot executa o pipeline Python de scraping na Gupy e IA, retornando as vagas atualizadas.
   */
  async manualRefreshJobs(): Promise<{
    matches: UserJobMatch[];
    updatedAt: string;
    message: string;
    totalJobs: number;
  }> {
    try {
      const response = await apiRequest<{
        status: string;
        message: string;
        total_jobs: number;
        updated_at: string;
        matches: UserJobMatch[];
      }>("/api/jobs/refresh", {
        method: "POST",
      });

      if (response && response.matches) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.matches));
        const updatedTime = response.updated_at || new Date().toISOString();
        localStorage.setItem(LAST_UPDATED_KEY, updatedTime);

        return {
          matches: response.matches,
          updatedAt: updatedTime,
          message: response.message || "Vagas atualizadas com sucesso a partir da API da Gupy.",
          totalJobs: response.total_jobs || response.matches.length,
        };
      }
    } catch (err: unknown) {
      console.warn("Falha ao sincronizar via /api/jobs/refresh. Recorrendo ao cache local:", err);
    }

    // Fallback: busca vagas locais e atualiza o timestamp
    const currentMatches = await this.fetchJobs();
    const fallbackTimestamp = new Date().toISOString();
    localStorage.setItem(LAST_UPDATED_KEY, fallbackTimestamp);

    return {
      matches: currentMatches,
      updatedAt: fallbackTimestamp,
      message: "Vagas carregadas a partir do cache local.",
      totalJobs: currentMatches.length,
    };
  },

  getLastUpdated(): string | null {
    return localStorage.getItem(LAST_UPDATED_KEY);
  },

  setLastUpdated(timestamp: string): void {
    localStorage.setItem(LAST_UPDATED_KEY, timestamp);
  },

  /**
   * Alterna a marcação de favorito via PATCH /api/jobs/{id}.
   */
  async toggleFavorite(matchId: number): Promise<UserJobMatch[]> {
    const jobs = await this.fetchJobs();
    const current = jobs.find((j) => j.id === matchId);
    const newFavoriteState = current ? !current.is_favorite : true;

    // Tenta sincronizar com o Spring Boot se houver token
    if (getAuthToken()) {
      try {
        await apiRequest<UserJobMatch>(`/api/jobs/${matchId}`, {
          method: "PATCH",
          body: JSON.stringify({ is_favorite: newFavoriteState }),
        });
      } catch (err: unknown) {
        console.warn("Falha ao sincronizar favorito com a API:", (err as Error).message);
      }
    }

    const updated = jobs.map((item) =>
      item.id === matchId ? { ...item, is_favorite: newFavoriteState } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Atualiza o status da candidatura (ex: 'applied', 'viewed', 'discarded') via PATCH /api/jobs/{id}.
   */
  async updateStatus(matchId: number, status: MatchStatus): Promise<UserJobMatch[]> {
    const jobs = await this.fetchJobs();

    // Tenta sincronizar com o Spring Boot se houver token
    if (getAuthToken()) {
      try {
        await apiRequest<UserJobMatch>(`/api/jobs/${matchId}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
      } catch (err: unknown) {
        console.warn("Falha ao sincronizar status com a API:", (err as Error).message);
      }
    }

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
