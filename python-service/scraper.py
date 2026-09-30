"""
Scraper de Vagas - Job Search
Responsável pela extração, normalização e deduplicação de oportunidades de tecnologia.
"""
import hashlib
from typing import List, Dict, Any

class JobScraper:
    def __init__(self):
        self.sources = ["Gupy", "LinkedIn", "Infojobs"]

    @staticmethod
    def generate_job_hash(company: str, title: str, url: str) -> str:
        """Gera um hash SHA-256 para garantir que não haja duplicidade de vagas."""
        raw = f"{company.strip().lower()}|{title.strip().lower()}|{url.strip().lower()}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def fetch_jobs(self, query: str = "Desenvolvedor") -> List[Dict[str, Any]]:
        """
        Simula a extração de vagas da web (Gupy / APIs / HTML Parsing com BeautifulSoup).
        Retorna dicionários prontos para o motor de IA e para o Spring Boot.
        """
        raw_opportunities = [
            {
                "title": "Desenvolvedor Front-end Júnior (React / TypeScript)",
                "company": "Nubank",
                "location": "Remoto - Brasil",
                "url": "https://nubank.gupy.io/job/101",
                "description": "Construção de interfaces modernas em React 19, TypeScript e CSS Modules. Consumo de APIs RESTful.",
                "source": "Gupy"
            },
            {
                "title": "Desenvolvedor Back-End Java / Spring Boot Júnior",
                "company": "Mercado Livre",
                "location": "São Paulo, SP (Híbrido)",
                "url": "https://mercadolivre.gupy.io/job/102",
                "description": "Desenvolvimento de microsserviços com Java 17/21, Spring Boot 3, Spring Data JPA e mensageria.",
                "source": "Gupy"
            },
            {
                "title": "Engenheiro de Software Full Stack (React + Java/Node)",
                "company": "iFood",
                "location": "Remoto - Brasil",
                "url": "https://ifood.gupy.io/job/103",
                "description": "Atuação com React no frontend e Java/Spring Boot no backend. Foco em arquitetura escalável e testes.",
                "source": "Gupy"
            },
            {
                "title": "Desenvolvedor Python & IA Júnior",
                "company": "Stone",
                "location": "Rio de Janeiro, RJ (Híbrido)",
                "url": "https://stone.gupy.io/job/104",
                "description": "Criação de crawlers e pipelines em Python, FastAPI e processamento de linguagem natural.",
                "source": "Gupy"
            }
        ]

        results = []
        for opp in raw_opportunities:
            opp["job_hash"] = self.generate_job_hash(opp["company"], opp["title"], opp["url"])
            results.append(opp)

        return results
