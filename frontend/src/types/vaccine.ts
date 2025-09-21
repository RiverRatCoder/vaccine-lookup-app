export interface Vaccine {
  id: number;
  name: string;
  manufacturer: string;
  fda_approved_date: string | null;
  childhood_schedule_date: string | null;
  description: string;
  fda_url?: string;
  created_at?: string;
  updated_at?: string;
  vaccine_type?: string;
}

export interface VaccineDetails extends Vaccine {
  clinicalTrials: ClinicalTrial[];
  adverseEffects: AdverseEffect[];
}

export interface ClinicalTrial {
  id: number;
  trial_phase: string;
  duration_months: number | null;
  participant_count: number | null;
  age_range_min: number | null;
  age_range_max: number | null;
  start_date: string | null;
  end_date: string | null;
  trial_identifier: string | null;
  description: string | null;
  monitoring_period_days?: number | null;
}

export interface AdverseEffect {
  id: number;
  effect_name: string;
  severity: string;
  occurrence_rate: number | null;
  description: string | null;
  reported_cases: number | null;
  data_source?: string;
}

export interface VaccineStats {
  totalVaccines: number;
  totalClinicalTrials: number;
  totalAdverseEffects: number;
  recentlyAdded: Array<{
    name: string;
    created_at: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  message?: string;
}

export interface VaccineSearchState {
  vaccines: Vaccine[];
  selectedVaccine: VaccineDetails | null;
  loading: boolean;
  error: string | null;
  stats: VaccineStats | null;
}

