# app/routers/atp_scraper_router.py
from fastapi import APIRouter, Response, status
from fastapi.responses import JSONResponse
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

import undetected_chromedriver as uc
from undetected_chromedriver import ChromeOptions

import time

from bs4 import BeautifulSoup

from typing import List
from app.schemas.atp_schemas import TournamentResult, Match
import os # <<< SOLUCIÓN: Importar os para manejar rutas de archivos
import tempfile # <<< SOLUCIÓN: Para crear un directorio de perfil temporal estándar

router = APIRouter()

# --- Parte 1: Función para scrapear partidos incompletos de un draw específico (CORREGIDA) ---
def scrape_single_draw_for_incomplete_matches(driver: uc.Chrome, draw_url: str) -> List[Match]:
    driver.get(draw_url)
    
    current_tournament_incomplete_matches = []

    try:
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "atp-draw-container"))
        )
        print(f"  Página del draw cargada: {draw_url}")

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        html_content = driver.page_source
        soup = BeautifulSoup(html_content, 'html.parser')

        draw_items = soup.find_all('div', class_='draw-item')

        for item in draw_items:
            # --- ¡CORRECCIÓN AQUÍ! Mover la definición de player_name_divs arriba ---
            player_name_divs = item.find_all('div', class_='name') # <--- ¡AHORA SE DEFINE SIEMPRE!
            # --- FIN CORRECCIÓN ---

            stats_cta_div = item.find('div', class_='stats-cta')
            player_info_divs = item.find_all('div', class_='player-info') 

            has_winner_div = False
            for player_info in player_info_divs:
                if player_info.find('div', class_='winner'):
                    has_winner_div = True
                    break 
            
            if not has_winner_div: 
                # ... (el resto de la lógica de extracción de nombres, ya garantizado que player_name_divs existe) ...
                def derive_name_from_link(link_tag) -> str:
                    if link_tag and 'href' in link_tag.attrs:
                        href_parts = link_tag['href'].split('/')
                        slug_name = ""
                        for part in reversed(href_parts):
                            if len(part) > 3 and '-' in part:
                                slug_name = part
                                break
                        
                        if not slug_name:
                             slug_name = link_tag.get_text(strip=True)
                             if '.' in slug_name:
                                return slug_name

                        if slug_name.upper() == 'TBA' or slug_name.upper().startswith('QUALIFIER') or slug_name.upper().startswith('LUCKY-LOSER'):
                            return slug_name.upper()
                        
                        return ' '.join([word.capitalize() for word in slug_name.split('-')])
                    
                    return ""
                
                player1_name = derive_name_from_link(player_name_divs[0].find('a')) if len(player_name_divs) > 0 else ""
                player2_name = derive_name_from_link(player_name_divs[1].find('a')) if len(player_name_divs) > 1 else ""

                if len(player_name_divs) == 1:
                    player2_name = "(Oponente desconocido/BYE)"
                elif len(player_name_divs) == 0:
                    continue

                if player1_name.upper() == 'TBA' or player2_name.upper() == 'TBA' or "(Oponente desconocido/BYE)" in player1_name or "(Oponente desconocido/BYE)" in player2_name:
                    continue

                if player1_name and player2_name:
                    current_tournament_incomplete_matches.append(Match(player1=player1_name, player2=player2_name))

    except Exception as e:
        print(f"  Ocurrió un error al scrapear el draw {draw_url}: {e}")
    finally:
        pass
    
    return current_tournament_incomplete_matches

def get_tournament_surface(driver: uc.Chrome, overview_url: str) -> str:
    driver.get(overview_url)
    surface = "Desconocida"

    try:
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "tourn_details"))
        )

        html_content = driver.page_source
        soup = BeautifulSoup(html_content, 'html.parser')

        tourn_details_div = soup.find('div', class_='tourn_details')
        if tourn_details_div:
            surface_label_span = tourn_details_div.find('span', string='Surface')
            
            if surface_label_span:
                surface_value_span = surface_label_span.find_next_sibling('span')
                if surface_value_span:
                    surface = surface_value_span.get_text(strip=True)

    except Exception as e:
        print(f"  Ocurrió un error al obtener la superficie de {overview_url}: {e}")
    
    return surface

