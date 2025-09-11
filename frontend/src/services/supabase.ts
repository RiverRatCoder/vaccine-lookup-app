import { createClient } from '@supabase/supabase-js';

// Supabase configuration - CORRECTED URL AND API KEY!
const supabaseUrl = 'https://mvoirgmuqqcgmhewumse.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12b2lyZ211cXFjZ21oZXd1bXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MjA4MzgsImV4cCI6MjA3MzE5NjgzOH0.rD2zASb18xgWEpvo_AHju-uSc_PmBeHVZ3hhIlCdlLQ';

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
