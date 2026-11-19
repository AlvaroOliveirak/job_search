import type { SearchProfile, SearchProfileRequest } from "../types/profile";
import { apiRequest } from "./api";

const PROFILE_STORAGE_KEY = "job_search_user_profile";
const MATCHES_STORAGE_KEY = "job_search_matches";

export const profileService = {
  /**
   * GET /api/profiles/active — perfil de busca e skills do usuário logado.
   * Lança ApiError em caso de falha (a página exibe o estado de erro).
   */
  async getActiveProfile(): Promise<SearchProfile> {
    const response = await apiRequest<SearchProfile>("/api/profiles/active");
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(response));
    return response;
  },

  /**
   * PUT /api/profiles/active — salva as skills; o Spring Boot recalcula na hora o score das vagas.
   * Só é considerado salvo se o servidor confirmar (lança ApiError caso contrário).
   */
  async updateActiveProfile(data: SearchProfileRequest): Promise<SearchProfile> {
    const response = await apiRequest<SearchProfile>("/api/profiles/active", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(response));
    this.recalculateLocalJobScores(data.keywords);
    return response;
  },

  /**
   * Mantém o cache local de vagas coerente com o recálculo feito no servidor
   * (mesma fórmula do JobService.recalculateMatchesForUser), para o modo offline.
   */
  recalculateLocalJobScores(keywords: string): void {
    const stored = localStorage.getItem(MATCHES_STORAGE_KEY);
    if (!stored) return;
    try {
      const matches = JSON.parse(stored);
      if (!Array.isArray(matches) || matches.length === 0) return;

      const terms = keywords
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (terms.length === 0) return;

      const updated = matches.map((item) => {
        const title = (item.job?.title || "").toLowerCase();
        const desc = (item.job?.description || "").toLowerCase();
        const text = `${title} ${desc}`;

        let matchedCount = 0;
        for (const term of terms) {
          if (text.includes(term)) {
            matchedCount++;
          }
        }

        const ratio = matchedCount / terms.length;
        const calculatedScore = Math.min(98.0, Math.round((40.0 + ratio * 58.0) * 10.0) / 10.0);

        return {
          ...item,
          score: calculatedScore,
        };
      });

      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Aviso ao recalcular scores em cache local:", e);
    }
  },
};
