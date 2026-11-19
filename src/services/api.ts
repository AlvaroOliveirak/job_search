/**
 * Cliente HTTP centralizado para comunicação com a API RESTful do Spring Boot.
 * Injeta automaticamente o token JWT Bearer e centraliza o tratamento de erros HTTP.
 * É o ÚNICO lugar do front-end que chama fetch().
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

const TOKEN_KEY = "job_search_token";

/** Erro de requisição com o status HTTP (0 = falha de rede / back-end offline). */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Mensagem amigável para exibir na interface a partir de qualquer erro capturado. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError && err.message) {
    return err.message;
  }
  return fallback;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Chamado quando uma rota protegida responde 401 (token ausente, inválido ou expirado).
 * O AuthProvider registra aqui o encerramento da sessão + redirecionamento para /login.
 */
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Dados inválidos. Verifique os campos e tente novamente.";
    case 401:
      return "E-mail ou senha incorretos.";
    case 403:
      return "Acesso negado. Você não tem permissão para esta ação.";
    case 404:
      return "Recurso não encontrado.";
    case 409:
      return "Este e-mail já está cadastrado. Tente fazer login.";
    case 422:
      return "Dados inválidos enviados ao servidor.";
    case 500:
    case 502:
    case 503:
      return "Erro interno no servidor. Tente novamente em alguns instantes.";
    default:
      return `Erro inesperado (código ${status}). Tente novamente.`;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const isAuthEndpoint = path.startsWith("/api/auth/");
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    // Erro de rede: backend offline, CORS bloqueado, sem internet, etc.
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique se o backend está em execução ou tente novamente mais tarde.",
      0
    );
  }

  if (!response.ok) {
    // 401 fora do login/cadastro = sessão inválida ou expirada: encerra a sessão local
    if (response.status === 401 && !isAuthEndpoint) {
      setAuthToken(null);
      unauthorizedHandler?.();
      throw new ApiError("Sua sessão expirou. Faça login novamente.", 401);
    }

    let errorMessage = defaultMessageForStatus(response.status);

    // Usa a mensagem específica do back-end (ex.: "Já existe um usuário cadastrado com este e-mail.").
    // O campo "error" do Spring é só o nome do status em inglês ("Forbidden"), por isso é ignorado.
    try {
      const errorJson = await response.json();
      const backendMsg = errorJson.message || errorJson.detail;
      if (typeof backendMsg === "string" && backendMsg.trim()) {
        errorMessage = backendMsg;
      }
    } catch {
      // payload não é JSON — mantém a mensagem amigável acima
    }

    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
