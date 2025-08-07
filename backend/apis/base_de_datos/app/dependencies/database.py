# app/database.py
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# URL de conexión a PostgreSQL desde variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Verificar que la URL de la base de datos esté configurada
if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en las variables de entorno")

# SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

metadata = MetaData()

# Dependency para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
