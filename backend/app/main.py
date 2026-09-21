from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Garante que todos os modelos sejam importados e mapeados
from app.routers import auth, profiles, jobs

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Criação das tabelas no SQLite ao inicializar (se ainda não existirem)
    Base.metadata.create_all(bind=engine)
    yield
    # Limpeza/encerramento caso necessário futuramente

app = FastAPI(
    title="Job Searcher API",
    description="API RESTful para agregação e recomendação personalizada de vagas",
    version="1.0.0",
    lifespan=lifespan
)

# Configuração do CORS para permitir que o Vite/React (http://localhost:5173) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro dos módulos de rotas
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(jobs.router)

@app.get("/api/health", tags=["Health Check"])
def health_check():
    """Endpoint de verificação de integridade da API."""
    return {
        "status": "ok",
        "message": "Job Searcher API está operacional",
        "version": "1.0.0"
    }

