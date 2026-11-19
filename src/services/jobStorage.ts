import type { UserJobMatch, MatchStatus } from "../types/job";
import vagasSeed from "../data/vagas.json";
import { apiRequest } from "./api";

const STORAGE_KEY = "job_search_matches";
const LAST_UPDATED_KEY = "job_search_last_updated";

// Vagas de demonstração (mesmo formato da API) para o modo offline sem cache
const DEMO_JOBS: UserJobMatch[] = vagasSeed as unknown as UserJobMatch[];

/** De onde vieram os dados exibidos no modo offline. */
export type OfflineSource = "cache" | "seed";

export interface MatchPatch {
  is_favorite?: boolean;
  status?: MatchStatus;
}

function readCache(): UserJobMatch[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as UserJobMatch[]) : null;
  } catch {
    return null;
  }
}

function writeCache(matches: UserJobMatch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

/**
 * Camada de repositório de vagas (Repository Pattern).
 * A fonte de verdade é a API Spring Boot (/api/jobs). O localStorage é apenas um cache,
 * usado SOMENTE quando o usuário escolhe explicitamente o modo offline.
 * Todas as falhas são propagadas (ApiError) para a página exibir o estado de erro.
 */
export const jobStorageService = {
  /** GET /api/jobs — vagas compatíveis do usuário logado. Lança ApiError em caso de falha. */
  async fetchJobs(): Promise<UserJobMatch[]> {
    const remoteJobs = await apiRequest<UserJobMatch[]>("/api/jobs");
    const matches = Array.isArray(remoteJobs) ? remoteJobs : [];

    // Atualiza o cache local (inclusive lista vazia) para o modo offline
    writeCache(matches);
    if (!localStorage.getItem(LAST_UPDATED_KEY) && matches.length > 0) {
      localStorage.setItem(LAST_UPDATED_KEY, matches[0]?.matched_at || new Date().toISOString());
    }
    return matches;
  },

  /**
   * Contingência: dados salvos neste navegador (última resposta da API) ou,
   * se não houver nenhum, as vagas de demonstração de src/data/vagas.json.
   */
  loadOfflineJobs(): { matches: UserJobMatch[]; source: OfflineSource } {
    const cached = readCache();
    if (cached && cached.length > 0) {
      return { matches: cached, source: "cache" };
    }
    return { matches: DEMO_JOBS, source: "seed" };
  },

  /**
   * POST /api/jobs/refresh — o Spring Boot executa o pipeline Python (scraping Gupy + IA)
   * e devolve as vagas atualizadas. Lança ApiError em caso de falha.
   */
  async manualRefreshJobs(): Promise<{
    matches: UserJobMatch[];
    updatedAt: string;
    message: string;
    totalJobs: number;
    success: boolean;
  }> {
    const response = await apiRequest<{
      status: string;
      message: string;
      total_jobs: number;
      updated_at: string;
      matches: UserJobMatch[];
    }>("/api/jobs/refresh", {
      method: "POST",
    });

    const matches = Array.isArray(response.matches) ? response.matches : [];
    const updatedTime = response.updated_at || new Date().toISOString();
    writeCache(matches);
    localStorage.setItem(LAST_UPDATED_KEY, updatedTime);

    return {
      matches,
      updatedAt: updatedTime,
      message: response.message || "Vagas atualizadas.",
      totalJobs: response.total_jobs ?? matches.length,
      success: response.status === "success",
    };
  },

  getLastUpdated(): string | null {
    return localStorage.getItem(LAST_UPDATED_KEY);
  },

  /**
   * PATCH /api/jobs/{id} — favorito e/ou status da candidatura.
   * Só altera o cache depois que o servidor confirmar; em caso de falha lança ApiError.
   */
  async updateMatch(matchId: number, patch: MatchPatch): Promise<UserJobMatch> {
    const updated = await apiRequest<UserJobMatch>(`/api/jobs/${matchId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    const cached = readCache();
    if (cached) {
      writeCache(cached.map((item) => (item.id === matchId ? updated : item)));
    }
    return updated;
  },
};
