"""
Motor de IA & Processamento de Linguagem Natural (NLP) - Job Search
Calcula a aderência (Score 0-100%) entre o currículo/perfil do usuário e a vaga.
"""
import re
from typing import List, Set

class AIMatcher:
    def __init__(self):
        # Dicionário de termos técnicos e pesos
        self.tech_dictionary = {
            "react": 1.2,
            "typescript": 1.1,
            "javascript": 1.0,
            "java": 1.2,
            "spring boot": 1.3,
            "spring": 1.1,
            "python": 1.1,
            "fastapi": 1.0,
            "sql": 1.0,
            "docker": 1.0,
            "rest": 0.9,
            "css": 0.8,
            "html": 0.8,
            "git": 0.8,
            "node": 1.0
        }

    def _extract_tokens(self, text: str) -> Set[str]:
        """Normaliza e extrai termos técnicos do texto."""
        normalized = text.lower()
        # Captura palavras e expressões compostas conhecidas
        found = set()
        for phrase in ["spring boot", "react native"]:
            if phrase in normalized:
                found.add(phrase)
                normalized = normalized.replace(phrase, "")
        
        words = re.findall(r"\b[a-zA-Z0-9_+#.-]+\b", normalized)
        for w in words:
            if w in self.tech_dictionary:
                found.add(w)
        return found

    def calculate_score(self, user_keywords: str, job_title: str, job_description: str) -> float:
        """
        Calcula a aderência do candidato à vaga com base em overlap de termos
        e relevância ponderada. Retorna uma nota de 0 a 100.
        """
        user_terms = self._extract_tokens(user_keywords)
        job_terms = self._extract_tokens(f"{job_title} {job_description}")

        if not user_terms or not job_terms:
            return 50.0  # Nota neutra caso não haja termos identificados

        overlap = user_terms.intersection(job_terms)

        # Cálculo ponderado
        total_weight = sum(self.tech_dictionary.get(t, 1.0) for t in user_terms)
        match_weight = sum(self.tech_dictionary.get(t, 1.0) for t in overlap)

        raw_score = (match_weight / total_weight) * 100.0

        # Bônus se o título da vaga contiver palavras do usuário
        title_terms = self._extract_tokens(job_title)
        if title_terms.intersection(user_terms):
            raw_score += 10.0

        # Limita a nota entre 40.0 e 98.0
        final_score = max(40.0, min(98.0, round(raw_score, 1)))
        return final_score
