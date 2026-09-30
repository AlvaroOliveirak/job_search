"""
Notificador Telegram - Job Search
Envia alertas instantâneos de vagas com alto índice de Match (>= 85%) diretamente no Telegram.
"""
from typing import Optional

class TelegramNotifier:
    def __init__(self, bot_token: Optional[str] = None):
        self.bot_token = bot_token

    def send_match_alert(self, chat_id: str, job_title: str, company: str, score: float, url: str) -> bool:
        """
        Formata e simula o disparo de alerta de vaga para o chat do Telegram.
        """
        message = (
            f"🚀 *NOVA VAGA ENCONTRADA COM ALTO MATCH!*\n\n"
            f"★ *Aderência IA:* `{score}%`\n"
            f"🏢 *Empresa:* {company}\n"
            f"💼 *Cargo:* {job_title}\n"
            f"🔗 *Candidatura:* [Acessar Oportunidade]({url})\n\n"
            f"_Dica: Acesse seu painel em Job Search para atualizar o status da candidatura._"
        )

        print(f"\n[TELEGRAM BOT -> Chat {chat_id}]")
        print(message)
        print("-" * 50)
        return True
