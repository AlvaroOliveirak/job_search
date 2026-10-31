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

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    // Erro de rede: backend offline, CORS bloqueado, sem internet, etc.
    const msg = networkErr instanceof Error ? networkErr.message.toLowerCase() : "";
    if (
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("load failed") ||
      msg.includes("fetch")
    ) {
      const err = new Error(
        "Não foi possível conectar ao servidor. Verifique se o backend está em execução ou tente novamente mais tarde."
      );
      (err as { status?: number }).status = 0;
      throw err;
    }
    throw networkErr;
  }

  if (!response.ok) {
    let errorMessage: string;

    switch (response.status) {
      case 400:
        errorMessage = "Dados inválidos. Verifique os campos e tente novamente.";
        break;
      case 401:
        errorMessage = "E-mail ou senha incorretos.";
        break;
      case 403:
        errorMessage = "Acesso negado. Você não tem permissão para esta ação.";
        break;
      case 404:
        errorMessage = "Recurso não encontrado.";
        break;
      case 409:
        errorMessage = "Este e-mail já está cadastrado. Tente fazer login.";
        break;
      case 422:
        errorMessage = "Dados inválidos enviados ao servidor.";
        break;
      case 500:
      case 502:
      case 503:
        errorMessage = "Erro interno no servidor. Tente novamente em alguns instantes.";
        break;
      default:
        errorMessage = `Erro inesperado (código ${response.status}). Tente novamente.`;
    }

    // Tenta sobrescrever com a mensagem específica que o backend enviou
    try {
      const errorJson = await response.json();
      const backendMsg = errorJson.message || errorJson.detail || errorJson.error;
      if (backendMsg && typeof backendMsg === "string") {
        errorMessage = backendMsg;
      }
    } catch {
      // payload não é JSON — mantém a mensagem amigável acima
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
