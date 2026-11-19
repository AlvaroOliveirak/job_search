"""
Cliente de Sincronização HTTP com o Back-end Spring Boot
Envia o lote de vagas coletadas e avaliadas para o endpoint /api/jobs/sync.

O endpoint exige o header X-Sync-Token. Quando o pipeline é disparado pelo
Spring Boot (botão "Atualizar Vagas"), o token chega pela variável de ambiente
SYNC_TOKEN do processo. Para rodar manualmente, defina SYNC_TOKEN com o mesmo
valor usado ao iniciar o back-end.
"""
from typing import List, Dict, Any, Optional
import json
import os
import urllib.request
import urllib.error

class SpringBootSyncClient:
    def __init__(self, base_url: str = "http://localhost:8082", sync_token: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.sync_token = sync_token if sync_token is not None else os.environ.get("SYNC_TOKEN", "")

    def sync_jobs(self, user_id: int, scored_jobs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Envia as vagas pontuadas para o Spring Boot."""
        url = f"{self.base_url}/api/jobs/sync"
        payload = {
            "user_id": user_id,
            "jobs": scored_jobs
        }

        headers = {"Content-Type": "application/json"}
        if self.sync_token:
            headers["X-Sync-Token"] = self.sync_token

        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers=headers,
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result
        except urllib.error.HTTPError as e:
            if e.code == 401:
                return {
                    "status": "unauthorized",
                    "message": "SYNC_TOKEN ausente ou inválido. Defina a mesma SYNC_TOKEN no back-end e neste processo."
                }
            return {
                "status": "error",
                "message": f"Spring Boot respondeu HTTP {e.code} em {url}."
            }
        except urllib.error.URLError as e:
            return {
                "status": "offline",
                "message": f"Não foi possível conectar ao Spring Boot ({url}): {e}"
            }
