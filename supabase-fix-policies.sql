-- Fix Supabase RLS policies for public access
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily for testing
ALTER TABLE public.vaccines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_trials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.adverse_effects DISABLE ROW LEVEL SECURITY;

-- OR alternatively, update the policies to be more permissive
DROP POLICY IF EXISTS "Allow public read access" ON public.vaccines;
DROP POLICY IF EXISTS "Allow public read access" ON public.clinical_trials;
DROP POLICY IF EXISTS "Allow public read access" ON public.adverse_effects;

-- Create new permissive policies
CREATE POLICY "Enable read access for all users" ON public.vaccines FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.clinical_trials FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.adverse_effects FOR SELECT USING (true);

-- Test query
SELECT 'Policies updated successfully!' as status;
SELECT COUNT(*) as total_vaccines FROM vaccines;
