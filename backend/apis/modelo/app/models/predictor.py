import pickle
import numpy as np
import pandas as pd
import xgboost as xgb
from typing import List
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

class XGBoostPredictor:
    """
    Clase para manejar las predicciones del modelo XGBoost
    """
    
    def __init__(self, model_path: str = None, model_reduced_path: str = None):
        self.model = None
        self.model_reduced = None
        self.model_version = "1.0.0"
        self.feature_names = [
            'p1_age', 'p2_age', 'p1_ht', 'p2_ht', 'p1_hand_encoded', 'p2_hand_encoded',
            'p1_rank', 'p2_rank', 'p1_min_rank', 'p2_min_rank',
            'p1_pct_1stIn', 'p2_pct_1stIn', 'p1_pct_1stWon', 'p2_pct_1stWon',
            'p1_pct_2ndWon', 'p2_pct_2ndWon', 'p1_pct_SvPtsWon', 'p2_pct_SvPtsWon',
            'p1_pct_bpConv', 'p2_pct_bpConv', 'p1_pct_bpSaved', 'p2_pct_bpSaved',
            'p1_pct_1stRetPtsWon', 'p2_pct_1stRetPtsWon', 'p1_pct_2ndRetPtsWon', 'p2_pct_2ndRetPtsWon',
            'p1_h2h_won', 'p2_h2h_won', 'p1_recPerf', 'p2_recPerf',
            'p1_surface_wRate', 'p2_surface_wRate', 'p1_tourney_wRate', 'p2_tourney_wRate'
        ]
        
        self.reduced_feature_names = [
            'p1_recPerf', 'p2_recPerf',
            'p1_rank', 'p2_rank',
            'p1_pct_SvPtsWon', 'p2_pct_SvPtsWon',
            'p1_pct_1stRetPtsWon', 'p2_pct_1stRetPtsWon',
            'p1_pct_2ndRetPtsWon', 'p2_pct_2ndRetPtsWon',
            'p1_tourney_wRate', 'p2_tourney_wRate',
            'p1_surface_wRate', 'p2_surface_wRate',
            'p1_pct_1stWon', 'p2_pct_1stWon'
        ]
        
        if model_path:
            self.load_model(model_path)
        if model_reduced_path:
            self.load_model_reduced(model_reduced_path)
    
    def load_model(self, model_path: str) -> bool:
        """
        Carga el modelo XGBoost desde un archivo pickle
        """
        try:
            if not os.path.exists(model_path):
                logger.error(f"Model file not found: {model_path}")
                return False
            
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            logger.info(f"Model loaded successfully from {model_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def load_model_reduced(self, model_path: str) -> bool:
        """
        Carga el modelo XGBoost reducido desde un archivo pickle
        """
        try:
            if not os.path.exists(model_path):
                logger.error(f"Reduced model file not found: {model_path}")
                return False
            
            with open(model_path, 'rb') as f:
                self.model_reduced = pickle.load(f)
            
            logger.info(f"Reduced model loaded successfully from {model_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error loading reduced model: {str(e)}")
            return False
    
    def prepare_features_reduced(self, input_data: dict) -> pd.DataFrame:
        """
        Prepara las características reducidas para la predicción como DataFrame con nombres de columnas
        """
        try:
            # Crear diccionario con las características reducidas en el orden correcto
            features_dict = {}
            for feature_name in self.reduced_feature_names:
                if feature_name in input_data:
                    features_dict[feature_name] = input_data[feature_name]
                else:
                    logger.warning(f"Missing reduced feature: {feature_name}")
                    features_dict[feature_name] = 0.0  # Valor por defecto
            
            # Crear DataFrame con una sola fila y los nombres de columnas correctos
            df = pd.DataFrame([features_dict])
            return df
            
        except Exception as e:
            logger.error(f"Error preparing reduced features: {str(e)}")
            raise ValueError(f"Error preparing reduced features: {str(e)}")

    def predict_reduced(self, input_data: dict) -> dict:
        """
        Realiza la predicción usando solo las características reducidas con el modelo reducido
        """
        if self.model_reduced is None:
            raise ValueError("Reduced model not loaded. Please load a reduced model first.")
        
        try:
            # Preparar características reducidas como DataFrame
            features_df = self.prepare_features_reduced(input_data)
            
            # Convertir DataFrame a DMatrix para XGBoost
            dmatrix = xgb.DMatrix(features_df)
            
            # Realizar predicción usando DMatrix con el modelo reducido
            prediction = self.model_reduced.predict(dmatrix)[0]
            
            # Para las probabilidades, algunos modelos XGBoost necesitan configuración especial
            try:
                prediction_proba = self.model_reduced.predict(dmatrix, output_margin=False)
                if len(prediction_proba.shape) == 1:
                    # Si es clasificación binaria, crear array de probabilidades
                    prob_class_1 = prediction_proba[0]
                    if prob_class_1 > 1:  # Si viene como logits, aplicar sigmoid
                        prob_class_1 = 1 / (1 + np.exp(-prob_class_1))
                    prob_p2_wins = float(prob_class_1)
                    prob_p1_wins = 1.0 - prob_p2_wins
                else:
                    prediction_proba = prediction_proba[0]
                    prob_p1_wins = float(prediction_proba[0])
                    prob_p2_wins = float(prediction_proba[1])
            except:
                # Si no hay predict_proba, usar solo la predicción
                if prediction == 0:
                    prob_p1_wins = 0.7  # Asumimos cierta confianza
                    prob_p2_wins = 0.3
                else:
                    prob_p1_wins = 0.3
                    prob_p2_wins = 0.7
            
            # Calcular confianza (diferencia entre probabilidades)
            confidence = abs(prob_p1_wins - prob_p2_wins)
            
            result = {
                'prediction': int(prediction),
                'probability_p1_wins': prob_p1_wins,
                'probability_p2_wins': prob_p2_wins,
                'confidence': confidence,
                'model_version': self.model_version
            }
            
            logger.info(f"Reduced prediction completed: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error making reduced prediction: {str(e)}")
            raise ValueError(f"Error making reduced prediction: {str(e)}")

    def prepare_features(self, input_data: dict) -> pd.DataFrame:
        """
        Prepara las características para la predicción como DataFrame con nombres de columnas
        """
        try:
            # Crear diccionario con las características en el orden correcto
            features_dict = {}
            for feature_name in self.feature_names:
                if feature_name in input_data:
                    features_dict[feature_name] = input_data[feature_name]
                else:
                    logger.warning(f"Missing feature: {feature_name}")
                    features_dict[feature_name] = 0.0  # Valor por defecto
            
            # Crear DataFrame con una sola fila y los nombres de columnas correctos
            df = pd.DataFrame([features_dict])
            return df
            
        except Exception as e:
            logger.error(f"Error preparing features: {str(e)}")
            raise ValueError(f"Error preparing features: {str(e)}")
    
    def predict(self, input_data: dict) -> dict:
        """
        Realiza la predicción usando el modelo XGBoost
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please load a model first.")
        
        try:
            # Preparar características como DataFrame con nombres de columnas
            features_df = self.prepare_features(input_data)
            
            # Convertir DataFrame a DMatrix para XGBoost
            dmatrix = xgb.DMatrix(features_df)
            
            # Realizar predicción usando DMatrix
            prediction = self.model.predict(dmatrix)[0]
            
            # Para las probabilidades, algunos modelos XGBoost necesitan configuración especial
            try:
                prediction_proba = self.model.predict(dmatrix, output_margin=False)
                if len(prediction_proba.shape) == 1:
                    # Si es clasificación binaria, crear array de probabilidades
                    prob_class_1 = prediction_proba[0]
                    if prob_class_1 > 1:  # Si viene como logits, aplicar sigmoid
                        prob_class_1 = 1 / (1 + np.exp(-prob_class_1))
                    prob_p2_wins = float(prob_class_1)
                    prob_p1_wins = 1.0 - prob_p2_wins
                else:
                    prediction_proba = prediction_proba[0]
                    prob_p1_wins = float(prediction_proba[0])
                    prob_p2_wins = float(prediction_proba[1])
            except:
                # Si no hay predict_proba, usar solo la predicción
                if prediction == 0:
                    prob_p1_wins = 0.7  # Asumimos cierta confianza
                    prob_p2_wins = 0.3
                else:
                    prob_p1_wins = 0.3
                    prob_p2_wins = 0.7
            
            # Calcular confianza (diferencia entre probabilidades)
            confidence = abs(prob_p1_wins - prob_p2_wins)
            
            result = {
                'prediction': int(prediction),
                'probability_p1_wins': prob_p1_wins,
                'probability_p2_wins': prob_p2_wins,
                'confidence': confidence,
                'model_version': self.model_version
            }
            
            logger.info(f"Prediction completed: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            raise ValueError(f"Error making prediction: {str(e)}")
    
    def is_model_loaded(self) -> bool:
        """
        Verifica si el modelo está cargado
        """
        return self.model is not None
    
    def is_model_reduced_loaded(self) -> bool:
        """
        Verifica si el modelo reducido está cargado
        """
        return self.model_reduced is not None
    
    def get_feature_names(self) -> List[str]:
        """
        Retorna los nombres de las características esperadas
        """
        return self.feature_names.copy()

# Instancia global del predictor
predictor = XGBoostPredictor()

def get_predictor() -> XGBoostPredictor:
    """
    Factory function para obtener la instancia del predictor
    """
    return predictor
