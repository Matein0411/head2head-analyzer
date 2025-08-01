// Interfaces globales para datos de jugador y servicios relacionados

export interface PlayerData {
  name: string;
  country: string;
  countryCode: string;
  rank: number;
  minRank: number;
  age: number;
  height: string;
  hand: string;
  image: string;
}

export interface Player {
  name: string;
  age: number;
  hand: string;
  country: string;
  actual_rank: number;
  min_rank: number;
  height: string;
  image_url: string;
}

export interface SimpleH2HStats {
  p1_h2h_won: number;
  p2_h2h_won: number;
}


export interface PredictRequest {
  p1_age: number;
  p2_age: number;
  p1_ht: number;
  p2_ht: number;
  p1_hand_encoded: number;
  p2_hand_encoded: number;
  p1_rank: number;
  p2_rank: number;
  p1_min_rank: number;
  p2_min_rank: number;
  p1_pct_1stIn: number;
  p2_pct_1stIn: number;
  p1_pct_1stWon: number;
  p2_pct_1stWon: number;
  p1_pct_2ndWon: number;
  p2_pct_2ndWon: number;
  p1_pct_SvPtsWon: number;
  p2_pct_SvPtsWon: number;
  p1_pct_bpConv: number;
  p2_pct_bpConv: number;
  p1_pct_bpSaved: number;
  p2_pct_bpSaved: number;
  p1_pct_1stRetPtsWon: number;
  p2_pct_1stRetPtsWon: number;
  p1_pct_2ndRetPtsWon: number;
  p2_pct_2ndRetPtsWon: number;
  p1_h2h_won: number;
  p2_h2h_won: number;
  p1_recPerf: number;
  p2_recPerf: number;
  p1_surface_wRate: number;
  p2_surface_wRate: number;
  p1_tourney_wRate: number;
  p2_tourney_wRate: number;
}

export interface PredictResponse {
  prediction: number;
  probability_p1_wins: number;
  probability_p2_wins: number;
}

export interface NextMatch {
  date: string;
  player1: string;
  player2: string;
  tournament: string;
  tournamentType: string;
  surface: string;
}