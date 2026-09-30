"""
Cliente de Sincronização HTTP com o Back-end Spring Boot
Envia o lote de vagas coletadas e avaliadas para o endpoint /api/jobs/sync.
"""
from typing import List, Dict, Any
import json
import urllib.request
import urllib.error

class SpringBootSyncClient:
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url.rstrip("/")

    def sync_jobs(self, user_id: int, scored_jobs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Envia as vagas pontuadas para o Spring Boot."""
        url = f"{self.base_url}/api/jobs/sync"
        payload = {
            "user_id": user_id,
            "jobs": scored_jobs
        }

        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result
        except urllib.error.URLError as e:
            return {
                "status": "offline",
                "message": f"Não foi possível conectar ao Spring Boot ({url}): {e}"
            }
