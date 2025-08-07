# Bot de Tenis ATP 🎾

Bot de Telegram que proporciona información sobre próximos partidos ATP, comparaciones de jugadores y predicciones de resultados usando inteligencia artificial.

## Características

- 📅 **Próximos partidos ATP**: Lista actualizada de partidos programados
- 🔮 **Predicciones AI**: Predicciones de resultados basadas en estadísticas
- 📊 **Comparaciones**: Estadísticas detalladas entre jugadores
- 🤖 **Interfaz intuitiva**: Botones interactivos para fácil navegación

## Configuración

### 1. Crear el bot en Telegram

1. Ve a [@BotFather](https://t.me/BotFather) en Telegram
2. Envía `/newbot` y sigue las instrucciones
3. Guarda el token que te proporciona

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar el token

Edita el archivo `telegram_bot.py` y reemplaza:

```python
BOT_TOKEN = "TU_TOKEN_AQUI"
```

Por tu token real:

```python
BOT_TOKEN = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

### 4. Ejecutar el bot

```bash
python telegram_bot.py
```

## Uso del bot

### Comandos disponibles:

- `/start` - Mensaje de bienvenida
- `/partidos` - Ver próximos partidos ATP
- `/ayuda` - Mostrar ayuda

### Funcionalidades:

1. **Ver partidos**: Lista de próximos partidos con información básica
2. **Predicciones**: Predicción AI del resultado con probabilidades
3. **Navegación**: Botones interactivos para fácil uso

## Estructura del proyecto

```
BOT_telegram/
│
├── atp_api.py          # Clase para conectar con las APIs
├── telegram_bot.py     # Bot de Telegram principal
├── requirements.txt    # Dependencias
└── README.md          # Este archivo
```

## APIs utilizadas

- **ATP Info API**: Información de partidos y comparaciones
- **ATP Prediction API**: Predicciones con IA

## Formato de respuesta del bot

Para cada partido, el bot muestra:

```
🏆 Partido 1
📅 2025-07-19
👥 Francisco Cerundolo vs Damir Dzumhur
🏟️ Nordea Open
🏷️ ATP 250 | 🎾 Clay
```

Para las predicciones:

```
🔮 PREDICCIÓN DEL PARTIDO

🎯 RESULTADO PREDICHO
🏆 Ganador: Francisco Cerundolo
📊 Probabilidad: 65.2%

📈 PROBABILIDADES DETALLADAS
• Francisco Cerundolo: 65.2%
• Damir Dzumhur: 34.8%
```

## Solución de problemas

### Error de token
```
❌ Error: Debes configurar tu BOT_TOKEN en telegram_bot.py
```
**Solución**: Configura tu token real de @BotFather

### Error de conexión a API
```
❌ Error al obtener los partidos
```
**Solución**: Verifica tu conexión a internet y que las APIs estén funcionando

### Error de dependencias
```
ModuleNotFoundError: No module named 'telegram'
```
**Solución**: Instala las dependencias con `pip install -r requirements.txt`

## Desarrollo

Para probar solo las APIs sin el bot:

```bash
python atp_api.py
```

## Contribuciones

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request
