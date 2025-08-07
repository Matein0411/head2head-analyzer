from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from datetime import datetime
from app.dependencies.database import get_db
from app.models import User as UserModel
from app.schemas.usuarios import User as UserSchema
from app.schemas.usuarios import PredictionRequest
from ..dependencies.auth import verify_token

router = APIRouter(prefix="/users", tags=["Usuarios"])


@router.post("/auth/sync", response_model=UserSchema, summary="Crear o actualizar usuario tras login/registro de forma segura")
async def sync_user(
    # La dependencia 'verify_token' se encarga de la seguridad.
    decoded_token: dict = Depends(verify_token), 
    db: Session = Depends(get_db)
):
    # Extrae los datos del token ya verificado. Esta es la fuente de confianza.
    uid = decoded_token.get("uid")
    email = decoded_token.get("email")
    display_name = decoded_token.get("name") or decoded_token.get("displayName")
    photo_url = decoded_token.get("picture")
    auth_provider = decoded_token.get("firebase", {}).get("sign_in_provider")

    # Construye la sentencia de "UPSERT"
    stmt = insert(UserModel).values(
        firebase_uid=uid,
        email=email,
        display_name=display_name,
        photo_url=photo_url,
        auth_provider=auth_provider

    ).on_conflict_do_update(
        index_elements=[UserModel.firebase_uid],
        set_={
            "display_name": display_name,
            "photo_url": photo_url,
            "updated_at": datetime.utcnow()
        }
    ).returning(UserModel) 


    result = db.execute(stmt)
    db.commit()
    
    synced_user = result.scalar_one()
    
    return synced_user

# Endpoint para descontar créditos por predicción
@router.post("/predict", summary="Descontar créditos por predicción")
async def predict_and_update_credits(
    prediction_data: PredictionRequest,
    decoded_token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_uid = decoded_token.get("uid")
    
    user = db.query(UserModel).filter_by(firebase_uid=user_uid).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user.credits < prediction_data.credits_to_deduct:
        raise HTTPException(status_code=402, detail="Créditos insuficientes")

    user.credits -= prediction_data.credits_to_deduct
    user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(user)    
    
    return {"firebase_uid": user.firebase_uid, "new_credits": user.credits}

# Endpoint para obtener el perfil del usuario logueado
@router.get("/me", response_model=UserSchema, summary="Obtener perfil del usuario actual")
async def get_me(
    decoded_token: dict = Depends(verify_token), 
    db: Session = Depends(get_db)
):
    user_uid = decoded_token.get("uid")
    
    user = db.query(UserModel).filter_by(firebase_uid=user_uid).first()
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="Usuario no encontrado en la base de datos."
        )
    return user