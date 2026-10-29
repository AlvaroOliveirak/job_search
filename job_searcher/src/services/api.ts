/**
 * Cliente HTTP centralizado para comunicação com a API RESTful do Spring Boot.
 * Injeta automaticamente o token JWT Bearer e centraliza o tratamento de erros HTTP.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

export const getAuthToken = (): string | null => {
  return localStorage.getItem("job_search_token");
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("job_search_token", token);
  } else {
    localStorage.removeItem("job_search_token");
  }
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.detail) {
        errorMessage = errorJson.detail;
      } else if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // payload não é JSON
    }

    const error = new Error(errorMessage);
    (error as { status?: number }).status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

