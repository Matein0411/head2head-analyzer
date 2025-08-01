
import axios from 'axios';

const PREDICT_API_URL = import.meta.env.VITE_PREDICT_API_URL;

import type { PredictRequest, PredictResponse } from "../types/player";

export const predictApiService = {
  predict: async (data: PredictRequest): Promise<PredictResponse> => {
    const response = await axios.post<{ data: PredictResponse }>(`${PREDICT_API_URL}/api/v1/predict`, data);
    return response.data.data;
  },
};
