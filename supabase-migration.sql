-- Supabase Migration Script for Vaccine Lookup App
-- Run this in Supabase SQL Editor after project setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vaccines table
CREATE TABLE public.vaccines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    fda_approved_date DATE,
    childhood_schedule_date DATE,
    description TEXT,
    fda_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinical_trials table
CREATE TABLE public.clinical_trials (
    id SERIAL PRIMARY KEY,
    vaccine_id INTEGER REFERENCES public.vaccines(id) ON DELETE CASCADE,
    trial_phase VARCHAR(50),
    duration_months INTEGER,
    participant_count INTEGER,
    age_range_min INTEGER, -- Age in months
    age_range_max INTEGER, -- Age in months
    start_date DATE,
    end_date DATE,
    trial_identifier VARCHAR(100),
    description TEXT,
    monitoring_period_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create adverse_effects table
CREATE TABLE public.adverse_effects (
    id SERIAL PRIMARY KEY,
    vaccine_id INTEGER REFERENCES public.vaccines(id) ON DELETE CASCADE,
    effect_name VARCHAR(255) NOT NULL,
    severity VARCHAR(50),
    occurrence_rate NUMERIC(5,2), -- Percentage with 2 decimal places
    description TEXT,
    reported_cases INTEGER,
    data_source VARCHAR(50), -- 'clinical_trial' or 'post_marketing'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_clinical_trials_vaccine_id ON public.clinical_trials(vaccine_id);
CREATE INDEX idx_adverse_effects_vaccine_id ON public.adverse_effects(vaccine_id);
CREATE INDEX idx_adverse_effects_data_source ON public.adverse_effects(data_source);
CREATE INDEX idx_vaccines_name ON public.vaccines(name);
CREATE INDEX idx_vaccines_manufacturer ON public.vaccines(manufacturer);

-- Enable Row Level Security (optional - can be configured later)
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adverse_effects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON public.vaccines FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.clinical_trials FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.adverse_effects FOR SELECT USING (true);

-- Add updated_at trigger for vaccines table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vaccines_updated_at 
    BEFORE UPDATE ON public.vaccines 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Supabase schema created successfully! Ready for data insertion.' as status;
