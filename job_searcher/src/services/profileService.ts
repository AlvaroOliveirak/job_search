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
    return updated;
  },
};

