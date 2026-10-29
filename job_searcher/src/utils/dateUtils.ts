/**
 * Utilitários para formatação e manipulação de datas e prazos de vagas.
 */

/**
 * Formata uma data ISO para exibição amigável relativa (ex: "há 2 horas", "ontem", "há 3 dias").
 */
export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "Data não informada";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data recente";

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    // Se a data for no futuro ou muito recente
    if (diffInMs < 60 * 1000) {
      return "Agora mesmo";
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return "Ontem";
    }
    if (diffInDays < 30) {
      return `Há ${diffInDays} dias`;
    }

    // Se mais de 30 dias, exibe formato padrão brasileiro
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Data recente";
  }
}

/**
 * Formata data e hora completa em formato brasileiro (ex: "28/10/2026 às 23:15").
 */
export function formatFullDateTime(dateString?: string | null): string {
  if (!dateString) return "Não sincronizado";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recente";

    const dateFormatted = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const timeFormatted = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateFormatted} às ${timeFormatted}`;
  } catch {
    return "Data recente";
  }
}

/**
 * Determina se a vaga foi publicada recentemente (por padrão, nos últimos 5 dias).
 */
export function isRecentJob(dateString?: string | null, daysThreshold: number = 5): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;

    const diffInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays >= 0 && diffInDays <= daysThreshold;
  } catch {
    return false;
  }
}
