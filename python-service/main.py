"""
Orquestrador Principal do Serviço Python (Job Search AI & Crawler)
Fluxo completo: Scraping -> NLP Matching -> Notificação Telegram -> Sincronização Spring Boot
"""
import sys
import io

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from scraper import JobScraper
from ai_matcher import AIMatcher
from telegram_notifier import TelegramNotifier
from sync_client import SpringBootSyncClient

def run_pipeline():
    print("=" * 60)
    print("🤖 JOB SEARCH - SERVIÇO PYTHON DE COLETA & IA")
    print("=" * 60)

    # 1. Perfil do Candidato (simulado ou consultado do Spring Boot)
    user_id = 1
    user_name = "Álvaro Oliveira"
    user_chat_id = "123456789"
    user_keywords = "React, TypeScript, Java, Spring Boot, CSS Modules, Git"

    print(f"\n👤 Candidato Alvo: {user_name} (ID: {user_id})")
    print(f"🎯 Palavras-chave: {user_keywords}")

    # 2. Executa o Scraper
    print("\n🔍 1. Coletando vagas de tecnologia via Web Scraping...")
    scraper = JobScraper()
    jobs = scraper.fetch_jobs(query="Desenvolvedor")
    print(f"✓ {len(jobs)} vagas coletadas com hash de deduplicação único.")

    # 3. Executa o Motor de IA (NLP)
    print("\n🧠 2. Processando aderência com Motor de IA (AIMatcher)...")
    matcher = AIMatcher()
    notifier = TelegramNotifier()
    scored_jobs = []

    for job in jobs:
        score = matcher.calculate_score(user_keywords, job["title"], job["description"])
        job["score"] = score
        scored_jobs.append(job)
        print(f"  • [{score}% Match] {job['title']} @ {job['company']}")

        # 4. Alerta no Telegram se o Match for alto
        if score >= 85.0:
            notifier.send_match_alert(
                chat_id=user_chat_id,
                job_title=job["title"],
                company=job["company"],
                score=score,
                url=job["url"]
            )

    # 5. Sincronização com o Back-End Spring Boot
    print("\n📡 3. Sincronizando resultados com o Back-end Spring Boot (http://localhost:8080)...")
    client = SpringBootSyncClient(base_url="http://localhost:8080")
    response = client.sync_jobs(user_id=user_id, scored_jobs=scored_jobs)

    print(f"Status da Sincronização: {response.get('status')}")
    print(f"Mensagem: {response.get('message')}")
    print("\n✓ Pipeline concluído com sucesso!")
    print("=" * 60)

if __name__ == "__main__":
    run_pipeline()
