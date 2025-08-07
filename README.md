# 🎾 TennAI - Head2Head Analyzer

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Platform](https://img.shields.io/badge/platform-web-blue.svg)]()
[![AI Model](https://img.shields.io/badge/model-XGBoost-orange.svg)]()
[![Cloud](https://img.shields.io/badge/cloud-Google%20Cloud-4285f4.svg)]()

> **TennAI** es una plataforma de análisis y predicción de partidos del circuito ATP que utiliza inteligencia artificial (XGBoost) para generar predicciones precisas basadas en estadísticas históricas, head-to-head, superficie de juego, tipo de torneo, etc.

## 🚀 Características Principales

- 🧠 **Predicciones con IA**: Modelo XGBoost entrenado con datos históricos del ATP
- 📊 **Análisis Head-to-Head**: Comparación directa entre jugadores
- 🎯 **Predicciones Contextuales**: Considera superficie, tipo de torneo y condiciones
- 👤 **Perfiles de Jugadores**: Estadísticas detalladas y rendimiento histórico
- 💳 **Sistema de Créditos**: Gestión de predicciones con planes de suscripción
- 🔐 **Autenticación Firebase**: Registro y login seguro
- 📱 **Bot de Telegram**: Acceso a predicciones desde Telegram
- 🌐 **Responsive Design**: Optimizado para móviles y desktop

## 🏗️ Arquitectura del Sistema

### APIs Backend

**🗄️ API Base de Datos**
- Gestión de usuarios y autenticación
- Estadísticas y perfiles de jugadores ATP
- Sistema de créditos y suscripciones

**🧠 API Modelo**
- Predicciones con XGBoost
- Análisis head-to-head
- Cálculo de probabilidades

**🤖 Bot Telegram**
- Interfaz conversacional
- Predicciones por chat

### 🛠️ Stack Tecnológico

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/ui
- Firebase Authentication
- React Router DOM
- Axios (HTTP client)

**Backend APIs:**
- FastAPI (Python)
- XGBoost (modelo de ML)
- SQLAlchemy + PostgreSQL
- Firebase Admin SDK
- Google Cloud Run

**Bot:**
- Python Telegram Bot
- Docker containerizado

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Python 3.9+
- Docker (opcional para bot)
- Cuenta de Firebase
- Cuenta de Google Cloud

### 🖥️ Frontend (Aplicación Web)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/head2head-analyzer.git
   cd head2head-analyzer/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear .env en frontend/
   VITE_FIREBASE_API_KEY=tu_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_API_BASE_URL=https://atp-info-api-415222988867.us-central1.run.app
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:5173`

5. **Build para producción**
   ```bash
   npm run build
   npm run preview
   ```

### 🔧 Backend APIs

#### API de Base de Datos (Gestión de Usuarios)

```bash
cd backend/apis/base_de_datos

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear .env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
FIREBASE_PROJECT_ID=tu_project_id

# Ejecutar API
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### API de Modelo (Predicciones XGBoost)

```bash
cd backend/apis/modelo

# Instalar dependencias
pip install -r requeriments.txt

# Configurar variables de entorno
# Crear .env
MODEL_PATH=./AI_models/modelo_xgb2.pkl
API_BASE_URL=https://atp-info-api-415222988867.us-central1.run.app

# Ejecutar API
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 🤖 Bot de Telegram

1. **Configurar Bot**
   ```bash
   cd backend/bot_telegram
   
   # Instalar dependencias
   pip install -r requirements.txt
   ```

2. **Variables de entorno**
   ```bash
   # Crear .env
   TELEGRAM_BOT_TOKEN=tu_bot_token_de_botfather
   ATP_API_BASE_URL=https://atp-info-api-415222988867.us-central1.run.app
   ```

3. **Ejecutar Bot**
   ```bash
   python telegram_bot.py
   ```

4. **Docker (Alternativo)**
   ```bash
   # Build imagen
   docker build -t tennai-bot .
   
   # Ejecutar contenedor
   docker run -d --env-file .env --name tennai-bot tennai-bot
   ```

## 🌐 APIs Desplegadas en Google Cloud

### Endpoints Principales

**API Base de Datos:**
- 🔗 `https://atp-info-api-415222988867.us-central1.run.app`
- Gestión de usuarios, autenticación y créditos

**API Modelo de Predicción:**
- 🔗 `https://predict-api-415222988867.us-central1.run.app`
- Predicciones con modelo XGBoost

### Endpoints Principales

```http
# API Base de Datos
GET  /player/{nombre}                    # Obtener jugador
GET  /h2h-simple/{player1}/{player2}     # Head-to-head
GET  /next-matches                       # Próximos partidos
POST /sync-user                          # Sincronizar usuario

# API Modelo  
GET  /comparison-basic/{p1}/{p2}         # Comparación para predicción
POST /predict                            # Realizar predicción XGBoost
```

## 📊 Modelo de Machine Learning

### XGBoost para Predicciones ATP