import { supabase } from './supabase';
import { Vaccine, VaccineDetails, VaccineStats } from '../types/vaccine';

export class SupabaseVaccineAPI {
  static async getAllVaccines(): Promise<Vaccine[]> {
    try {
      // Debug logging
      console.log('🔍 Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      console.log('🔍 API Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);
      
      // Get vaccines with vaccine_type calculation
      const { data: vaccines, error } = await supabase
        .from('vaccines')
        .select(`
          *,
          clinical_trials(*),
          adverse_effects(*)
        `)
        .order('name');

      if (error) {
        console.error('❌ Supabase Error:', error);
        throw error;
      }
      
      console.log('✅ Raw Supabase Response:', vaccines?.length || 0, 'vaccines');

      // Add vaccine_type categorization (same logic as before)
      const vaccinesWithTypes = vaccines?.map((vaccine: any) => ({
        ...vaccine,
        vaccine_type: this.categorizeVaccine(vaccine.name),
        clinicalTrials: vaccine.clinical_trials || [],
        adverseEffects: vaccine.adverse_effects || []
      })) || [];

      // Sort by vaccine type then name (same as PostgreSQL logic)
      return vaccinesWithTypes.sort((a: any, b: any) => {
        const aOrder = this.getVaccineTypeOrder(a.vaccine_type);
        const bOrder = this.getVaccineTypeOrder(b.vaccine_type);
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        return a.name.localeCompare(b.name);
      });

    } catch (error) {
      console.error('Error fetching vaccines:', error);
      throw new Error('Failed to fetch vaccines');
    }
  }

  static async getVaccineById(id: number): Promise<VaccineDetails | null> {
    try {
      const { data: vaccine, error } = await supabase
        .from('vaccines')
        .select(`
          *,
          clinical_trials(*),
          adverse_effects(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      // Sort adverse effects by severity (most severe first) then alphabetically
      const sortedAdverseEffects = (vaccine.adverse_effects || []).sort((a: any, b: any) => {
        // Define severity order (most severe first)
        const severityOrder: { [key: string]: number } = {
          'severe': 1,
          'serious': 2, 
          'moderate': 3,
          'mild': 4,
          'local': 5,
          'systemic': 6
        };

        const aSeverity = severityOrder[a.severity?.toLowerCase()] || 999;
        const bSeverity = severityOrder[b.severity?.toLowerCase()] || 999;

        // First sort by severity
        if (aSeverity !== bSeverity) {
          return aSeverity - bSeverity;
        }

        // Then sort alphabetically by effect name
        return a.effect_name.localeCompare(b.effect_name);
      });

      return {
        ...vaccine,
        vaccine_type: this.categorizeVaccine(vaccine.name),
        clinicalTrials: vaccine.clinical_trials || [],
        adverseEffects: sortedAdverseEffects
      };

    } catch (error) {
      console.error('Error fetching vaccine:', error);
      throw new Error('Failed to fetch vaccine details');
    }
  }

  static async getVaccineStats(): Promise<VaccineStats> {
    try {
      // Get counts from each table
      const [vaccinesResult, trialsResult, effectsResult] = await Promise.all([
        supabase.from('vaccines').select('*', { count: 'exact', head: true }),
        supabase.from('clinical_trials').select('*', { count: 'exact', head: true }),
        supabase.from('adverse_effects').select('*', { count: 'exact', head: true })
      ]);

      // Get recent vaccines
      const { data: recentVaccines } = await supabase
        .from('vaccines')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalVaccines: vaccinesResult.count || 0,
        totalClinicalTrials: trialsResult.count || 0,
        totalAdverseEffects: effectsResult.count || 0,
        recentlyAdded: recentVaccines || []
      };

    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch statistics');
    }
  }

  // Helper method to categorize vaccines (same logic as PostgreSQL CASE statement)
  private static categorizeVaccine(name: string): string {
    const lowerName = name.toLowerCase();
    
    if ((lowerName.includes('hepatitis') && lowerName.includes('b')) || (lowerName.includes('hep') && lowerName.includes('b'))) {
      return 'Hepatitis B';
    }
    if ((lowerName.includes('hepatitis') && lowerName.includes('a')) || (lowerName.includes('hep') && lowerName.includes('a'))) {
      return 'Hepatitis A';
    }
    if (lowerName.includes('covid') || lowerName.includes('coronavirus')) {
      return 'COVID-19';
    }
    if (lowerName.includes('influenza') || lowerName.includes('flu')) {
      return 'Influenza';
    }
    if (lowerName.includes('mmr') || lowerName.includes('measles') || lowerName.includes('mumps') || lowerName.includes('rubella')) {
      return 'MMR (Measles, Mumps, Rubella)';
    }
    if (lowerName.includes('dtap') || lowerName.includes('tdap') || lowerName.includes('diphtheria') || 
        lowerName.includes('tetanus') || lowerName.includes('pertussis') || lowerName.includes('adacel') || 
        lowerName.includes('boostrix') || lowerName.includes('tenivac')) {
      return 'DTaP/Tdap (Diphtheria, Tetanus, Pertussis)';
    }
    if (lowerName.includes('pneumo')) {
      return 'Pneumococcal';
    }
    if (lowerName.includes('meningococcal') || lowerName.includes('meningitis')) {
      return 'Meningococcal';
    }
    if (lowerName.includes('hpv') || lowerName.includes('papillomavirus') || lowerName.includes('cervarix') || lowerName.includes('gardasil')) {
      return 'HPV (Human Papillomavirus)';
    }
    if (lowerName.includes('varicella') || lowerName.includes('chickenpox')) {
      return 'Varicella (Chickenpox)';
    }
    if (lowerName.includes('zoster') || lowerName.includes('shingles')) {
      return 'Zoster (Shingles)';
    }
    if (lowerName.includes('rotavirus') || lowerName.includes('rota')) {
      return 'Rotavirus';
    }
    if (lowerName.includes('polio') || lowerName.includes('ipv')) {
      return 'Polio';
    }
    if (lowerName.includes('hib') || lowerName.includes('haemophilus')) {
      return 'Haemophilus influenzae type b (Hib)';
    }
    if (lowerName.includes('rabies')) {
      return 'Rabies';
    }
    if (lowerName.includes('smallpox')) {
      return 'Smallpox';
    }
    
    return 'Other';
  }

  // Helper method to get vaccine type order (same as PostgreSQL CASE statement)
  private static getVaccineTypeOrder(vaccineType: string): number {
    switch (vaccineType) {
      case 'Hepatitis B': return 1;
      case 'COVID-19': return 2;
      case 'MMR (Measles, Mumps, Rubella)': return 3;
      case 'DTaP/Tdap (Diphtheria, Tetanus, Pertussis)': return 4;
      case 'Influenza': return 5;
      case 'HPV (Human Papillomavirus)': return 6;
      case 'Pneumococcal': return 7;
      case 'Polio': return 8;
      case 'Varicella (Chickenpox)': return 9;
      case 'Haemophilus influenzae type b (Hib)': return 10;
      case 'Rotavirus': return 11;
      case 'Meningococcal': return 12;
      case 'Hepatitis A': return 13;
      case 'Zoster (Shingles)': return 14;
      case 'Rabies': return 15;
      case 'Smallpox': return 16;
      default: return 17;
    }
  }
}

// For backward compatibility, export the same interface
export const VaccineAPI = SupabaseVaccineAPI;
