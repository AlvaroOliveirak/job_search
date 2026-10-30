"""
Orquestrador Principal do Serviço Python (Job Search AI & Crawler)
Fluxo completo: Scraping Gupy Real -> NLP Matching -> Alertas Telegram -> Sincronização Spring Boot
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
    print("=" * 65)
    print("🤖 JOB SEARCH - PIPELINE DE COLETA REAL GUPY & MATCH IA")
    print("=" * 65)

    # 1. Perfil do Candidato Alvo (usuário seed do Spring Boot)
    user_id = 1
    user_name = "Álvaro Oliveira"
    user_chat_id = "123456789"
    user_keywords = "React, TypeScript, Java, Spring Boot, CSS Modules, Git, REST"

    print(f"\n👤 Candidato Alvo: {user_name} (ID: {user_id})")
    print(f"🎯 Perfil de Busca / Keywords: {user_keywords}")

    # 2. Executa o Scraper Real na API do Portal Gupy
    print("\n🔍 1. Coletando vagas REAIS diretamente do Portal da Gupy...")
    scraper = JobScraper()
    queries = ["react", "java", "python", "fullstack", "desenvolvedor junior"]
    jobs = scraper.fetch_tech_jobs(queries=queries, limit_per_query=6)
    print(f"\n✓ Sucesso: {len(jobs)} vagas reais coletadas e deduplicadas via SHA-256.")

    # 3. Executa o Motor de IA (NLP)
    print("\n🧠 2. Processando aderência com Motor de IA (AIMatcher)...")
    matcher = AIMatcher()
    notifier = TelegramNotifier()
    scored_jobs = []

    for job in jobs:
        score = matcher.calculate_score(user_keywords, job["title"], job["description"])
        job["score"] = score
        scored_jobs.append(job)
        print(f"  • [{score:4.1f}% Match] {job['title']} @ {job['company']} ({job['location']})")

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
    print("\n📡 3. Sincronizando vagas com o Back-end Spring Boot (http://localhost:8082)...")
    client = SpringBootSyncClient(base_url="http://localhost:8082")
    response = client.sync_jobs(user_id=user_id, scored_jobs=scored_jobs)

    print(f"  • Status da Sincronização: {response.get('status')}")
    print(f"  • Mensagem: {response.get('message')}")
    if "total_synced" in response:
        print(f"  • Total de Vagas Gravadas no Banco H2: {response.get('total_synced')}")

    print("\n✓ Pipeline concluído com sucesso!")
    print("=" * 65)

if __name__ == "__main__":
    run_pipeline()
