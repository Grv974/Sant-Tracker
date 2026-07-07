/**
 * Constantes des algorithmes de prédiction (§4). Centralisées pour calibration.
 * Toutes les valeurs par défaut proviennent du cahier des charges (valeurs normatives).
 */
export const PREDICTION_CONFIG = {
  /** Jours minimum sans flux avant qu'un jour de flux ouvre un nouveau cycle (§4.2). */
  GAP_MIN: 10,
  /** Fenêtre glissante de cycles fermés pour les statistiques (§4.3). */
  N_MAX: 12,
  /** Poids EWMA (§4.3). */
  EWMA_ALPHA: 0.3,
  /** Poids de l'EWMA dans L̂ = w·EWMA + (1−w)·μ (§4.4). */
  EWMA_WEIGHT: 0.6,
  /** σ minimal effectif — une régularité parfaite sans incertitude serait malhonnête (§4.4). */
  SD_MIN: 1,
  /** k de la plage probable (≈68 %) et de la plage élargie (≈90 %) (§4.4). */
  K_PROBABLE: 1,
  K_WIDE: 1.64,
  /** Phase lutéale par défaut et bornes (§4.3). */
  LUTEAL_DEFAULT: 14,
  LUTEAL_MIN: 11,
  LUTEAL_MAX: 16,
  /** Fenêtre fertile : 5 jours avant l'ovulation + 1 jour après (§4.5). */
  FERTILE_BEFORE: 5,
  FERTILE_AFTER: 1,
  /** Seuils d'irrégularité sur σ_L (§4.7). */
  IRREGULAR_SD_MODERATE: 3,
  IRREGULAR_SD_HIGH: 7,
  /** Décalage thermique (§4.6). */
  BBT_BASELINE_DAYS: 6,
  BBT_SHIFT_DAYS: 3,
  BBT_SHIFT_DELTA: 0.2,
  BBT_SHIFT_STRONG: 0.3,
  /** Score de confiance (§4.8). */
  CONFIDENCE: {
    BASE_WEIGHT: 0.5,
    DATA_WEIGHT: 0.4,
    DATA_CYCLES_FULL: 6,
    PENALTY_PCOS: 0.15,
    PENALTY_PERIMENOPAUSE: 0.15,
    PENALTY_POSTPARTUM: 0.2,
    PENALTY_ADOLESCENCE: 0.1,
    PENALTY_PERTURBATION: 0.1,
    PENALTY_CONTRACEPTION_CHANGE: 0.1,
    PENALTY_MAX: 0.4,
    HIGH_THRESHOLD: 0.7,
    MODERATE_THRESHOLD: 0.4,
    /** Plafond en profils très variables (§3.2.7, §3.2.9). */
    CAP_PCOS: 0.6,
    CAP_PERIMENOPAUSE: 0.5,
    /** L'ovulation est intrinsèquement plus incertaine que les règles (§4.5). */
    OVULATION_FACTOR: 0.8,
  },
  /** Anomalies (§4.9). */
  ANOMALY: {
    SHORT_CYCLE_DAYS: 21,
    LONG_CYCLE_DAYS: 45,
    RECURRENT_COUNT: 3,
    AMENORRHEA_DAYS: 90,
    FLOODING_DAYS: 2,
    LONG_PERIOD_DAYS: 7,
    /** Changement récent de contraception : fenêtre de pénalité (jours). */
    CONTRACEPTION_CHANGE_WINDOW: 90,
  },
  /** Projection des prévisions dans le calendrier (§7.6). */
  CALENDAR_FORECAST_CYCLES: 3,
  /** Bornes de validation (§11.4). */
  VALIDATION: {
    BBT_MIN: 34,
    BBT_MAX: 42,
    CYCLE_MIN: 10,
    CYCLE_MAX: 90,
  },
} as const;
