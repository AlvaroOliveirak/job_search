"""
Scraper de Vagas Reais - Job Search
Responsável pela coleta, normalização e deduplicação de oportunidades de tecnologia
diretamente da API pública do Portal Gupy.
"""
import hashlib
import json
import urllib.parse
import urllib.request
from typing import List, Dict, Any, Optional

class JobScraper:
    def __init__(self):
        self.base_url = "https://portal.gupy.io/api/job-search/jobs"
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json",
        }

    @staticmethod
    def generate_job_hash(company: str, title: str, url: str) -> str:
        """Gera um hash SHA-256 único para garantir a deduplicação de vagas."""
        raw = f"{company.strip().lower()}|{title.strip().lower()}|{url.strip().lower()}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def _normalize_location(self, job_raw: Dict[str, Any]) -> str:
        """Padroniza a localização da vaga (Remoto, Híbrido, Cidade/UF)."""
        workplace_type = (job_raw.get("workplaceType") or "").strip().lower()
        city = (job_raw.get("city") or "").strip()
        state = (job_raw.get("state") or "").strip()

        if workplace_type == "remote":
            return "Remoto - Brasil"

        location_parts = []
        if city:
            location_parts.append(city)
        if state:
            location_parts.append(state)

        location_str = ", ".join(location_parts)

        if workplace_type == "hybrid":
            return f"{location_str} (Híbrido)" if location_str else "Híbrido - Brasil"
        elif workplace_type == "on-site":
            return f"{location_str} (Presencial)" if location_str else "Presencial - Brasil"

        return location_str or "Brasil"

    def fetch_jobs(self, query: str = "desenvolvedor", limit: int = 15) -> List[Dict[str, Any]]:
        """
        Coleta vagas ao vivo diretamente da API pública de busca da Gupy.
        """
        encoded_query = urllib.parse.quote(query)
        target_url = f"{self.base_url}?jobName={encoded_query}&limit={limit}"
        req = urllib.request.Request(target_url, headers=self.headers)

        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status != 200:
                    print(f"⚠️ Aviso: Gupy retornou status {response.status} para '{query}'")
                    return []

                payload = json.loads(response.read().decode("utf-8"))
                raw_jobs = payload.get("data", [])
                results: List[Dict[str, Any]] = []

                for item in raw_jobs:
                    title = (item.get("name") or "").strip()
                    company = (item.get("careerPageName") or "Empresa Parceira").strip()
                    url = (item.get("jobUrl") or "").strip()
                    description = (item.get("description") or "").strip()
                    posted_at = item.get("publishedDate")
                    location = self._normalize_location(item)

                    if not title or not url:
                        continue

                    job_hash = self.generate_job_hash(company, title, url)

                    results.append({
                        "job_hash": job_hash,
                        "title": title,
                        "company": company,
                        "location": location,
                        "url": url,
                        "description": description if description else f"Oportunidade para {title} na empresa {company}.",
                        "source": "Gupy",
                        "posted_at": posted_at
                    })

                return results

        except Exception as e:
            print(f"⚠️ Erro ao consultar a API da Gupy para o termo '{query}': {e}")
            return []

    def fetch_tech_jobs(
        self,
        queries: Optional[List[str]] = None,
        limit_per_query: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Coleta vagas de múltiplos termos técnicos e deduplica em memória pelo hash SHA-256.
        """
        if queries is None:
            queries = ["react", "java", "python", "fullstack", "desenvolvedor"]

        seen_hashes = set()
        deduplicated_jobs: List[Dict[str, Any]] = []

        for q in queries:
            print(f"  🔍 Coletando vagas reais para '{q}' na Gupy...")
            batch = self.fetch_jobs(query=q, limit=limit_per_query)
            new_in_batch = 0

            for job in batch:
                h = job["job_hash"]
                if h not in seen_hashes:
                    seen_hashes.add(h)
                    deduplicated_jobs.append(job)
                    new_in_batch += 1

            print(f"     ✓ {new_in_batch} novas vagas adicionadas.")

        return deduplicated_jobs
