from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.search_profile import SearchProfile
from app.schemas.search_profile import SearchProfileCreate, SearchProfileResponse, SearchProfileUpdate
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/profiles", tags=["Perfis de Busca"])

@router.post("", response_model=SearchProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_in: SearchProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria um novo perfil de busca com palavras-chave para o usuário autenticado."""
    profile = SearchProfile(
        user_id=current_user.id,
        name=profile_in.name,
        keywords=profile_in.keywords,
        min_score=profile_in.min_score
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("", response_model=List[SearchProfileResponse])
def list_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todos os perfis de busca do usuário logado (retorna lista vazia se não houver)."""
    return db.query(SearchProfile).filter(SearchProfile.user_id == current_user.id).all()

@router.put("/{profile_id}", response_model=SearchProfileResponse)
def update_profile(
    profile_id: int,
    profile_update: SearchProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza um perfil de busca existente pertencente ao usuário."""
    profile = db.query(SearchProfile).filter(
        SearchProfile.id == profile_id,
        SearchProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de busca não encontrado.")

    if profile_update.name is not None:
        profile.name = profile_update.name
    if profile_update.keywords is not None:
        profile.keywords = profile_update.keywords
    if profile_update.min_score is not None:
        profile.min_score = profile_update.min_score

    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove um perfil de busca pertencente ao usuário."""
    profile = db.query(SearchProfile).filter(
        SearchProfile.id == profile_id,
        SearchProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil de busca não encontrado.")

    db.delete(profile)
    db.commit()
    return None