# --- Función principal de scraping que será llamada por la API ---
async def perform_full_scraping() -> List[TournamentResult]:
    chrome_options = ChromeOptions() 
     # --- INICIO DE LA SOLUCIÓN ---
    # 1. Usar un directorio de perfil en la carpeta del proyecto. Es más estable.
    #    Esto creará una carpeta llamada 'uc_profile_atp' donde ejecutes el script.
    profile_path = os.path.join(os.getcwd(), "uc_profile_atp")
    
    if not os.path.exists(profile_path):
        os.makedirs(profile_path)
    
    chrome_options.add_argument(f"--user-data-dir={profile_path}")

    chrome_options.add_argument("--lang=en-US")
    chrome_options.add_argument("--accept-lang=en-US,en")
    
    driver = uc.Chrome(options=chrome_options, headless=True)
    
    base_url = "https://www.atptour.com/en/scores/current"

    all_tournaments_data = []

    category_map = {
        '_gs.png': 'Grand Slam',
        '_ms1000.png': 'ATP Masters 1000',
        '_500.png': 'ATP 500',
        '_250.png': 'ATP 250',
        '_atpfinals.png': 'ATP Finals',
        '_nextgen.png': 'Next Gen ATP Finals',
        '_unitedcup.png': 'United Cup',
        '_challenger.png': 'ATP Challenger Tour',
        '_atpcup.png': 'ATP Cup',
    }
    
    start_time = time.perf_counter()

    print(f"Navegando a la página principal de scores: {base_url}")
    driver.get(base_url)

    try:
        print(" Buscando el banner de cookies...")
        # Esperamos a que el botón "Accept All Cookies" sea clickeable.
        # 'onetrust-accept-btn-handler' es el ID estándar para este tipo de banners.
        accept_cookies_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "onetrust-accept-btn-handler"))
        )
        accept_cookies_button.click()
        print(" Banner de cookies aceptado.")
        time.sleep(2) # Damos un respiro para que la página recargue su contenido.
    except TimeoutException:
        # Si el botón no aparece en 10 segundos, asumimos que ya fue aceptado.
        print("ℹ Banner de cookies no encontrado o ya aceptado, continuando...")
    # <<< FIN DE LA NUEVA SOLUCIÓN >>>


    try:
        WebDriverWait(driver, 20).until( 
            EC.presence_of_element_located((By.CLASS_NAME, "tournament--expanded"))
        )
        print("Torneos en la página principal detectados.")

    except TimeoutException:
        print("  FALLO CRÍTICO: No se detectaron los elementos de torneos en la página principal dentro del tiempo de espera.")
        print("  Esto podría deberse a un CAPTCHA, un bloqueo, o un cambio en la estructura del sitio.")
        driver.save_screenshot("error_screenshot.png")
        driver.quit()
        raise Exception("No se pudieron cargar los torneos de la página principal.")
    except Exception as e:
        print(f"  Error durante la carga de la página principal: {e}")
        driver.save_screenshot("error_screenshot2.png")  # Captura de pantalla para depuración
        driver.quit()
        raise

    html_content = driver.page_source
    soup = BeautifulSoup(html_content, 'html.parser')

    tournament_blocks = soup.find_all('div', class_='tournament--expanded')
    
    if not tournament_blocks:
        print("No se encontraron bloques de torneos expandidos en la página principal.")
        driver.quit()
        return []

    for block in tournament_blocks:
        tournament_info = {}

        tournament_name_tag = block.find('h3', class_='title')
        tournament_name = tournament_name_tag.get_text(strip=True) if tournament_name_tag else "Nombre Desconocido"
        tournament_info['tournament_name'] = tournament_name

        tournament_category = "Categoría Desconocida"
        badge_div = block.find('div', class_='badge')
        if badge_div:
            category_img = badge_div.find('img')
            if category_img and 'src' in category_img.attrs:
                img_src = category_img['src']
                for suffix, category_name in category_map.items():
                    if suffix in img_src:
                        tournament_category = category_name
                        break
        tournament_info['category'] = tournament_category

        overview_link_tag = tournament_name_tag.find('a') if tournament_name_tag else None
        if overview_link_tag and 'href' in overview_link_tag.attrs:
            tournament_info['overview_url'] = "https://www.atptour.com" + overview_link_tag['href']
        else:
            tournament_info['overview_url'] = None

        draw_link_tag = block.find('a', class_='atp_button', string='Draw')
        if draw_link_tag and 'href' in draw_link_tag.attrs:
            tournament_info['draw_url'] = "https://www.atptour.com" + draw_link_tag['href']
        else:
            tournament_info['draw_url'] = None
        
        all_tournaments_data.append(tournament_info)

    print("\n--- Procesando detalles de los Torneos ---")
    final_results = []
    for data in all_tournaments_data:
        current_tournament_result = {
            "tournament_name": data['tournament_name'],
            "category": data['category'],
            "surface": "No disponible",
            "incomplete_matches": []
        }
        
        print(f"\nProcesando torneo: {data['tournament_name']}")
        
        if data['overview_url']:
            current_tournament_result['surface'] = get_tournament_surface(driver, data['overview_url'])
        
        if data['draw_url']:
            current_tournament_result['incomplete_matches'] = scrape_single_draw_for_incomplete_matches(driver, data['draw_url'])
        
        final_results.append(TournamentResult(**current_tournament_result))
    
    driver.quit()
    
    end_time = time.perf_counter()
    duration = end_time - start_time
    print(f"\n--- Scraping Completado ---")
    print(f"Tiempo total de ejecución del scraping: {duration:.2f} segundos.")

    return final_results

# --- Endpoint de la API ---
@router.get("/atp_matches", response_model=List[TournamentResult])
async def get_atp_matches(response: Response):
    """
    Endpoint para obtener información de torneos ATP actuales:
    categoría, superficie y partidos no completados (excluyendo TBAs).
    Los nombres de los jugadores son nombres derivados de sus URLs.
    """
    print("API endpoint /atp_matches fue llamado.")
    try:
        data = await perform_full_scraping()
        if not data:
            response.status_code = status.HTTP_204_NO_CONTENT
            return {"message": "No se encontraron datos de partidos incompletos para los torneos actuales."}
        return data
    except Exception as e:
        print(f"Error en el endpoint /atp_matches: {e}")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Ocurrió un error al procesar la solicitud", "details": str(e)}