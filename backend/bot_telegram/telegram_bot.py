import asyncio
import logging
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from atp_api import ATPInfoAPI

# Cargar variables de entorno
from dotenv import load_dotenv
load_dotenv()

# Configurar logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN")

# Instancia de la API
api = ATPInfoAPI()


class TennisBot:
    def __init__(self):
        self.api = ATPInfoAPI()
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Comando /start - Mensaje de bienvenida"""
        welcome_message = (
            "🎾 ¡Bienvenido al Bot de Tenis ATP! 🎾\n\n"
            "Comandos disponibles:\n"
            "• /partidos - Ver próximos partidos ATP\n"
            "• /ayuda - Mostrar esta ayuda\n\n"
            "¡Comienza explorando los próximos partidos!"
        )
        
        keyboard = [
            [InlineKeyboardButton("📅 Ver Próximos Partidos", callback_data="ver_partidos")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(welcome_message, reply_markup=reply_markup)
    
    async def ayuda(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Comando /ayuda - Información de ayuda"""
        help_message = (
            "🤖 Ayuda del Bot de Tenis ATP\n\n"
            "Este bot te permite:\n"
            "• Ver próximos partidos ATP\n"
            "• Obtener predicciones de resultados\n"
            "• Comparar estadísticas de jugadores\n\n"
            "Comandos:\n"
            "• /start - Mensaje de bienvenida\n"
            "• /partidos - Lista de próximos partidos\n"
            "• /ayuda - Esta ayuda\n\n"
            "¡Simplemente usa los botones para navegar!"
        )
        await update.message.reply_text(help_message)
    
    async def mostrar_partidos(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Comando /partidos - Mostrar próximos partidos"""
        await self._enviar_lista_partidos(update, context, es_comando=True)
    
    async def _enviar_lista_partidos(self, update: Update, context: ContextTypes.DEFAULT_TYPE, es_comando=False):
        """Función auxiliar para enviar lista de partidos"""
        
        # Mensaje de carga
        if es_comando:
            loading_msg = await update.message.reply_text("🔄 Obteniendo próximos partidos...")
        else:
            loading_msg = await update.callback_query.edit_message_text("🔄 Obteniendo próximos partidos...")
        
        # Obtener partidos
        partidos_data = self.api.obtener_partidos_futuros()
        
        if not partidos_data:
            await loading_msg.edit_text("❌ Error al obtener los partidos. Intenta de nuevo más tarde.")
            return
        
        matches = partidos_data.get('matches', [])
        total_matches = partidos_data.get('total_matches', 0)
        
        if not matches:
            await loading_msg.edit_text("📅 No hay partidos programados próximamente.")
            return
        
        # Formatear mensaje
        mensaje = f"🎾 **PRÓXIMOS PARTIDOS ATP** 🎾\n"
        mensaje += f"📊 Total de partidos: {total_matches}\n\n"
        
        # Crear botones para cada partido (máximo 5 para no sobrecargar)
        keyboard = []
        for i, match in enumerate(matches[:5], 1):
            player1 = match.get('player1_name', 'N/A')
            player2 = match.get('player2_name', 'N/A')
            tourney = match.get('tourney_name', 'N/A')
            category = match.get('tourney_type', 'N/A')
            surface = match.get('surface', 'N/A')
            fecha = match.get('snapshot_date', 'N/A')
            
            # Agregar al mensaje
            mensaje += f"🏆 **Partido {i}**\n"
            mensaje += f"📅 {fecha}\n"
            mensaje += f"👥 {player1} vs {player2}\n"
            mensaje += f"🏟️ {tourney}\n"
            mensaje += f"🏷️ {category} | 🎾 {surface}\n"
            mensaje += "━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            
            # Crear botón para predicción
            button_text = f"🔮 Predicción: {player1} vs {player2}"
            if len(button_text) > 64:  # Límite de Telegram
                button_text = f"🔮 Partido {i}: Predicción"
            
            keyboard.append([
                InlineKeyboardButton(button_text, callback_data=f"predict_{i-1}")
            ])
        
        # Botón de actualizar
        keyboard.append([
            InlineKeyboardButton("🔄 Actualizar Partidos", callback_data="ver_partidos")
        ])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        await loading_msg.edit_text(mensaje, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Manejar callbacks de botones"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "ver_partidos":
            await self._enviar_lista_partidos(update, context)
        
        elif query.data.startswith("predict_"):
            # Extraer índice del partido
            match_index = int(query.data.split("_")[1])
            await self._mostrar_prediccion(update, context, match_index)
    
    async def _mostrar_prediccion(self, update: Update, context: ContextTypes.DEFAULT_TYPE, match_index: int):
        """Mostrar predicción para un partido específico"""
        
        loading_msg = await update.callback_query.edit_message_text(
            "🔮 Generando predicción... Esto puede tomar unos segundos."
        )
        
        # Obtener partidos nuevamente
        partidos_data = self.api.obtener_partidos_futuros()
        
        if not partidos_data or match_index >= len(partidos_data.get('matches', [])):
            await loading_msg.edit_text("❌ Error: Partido no encontrado.")
            return
        
        match = partidos_data['matches'][match_index]
        
        # Ejecutar flujo completo
        resultado = self.api.flujo_completo_partido(match)
        
        if resultado.get('error'):
            await loading_msg.edit_text(f"❌ Error al generar predicción: {resultado['error']}")
            return
        
        # Formatear resultado
        player1 = match.get('player1_name', 'N/A')
        player2 = match.get('player2_name', 'N/A')
        tourney = match.get('tourney_name', 'N/A')
        category = match.get('tourney_type', 'N/A')
        surface = match.get('surface', 'N/A')
        fecha = match.get('snapshot_date', 'N/A')
        
        # Datos de predicción
        prediccion_data = resultado.get('prediccion', {}).get('data', {})
        prediction = prediccion_data.get('prediction', 0)
        prob_p1 = prediccion_data.get('probability_p1_wins', 0)
        prob_p2 = prediccion_data.get('probability_p2_wins', 0)
        
        # Determinar ganador por mayor probabilidad
        if prob_p1 > prob_p2:
            ganador_predicho = player1
            prob_ganador = prob_p1
        elif prob_p2 > prob_p1:
            ganador_predicho = player2
            prob_ganador = prob_p2
        else:
            ganador_predicho = "Empate"
            prob_ganador = prob_p1  # o prob_p2, son iguales
        
        mensaje = f"🔮 **PREDICCIÓN DEL PARTIDO** 🔮\n\n"
        mensaje += f"📅 **Fecha:** {fecha}\n"
        mensaje += f"👥 **Jugadores:** {player1} vs {player2}\n"
        mensaje += f"🏟️ **Torneo:** {tourney}\n"
        mensaje += f"🏷️ **Categoría:** {category}\n"
        mensaje += f"🎾 **Superficie:** {surface}\n\n"
        
        mensaje += f"🎯 **RESULTADO PREDICHO** 🎯\n"
        mensaje += f"🏆 **Ganador:** {ganador_predicho}\n"
        mensaje += f"📊 **Probabilidad:** {prob_ganador:.1%}\n\n"
        
        mensaje += f"📈 **PROBABILIDADES DETALLADAS**\n"
        mensaje += f"• {player1}: {prob_p1:.1%}\n"
        mensaje += f"• {player2}: {prob_p2:.1%}\n"
        
        # Botón para volver a partidos
        keyboard = [
            [InlineKeyboardButton("⬅️ Volver a Partidos", callback_data="ver_partidos")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await loading_msg.edit_text(mensaje, reply_markup=reply_markup, parse_mode='Markdown')


def main():
    """Función principal para ejecutar el bot"""
    

    application = Application.builder().token(BOT_TOKEN).build()
    bot = TennisBot()
    application.add_handler(CommandHandler("start", bot.start))
    application.add_handler(CommandHandler("ayuda", bot.ayuda))
    application.add_handler(CommandHandler("partidos", bot.mostrar_partidos))
    application.add_handler(CallbackQueryHandler(bot.handle_callback))
    application.run_polling()


if __name__ == "__main__":
    main()
