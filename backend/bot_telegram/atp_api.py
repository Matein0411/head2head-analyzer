import requests
import json
import os
import logging
from typing import Dict, Any, Optional

# Configuración básica de logging para producción: solo INFO y niveles superiores.
# Puedes ajustar el formato o añadir handlers de archivo si es necesario.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Cargar variables de entorno
from dotenv import load_dotenv
load_dotenv()


class ATPInfoAPI:
    """
    Clase para manejar las conexiones con las APIs de ATP.
    Gestiona la obtención de partidos futuros, comparación de jugadores y predicción de resultados.
    """

    def __init__(self):
        """
        Inicializa la clase con las URLs base de las APIs y los mapeos necesarios.
        """
        self.base_url = os.getenv("ATP_BASE_URL")
        self.prediction_url = os.getenv("ATP_PREDICTION_URL")

        # Asegurarse de que las URLs estén configuradas al inicio
        if not self.base_url:
            logging.error("ATP_BASE_URL no está configurada en las variables de entorno.")
            raise ValueError("ATP_BASE_URL no configurada.")
        if not self.prediction_url:
            logging.error("ATP_PREDICTION_URL no está configurada en las variables de entorno.")
            raise ValueError("ATP_PREDICTION_URL no configurada.")

        # Mapeos para traducir los datos de la API de partidos al formato de la API de comparación
        self.tourney_type_mapping = {
            "ATP 250": "A",
            "ATP 500": "M",
            "ATP 1000": "B",
            "Grand Slam": "G",
            "Challenger": "C",
            "Future": "F",
            # Añade más mapeos si tu API de comparación los soporta y son relevantes
        }
        self.surface_mapping = {
            "Grass": "grass",
            "Hard": "hard",
            "Clay": "clay",
            "Carpet": "carpet",
            # Añade más mapeos si tu API de comparación los soporta y son relevantes
        }

    def _make_request(self, method: str, url: str, params: Optional[Dict[str, Any]] = None, 
                      json_data: Optional[Dict[str, Any]] = None, timeout: int = 15) -> Optional[Dict[str, Any]]:
        """
        Método auxiliar genérico para realizar solicitudes HTTP y manejar errores.
        Registra errores críticos de conexión o respuesta.
        """
        try:
            if method == 'GET':
                response = requests.get(url, params=params, timeout=timeout)
            elif method == 'POST':
                headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
                response = requests.post(url, json=json_data, headers=headers, timeout=timeout)
            else:
                logging.error(f"Método HTTP no soportado: {method} para la URL: {url}")
                return None

            response.raise_for_status()  # Lanza una excepción para códigos de estado de error (4xx o 5xx)
            return response.json()
        except requests.exceptions.Timeout:
            logging.error(f"Timeout al conectar con: {url}")
            return None
        except requests.exceptions.ConnectionError:
            logging.error(f"Error de conexión con: {url}")
            return None
        except requests.exceptions.HTTPError as e:
            logging.error(f"Error HTTP {e.response.status_code} al llamar a: {url}. Respuesta: {e.response.text}")
            return None
        except json.JSONDecodeError:
            logging.error(f"Error al decodificar JSON de la respuesta de: {url}. Respuesta recibida: {response.text}")
            return None
        except Exception as e:
            logging.error(f"Error inesperado al realizar la solicitud a {url}: {e}", exc_info=True)
            return None


    def obtener_partidos_futuros(self) -> Optional[Dict[str, Any]]:
        """
        Obtiene los partidos futuros de ATP desde la API principal.
        
        Returns:
            Dict con la información de los partidos futuros o None si hay error.
        """
        endpoint = f"{self.base_url}/players/matches"
        logging.info("Solicitando partidos futuros.")
        return self._make_request('GET', endpoint, timeout=10)
    
    def comparar_jugadores(self, 
                           nombre1: str, 
                           nombre2: str, 
                           surface: Optional[str] = None, 
                           tourney_type: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Compara dos jugadores usando sus nombres exactos y opcionalmente filtrando por superficie y tipo de torneo.
        
        Args:
            nombre1: Nombre exacto del primer jugador.
            nombre2: Nombre exacto del segundo jugador.
            surface: Superficie del partido (e.g., "clay", "hard").
            tourney_type: Tipo de torneo (e.g., "A", "M").
            
        Returns:
            Dict con la comparación detallada entre los jugadores o None si hay error.
        """
        endpoint = f"{self.base_url}/players/compare/{nombre1}/{nombre2}"
        params = {}
        if surface:
            params['surface'] = surface
        if tourney_type:
            params['tourney_type'] = tourney_type
        
        logging.info(f"Solicitando comparación para {nombre1} vs {nombre2}.")
        return self._make_request('GET', endpoint, params=params, timeout=15)
    
    def predecir_resultado(self, datos_comparacion: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Predice el resultado de un partido usando los datos de comparación entre jugadores.
        
        Args:
            datos_comparacion: Diccionario con los datos de comparación.
            
        Returns:
            Dict con la predicción o None si hay error.
        """
        endpoint = f"{self.prediction_url}/api/v1/predict"
        logging.info("Solicitando predicción del modelo.")
        return self._make_request('POST', endpoint, json_data=datos_comparacion, timeout=15)
    
    def obtener_comparacion_desde_partido(self, match_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Obtiene la comparación entre dos jugadores, formateando 'tourney_type' y 'surface'
        para la API de comparación, utilizando los datos de un partido.
        
        Args:
            match_data: Diccionario con la información de un partido.
            
        Returns:
            Dict con la comparación entre los jugadores del partido o None si hay error.
        """
        player1 = match_data.get('player1_name')
        player2 = match_data.get('player2_name')
        
        if not player1 or not player2:
            logging.error("Nombres de jugadores no disponibles en los datos del partido.")
            return None
        
        original_tourney_type = match_data.get('tourney_type')
        original_surface = match_data.get('surface')

        formatted_tourney_type = self.tourney_type_mapping.get(original_tourney_type)
        formatted_surface = self.surface_mapping.get(original_surface)

        # Solo advertir si un mapeo no se encontró y el valor original existía
        if formatted_tourney_type is None and original_tourney_type is not None:
            logging.warning(f"Tipo de torneo '{original_tourney_type}' no mapeado. Se envía nulo a la API de comparación.")
        if formatted_surface is None and original_surface is not None:
            logging.warning(f"Superficie '{original_surface}' no mapeada. Se envía nulo a la API de comparación.")

        return self.comparar_jugadores(player1, player2, 
                                        surface=formatted_surface, 
                                        tourney_type=formatted_tourney_type)
    
    def flujo_completo_partido(self, match_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ejecuta el flujo completo: obtener comparación formateada + predicción para un partido.
        
        Args:
            match_data: Diccionario con la información de un partido (del primer endpoint).
            
        Returns:
            Dict con todos los resultados del flujo completo. Contendrá 'partido', 'comparacion',
            'prediccion' y 'error' si aplica.
        """
        resultado = {
            "partido": match_data,
            "comparacion": None,
            "prediccion": None,
            "error": None
        }
        
        logging.info("Iniciando procesamiento de un flujo de partido.")

        comparacion = self.obtener_comparacion_desde_partido(match_data)
        if not comparacion:
            resultado["error"] = "Fallo al obtener la comparación del partido."
            logging.error(resultado["error"])
            return resultado
        
        resultado["comparacion"] = comparacion
        
        prediccion = self.predecir_resultado(comparacion)
        if not prediccion:
            resultado["error"] = "Fallo al obtener la predicción del partido."
            logging.error(resultado["error"])
            return resultado
        
        resultado["prediccion"] = prediccion
        
        logging.info("Flujo de partido finalizado exitosamente.")
        return resultado


# --- Función de prueba (test_api) ---
def test_api():
    """
    Función para probar las funcionalidades principales de la API con un ejemplo de datos fijo.
    Muestra los datos clave en cada paso para verificación.
    """
    print("\n--- INICIO DE PRUEBAS DE API (Modo de desarrollo con datos fijos) ---\n")
    
    api = ATPInfoAPI()
    
    # Definir un ejemplo de datos de partido fijo para la prueba
    # Esto simula el output de obtener_partidos_futuros para un solo partido.
    primer_partido_data_ejemplo = {
        "snapshot_date": "2025-07-22",
        "player1_name": "Francisco Cerundolo",
        "player2_name": "Damir Dzumhur",
        "tourney_name": "Test Tournament",
        "tourney_type": "ATP 250", # Esto se mapeará a 'A'
        "surface": "Grass"         # Esto se mapeará a 'grass'
    }
    
    print("\n--- DATOS DE PARTIDO FIJOS PARA LA PRUEBA ---\n")
    print(json.dumps(primer_partido_data_ejemplo, indent=2, ensure_ascii=False))
    
    print("\n2. Ejecutando el flujo completo para el partido de prueba...\n")
    print("   (La clase ATPInfoAPI manejará el formateo y las llamadas a las APIs internas)\n")
    
    flujo_completo_resultado = api.flujo_completo_partido(primer_partido_data_ejemplo) 
    
    print("\n--- RESULTADO FINAL DEL FLUJO ---\n")
    if not flujo_completo_resultado.get("error"):
        print("Flujo completo ejecutado exitosamente.")
        print("\nDetalle de la Comparación (enviada al Modelo):\n")
        # Aquí se muestra el JSON que la API de comparación DEBERÍA devolver
        # Asegúrate de que tu API de comparación devuelva los campos como `tourney_type: "A"` y `surface: "grass"`
        print(json.dumps(flujo_completo_resultado.get('comparacion'), indent=2, ensure_ascii=False))
        print("\nDetalle de la Predicción del Modelo:\n")
        print(json.dumps(flujo_completo_resultado.get('prediccion'), indent=2, ensure_ascii=False))
    else:
        print(f"Fallo en el flujo completo: {flujo_completo_resultado['error']}")
        if flujo_completo_resultado.get('comparacion'):
            print("\nÚltima Comparación obtenida (si aplica):\n")
            print(json.dumps(flujo_completo_resultado.get('comparacion'), indent=2, ensure_ascii=False))
    
    print("\n--- FIN DE PRUEBAS ---\n")


# Punto de entrada principal
if __name__ == "__main__":
    # Nivel de logging por defecto en INFO para el script en general.
    # Los 'print' en test_api son para la salida de prueba.
    logging.getLogger().setLevel(logging.INFO)
    test_api()