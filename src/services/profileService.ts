import type { SearchProfile, SearchProfileRequest } from "../types/profile";
import { apiRequest } from "./api";

const PROFILE_STORAGE_KEY = "job_search_user_profile";

const DEFAULT_PROFILE: SearchProfile = {
  id: 1,
  name: "Desenvolvedor Full Stack / Front-End",
  keywords: "React, TypeScript, Java, Spring Boot, CSS Modules, Git, REST",
  min_score: 70,
};

export const profileService = {
  /**
   * Obtém o perfil ativo de busca e skills do usuário.
   */
  async getActiveProfile(): Promise<SearchProfile> {
    try {
      const response = await apiRequest<SearchProfile>("/api/profiles/active");
      if (response && response.id) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(response));
        return response;
      }
    } catch (err: unknown) {
      console.warn("Falha ao buscar perfil na API. Usando cache local:", (err as Error).message);
    }

    const cached = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // falha ao parsear
      }
    }

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  },

  /**
   * Atualiza as habilidades e o perfil de busca do usuário na API Spring Boot.
   * A API recalcula na hora o score das vagas compatíveis.
   */
  async updateActiveProfile(data: SearchProfileRequest): Promise<SearchProfile> {
    try {
      const response = await apiRequest<SearchProfile>("/api/profiles/active", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (response && response.id) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(response));
        this.recalculateLocalJobScores(data.keywords);
        return response;
      }
    } catch (err: unknown) {
      console.warn("Falha ao salvar perfil na API. Atualizando localmente:", (err as Error).message);
    }

    const updated: SearchProfile = {
      id: 1,
      name: data.name,
      keywords: data.keywords,
      min_score: data.minScore,
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    this.recalculateLocalJobScores(data.keywords);
    return updated;
  },

  /**
   * Recalcula a nota de compatibilidade das vagas em cache local
   * com base nas palavras-chave salvas pelo usuário.
   */
  recalculateLocalJobScores(keywords: string): void {
    const stored = localStorage.getItem("job_search_matches");
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

      localStorage.setItem("job_search_matches", JSON.stringify(updated));
    } catch (e) {
      console.warn("Aviso ao recalcular scores em cache local:", e);
    }
  },
};
