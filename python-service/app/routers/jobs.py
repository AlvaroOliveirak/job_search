from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.user import User
from app.models.match import UserJobMatch
from app.schemas.match import UserJobMatchResponse, MatchStatusUpdate
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["Vagas & Recomendações"])

@router.get("", response_model=List[UserJobMatchResponse])
def get_user_jobs(
    status_filter: Optional[str] = Query(None, alias="status", description="Filtrar por status: new, viewed, applied, discarded"),
    is_favorite: Optional[bool] = Query(None, description="Filtrar apenas vagas favoritadas"),
    min_score: Optional[float] = Query(None, description="Filtrar por pontuação mínima"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna as vagas recomendadas para o usuário logado com suas pontuações e status.
    Facilita os estados do front-end (loading, lista vazia [] ou resultados).
    """
    query = (
        db.query(UserJobMatch)
        .options(joinedload(UserJobMatch.job))
        .filter(UserJobMatch.user_id == current_user.id)
    )

    if status_filter:
        query = query.filter(UserJobMatch.status == status_filter)
    if is_favorite is not None:
        query = query.filter(UserJobMatch.is_favorite == is_favorite)
    if min_score is not None:
        query = query.filter(UserJobMatch.score >= min_score)

    # Ordena por maior pontuação (melhores vagas primeiro) e depois por data
    matches = query.order_by(UserJobMatch.score.desc(), UserJobMatch.matched_at.desc()).offset(skip).limit(limit).all()
    return matches

@router.patch("/{match_id}", response_model=UserJobMatchResponse)
def update_job_match_state(
    match_id: int,
    update_data: MatchStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualização de estado: permite ao front-end favoritar uma vaga ou alterar seu status
    (ex: de 'new' para 'applied' ou 'discarded').
    """
    match = (
        db.query(UserJobMatch)
        .options(joinedload(UserJobMatch.job))
        .filter(UserJobMatch.id == match_id, UserJobMatch.user_id == current_user.id)
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registro de vaga não encontrado para este usuário."
        )

    if update_data.is_favorite is not None:
        match.is_favorite = update_data.is_favorite
    if update_data.status is not None:
        match.status = update_data.status

    db.commit()
    db.refresh(match)
    return match

