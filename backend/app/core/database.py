from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# check_same_thread=False permite uso de threads concorrentes no FastAPI/Scheduler
connect_args = {"check_same_thread": False, "timeout": 15}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args
)

# Configuração de engenharia para SQLite em alto desempenho e concorrência
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    # Ativa o modo WAL (Write-Ahead Logging) para permitir leituras e escritas simultâneas
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    # Garante integridade referencial de chaves estrangeiras
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependência do FastAPI para injeção de sessão do banco de dados."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

