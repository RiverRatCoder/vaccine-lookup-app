import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (matching our schema)
export interface Database {
  public: {
    Tables: {
      vaccines: {
        Row: {
          id: number;
          name: string;
          manufacturer: string;
          fda_approved_date: string | null;
          childhood_schedule_date: string | null;
          description: string | null;
          fda_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          manufacturer: string;
          fda_approved_date?: string | null;
          childhood_schedule_date?: string | null;
          description?: string | null;
          fda_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          manufacturer?: string;
          fda_approved_date?: string | null;
          childhood_schedule_date?: string | null;
          description?: string | null;
          fda_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clinical_trials: {
        Row: {
          id: number;
          vaccine_id: number;
          trial_phase: string | null;
          duration_months: number | null;
          participant_count: number | null;
          age_range_min: number | null;
          age_range_max: number | null;
          start_date: string | null;
          end_date: string | null;
          trial_identifier: string | null;
          description: string | null;
          monitoring_period_days: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          vaccine_id: number;
          trial_phase?: string | null;
          duration_months?: number | null;
          participant_count?: number | null;
          age_range_min?: number | null;
          age_range_max?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          trial_identifier?: string | null;
          description?: string | null;
          monitoring_period_days?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          vaccine_id?: number;
          trial_phase?: string | null;
          duration_months?: number | null;
          participant_count?: number | null;
          age_range_min?: number | null;
          age_range_max?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          trial_identifier?: string | null;
          description?: string | null;
          monitoring_period_days?: number | null;
          created_at?: string;
        };
      };
      adverse_effects: {
        Row: {
          id: number;
          vaccine_id: number;
          effect_name: string;
          severity: string | null;
          occurrence_rate: number | null;
          description: string | null;
          reported_cases: number | null;
          data_source: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          vaccine_id: number;
          effect_name: string;
          severity?: string | null;
          occurrence_rate?: number | null;
          description?: string | null;
          reported_cases?: number | null;
          data_source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          vaccine_id?: number;
          effect_name?: string;
          severity?: string | null;
          occurrence_rate?: number | null;
          description?: string | null;
          reported_cases?: number | null;
          data_source?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
