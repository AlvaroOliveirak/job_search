"""
Orquestrador Principal do Serviço Python (Job Search AI & Crawler)
Fluxo completo: Scraping Gupy Real -> NLP Matching -> Alertas Telegram -> Sincronização Spring Boot
"""
import sys
import io
import argparse

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from scraper import JobScraper
from ai_matcher import AIMatcher
from telegram_notifier import TelegramNotifier
from sync_client import SpringBootSyncClient

def parse_args():
    parser = argparse.ArgumentParser(description="Pipeline de Scraping Gupy & Matching IA")
    parser.add_argument("--user_id", type=int, default=1, help="ID do usuário no Spring Boot")
    parser.add_argument("--name", type=str, default="Candidato", help="Nome do candidato")
    parser.add_argument("--keywords", type=str, default="React, TypeScript, Java, Spring Boot, CSS Modules, Git, REST", help="Habilidades/Keywords do usuário")
    parser.add_argument("--chat_id", type=str, default="123456789", help="Telegram Chat ID para alertas")
    return parser.parse_args()

def extract_search_queries(keywords_str: str) -> list[str]:
    """Extrai até 5 termos relevantes das skills do usuário para guiar a busca na Gupy."""
    terms = [k.strip() for k in keywords_str.split(",") if k.strip()]
    cleaned_terms = []
    for t in terms:
        cleaned = t.strip()
        if len(cleaned) >= 2 and cleaned.lower() not in [c.lower() for c in cleaned_terms]:
            cleaned_terms.append(cleaned)
    
    # Seleciona as primeiras 4 skills como queries diretas
    queries = cleaned_terms[:4]
    
    # Se tiver menos de 3 termos, complementa com termos gerais de tecnologia
    defaults = ["desenvolvedor", "fullstack", "tecnologia"]
    for d in defaults:
        if len(queries) < 3 and d not in [q.lower() for q in queries]:
            queries.append(d)
            
    return queries or ["desenvolvedor"]

def run_pipeline():
    args = parse_args()
    user_id = args.user_id
    user_name = args.name
    user_keywords = args.keywords
    user_chat_id = args.chat_id

    print("=" * 65)
    print("🤖 JOB SEARCH - PIPELINE DE COLETA REAL GUPY & MATCH IA")
    print("=" * 65)

    print(f"\n👤 Candidato Alvo: {user_name} (ID: {user_id})")
    print(f"🎯 Perfil de Busca / Skills: {user_keywords}")

    # 1. Extrai queries a partir das habilidades cadastradas pelo usuário
    queries = extract_search_queries(user_keywords)
    print(f"🔎 Termos de busca derivados das skills: {queries}")

    # 2. Executa o Scraper Real na API do Portal Gupy com os termos das skills
    print("\n🔍 1. Coletando vagas REAIS diretamente do Portal da Gupy...")
    scraper = JobScraper()
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
