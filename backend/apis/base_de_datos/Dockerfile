# Usar Python 3.11 slim como imagen base (más reciente y estable)
FROM python:3.11-slim

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivo de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY ./app ./app

# Copiar el archivo de credenciales de Firebase
COPY serviceAccountKey.json ./serviceAccountKey.json

# Crear usuario no-root para seguridad
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# Exponer el puerto que usa FastAPI
EXPOSE $PORT

# Health check (Cloud Run usará este endpoint para verificar)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
