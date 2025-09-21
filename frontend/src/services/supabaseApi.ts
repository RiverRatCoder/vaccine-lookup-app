import { supabase } from './supabase';
import { Vaccine, VaccineDetails, VaccineStats } from '../types/vaccine';

export class SupabaseVaccineAPI {
  // Cache for vaccine details - using localStorage for persistence
  private static CACHE_KEY = 'vaccine_cache';
  private static CACHE_TIMESTAMP_KEY = 'vaccine_cache_timestamp';
  private static CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private static MAX_CACHE_SIZE = 50; // Maximum number of cached vaccines

  // Get cache from localStorage with better error handling
  private static getCache(): Map<number, VaccineDetails> {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return new Map();
      }

      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) {
        return new Map();
      }

      const data = JSON.parse(cached);
      if (!data || typeof data !== 'object') {
        console.warn('Invalid cache data format');
        this.clearCache();
        return new Map();
      }

      const entries: [number, VaccineDetails][] = [];
      Object.entries(data).forEach(([key, value]) => {
        const id = parseInt(key, 10);
        if (!isNaN(id) && value) {
          entries.push([id, value as VaccineDetails]);
        } else if (isNaN(id)) {
          console.warn(`Invalid cache key: ${key}`);
        }
      });
      return new Map(entries);
    } catch (error) {
      console.warn('Error reading cache from localStorage:', error);
      // Clear corrupted cache
      this.clearCache();
      return new Map();
    }
  }

  // Save cache to localStorage with better error handling
  private static saveCache(cache: Map<number, VaccineDetails>): void {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return;
      }

      if (cache.size === 0) {
        return; // Don't save empty cache
      }

      const data = Object.fromEntries(cache);
      const serializedData = JSON.stringify(data);
      
      // Check if data is too large (localStorage limit is ~5MB)
      if (serializedData.length > 4 * 1024 * 1024) { // 4MB threshold
        console.warn('Cache data too large, clearing oldest entries');
        // Keep only the 20 most recent entries
        const entries = Array.from(cache.entries());
        const reducedCache = new Map(entries.slice(-20));
        this.saveCache(reducedCache);
        return;
      }

      localStorage.setItem(this.CACHE_KEY, serializedData);
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing cache');
        this.clearCache();
      } else {
        console.warn('Error saving cache to localStorage:', error);
      }
    }
  }

  // Get cache timestamp
  private static getCacheTimestamp(): number {
    try {
      const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      return timestamp ? parseInt(timestamp) : 0;
    } catch (error) {
      console.warn('Error reading cache timestamp:', error);
      return 0;
    }
  }

  static async getAllVaccines(): Promise<Vaccine[]> {
    try {
      // Get vaccines with only essential fields to reduce payload
      const { data: vaccines, error } = await supabase
        .from('vaccines')
        .select(`
          id,
          name,
          manufacturer,
          fda_approved_date,
          childhood_schedule_date,
          description
        `)
        .order('name');

      if (error) {
        console.error('❌ Supabase Error:', error);
        throw error;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Raw Supabase Response:', vaccines?.length || 0, 'vaccines');
      }

      // Add vaccine_type categorization for list view (no clinical trials/adverse effects needed)
      const vaccinesWithTypes = vaccines?.map((vaccine) => ({
        ...vaccine,
        vaccine_type: this.categorizeVaccine(vaccine.name)
      })) || [];

      // Sort by vaccine type then name (same as PostgreSQL logic)
      return vaccinesWithTypes.sort((a, b) => {
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
      // Check persistent cache first
      const cache = this.getCache();
      const cacheTimestamp = this.getCacheTimestamp();
      const now = Date.now();
      
      if (cache.has(id) && (now - cacheTimestamp) < this.CACHE_DURATION) {
        console.log('✅ Returning cached vaccine details for ID:', id, '(from localStorage)');
        // Return cached data immediately - no await needed
        return Promise.resolve(cache.get(id) || null);
      }

      console.log('🔍 Fetching fresh vaccine details for ID:', id);
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

      const vaccineDetails = {
        ...vaccine,
        vaccine_type: this.categorizeVaccine(vaccine.name),
        clinicalTrials: vaccine.clinical_trials || [],
        adverseEffects: sortedAdverseEffects
      };

      // Save to persistent cache with size management
      cache.set(id, vaccineDetails);
      
      // Manage cache size
      if (cache.size > this.MAX_CACHE_SIZE) {
        // Remove oldest entries (simple LRU by removing first entries)
        const entries = Array.from(cache.entries());
        const reducedEntries = entries.slice(-this.MAX_CACHE_SIZE);
        cache.clear();
        reducedEntries.forEach(([key, value]) => cache.set(key, value));
      }
      
      this.saveCache(cache);

      return vaccineDetails;

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

  // Method to clear cache (useful for development or forced refresh)
  static clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Vaccine cache cleared from localStorage');
      }
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }

  // Method to clear expired entries from cache
  static clearExpiredCache(): void {
    try {
      const timestamp = this.getCacheTimestamp();
      const now = Date.now();
      
      if ((now - timestamp) > this.CACHE_DURATION) {
        this.clearCache();
        if (process.env.NODE_ENV === 'development') {
          console.log('🕒 Expired cache cleared');
        }
      }
    } catch (error) {
      console.warn('Error clearing expired cache:', error);
    }
  }

  // Method to get cache status (useful for debugging)
  static getCacheStatus(): { size: number; ageMinutes: number; isExpired: boolean } {
    const cache = this.getCache();
    const timestamp = this.getCacheTimestamp();
    const now = Date.now();
    const ageMinutes = Math.round((now - timestamp) / (1000 * 60));
    const isExpired = (now - timestamp) > this.CACHE_DURATION;
    
    return {
      size: cache.size,
      ageMinutes,
      isExpired
    };
  }

  // Method to check if specific vaccine is cached (for UI optimization)
  static hasCachedVaccine(id: number): boolean {
    const cache = this.getCache();
    const timestamp = this.getCacheTimestamp();
    const now = Date.now();
    const hasId = cache.has(id);
    const timeDiff = now - timestamp;
    const isExpired = timeDiff > this.CACHE_DURATION;
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Cache check for ID ${id}: has=${hasId}, age=${Math.round(timeDiff/1000/60)}min, expired=${isExpired}`);
    }
    
    return hasId && !isExpired;
  }

  // Method to get cached vaccine synchronously (returns null if not cached)
  static getCachedVaccine(id: number): VaccineDetails | null {
    if (this.hasCachedVaccine(id)) {
      const cache = this.getCache();
      return cache.get(id) || null;
    }
    return null;
  }

}

// For backward compatibility, export the same interface
export const VaccineAPI = SupabaseVaccineAPI;

// Type-safe cache debugging interface
interface VaccineCacheDebug {
  status: () => { size: number; ageMinutes: number; isExpired: boolean };
  hasCached: (id: number) => boolean;
  getCached: (id: number) => VaccineDetails | null;
  clear: () => void;
  help: () => void;
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    VaccineCache?: VaccineCacheDebug;
  }
}

// Make cache debugging available in development
if (process.env.NODE_ENV === 'development') {
  window.VaccineCache = {
    status: () => SupabaseVaccineAPI.getCacheStatus(),
    hasCached: (id: number) => SupabaseVaccineAPI.hasCachedVaccine(id),
    getCached: (id: number) => SupabaseVaccineAPI.getCachedVaccine(id),
    clear: () => SupabaseVaccineAPI.clearCache(),
    help: () => {
      console.log(`
🔧 Vaccine Cache Debug Commands:
- VaccineCache.status() - Check cache size and age
- VaccineCache.hasCached(id) - Check if specific vaccine is cached
- VaccineCache.getCached(id) - Get cached vaccine data
- VaccineCache.clear() - Clear all cached data
- VaccineCache.help() - Show this help
      `);
    }
  };
  console.log('🔧 Vaccine cache debugging available: VaccineCache.help()');
}
