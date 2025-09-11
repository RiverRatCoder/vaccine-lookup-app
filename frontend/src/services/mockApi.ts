import { Vaccine, VaccineDetails, VaccineStats } from '../types/vaccine';

// Mock vaccine data with comprehensive information
const mockVaccines: VaccineDetails[] = [
  {
    id: 1,
    name: 'RECOMBIVAX HB (Hepatitis B Vaccine)',
    manufacturer: 'Merck & Co.',
    fda_approved_date: '1986-07-23',
    childhood_schedule_date: '1991-01-01',
    description: 'Recombinant hepatitis B vaccine for prevention of infection caused by all known subtypes of hepatitis B virus',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/recombivax-hb',
    created_at: '2025-09-11T14:37:28.002Z',
    vaccine_type: 'Hepatitis B',
    clinicalTrials: [
      {
        id: 1,
        trial_phase: 'Phase III',
        duration_months: 12,
        monitoring_period_days: 5,
        participant_count: 147,
        age_range_min: 0,
        age_range_max: 120,
        start_date: '1985-01-01',
        end_date: '1986-01-01',
        trial_identifier: 'RECOMBIVAX-HB-001',
        description: '434 doses of RECOMBIVAX HB, 5 mcg, administered to 147 healthy infants and children (up to 10 years) monitored for 5 days after each dose'
      },
      {
        id: 2,
        trial_phase: 'Phase III',
        duration_months: 18,
        monitoring_period_days: 5,
        participant_count: 1252,
        age_range_min: 132,
        age_range_max: null,
        start_date: '1985-06-01',
        end_date: '1987-01-01',
        trial_identifier: 'RECOMBIVAX-HB-002',
        description: '3258 doses of RECOMBIVAX HB, 10 mcg, administered to 1252 healthy adults monitored for 5 days after each dose'
      }
    ],
    adverseEffects: [
      {
        id: 1,
        effect_name: 'Injection site pain',
        severity: 'Mild',
        occurrence_rate: 17.0,
        description: 'Local pain at injection site (adults)',
        reported_cases: 213,
        data_source: 'clinical_trial'
      },
      {
        id: 2,
        effect_name: 'Fever (≥101°F)',
        severity: 'Mild',
        occurrence_rate: 8.1,
        description: 'Elevated temperature ≥101°F oral equivalent',
        reported_cases: 40,
        data_source: 'clinical_trial'
      },
      {
        id: 3,
        effect_name: 'Irritability',
        severity: 'Mild',
        occurrence_rate: 10.4,
        description: 'Most frequently reported systemic adverse reaction in children',
        reported_cases: 52,
        data_source: 'clinical_trial'
      },
      {
        id: 4,
        effect_name: 'Guillain-Barré syndrome',
        severity: 'Severe',
        occurrence_rate: 0.0008,
        description: 'Autoimmune condition affecting peripheral nervous system',
        reported_cases: 3,
        data_source: 'post_marketing'
      },
      {
        id: 5,
        effect_name: 'Arthritis',
        severity: 'Moderate',
        occurrence_rate: 0.008,
        description: 'Joint inflammation',
        reported_cases: 8,
        data_source: 'post_marketing'
      }
    ]
  },
  {
    id: 2,
    name: 'COVID-19 Vaccine (Pfizer-BioNTech)',
    manufacturer: 'Pfizer-BioNTech',
    fda_approved_date: '2021-08-23',
    childhood_schedule_date: null,
    description: 'mRNA vaccine for prevention of COVID-19 in individuals 12 years and older',
    fda_url: 'https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/comirnaty-and-pfizer-biontech-covid-19-vaccine',
    created_at: '2025-09-11T14:37:28.009Z',
    vaccine_type: 'COVID-19',
    clinicalTrials: [
      {
        id: 3,
        trial_phase: 'Phase III',
        duration_months: 6,
        monitoring_period_days: 28,
        participant_count: 21744,
        age_range_min: 192,
        age_range_max: null,
        start_date: '2020-07-27',
        end_date: '2021-01-27',
        trial_identifier: 'C4591001-2',
        description: 'Pivotal efficacy trial demonstrating 95% efficacy against COVID-19. 21,744 participants received BNT162b2'
      }
    ],
    adverseEffects: [
      {
        id: 6,
        effect_name: 'Injection site pain',
        severity: 'Mild',
        occurrence_rate: 84.1,
        description: 'Local pain at injection site, more common after dose 2',
        reported_cases: 18289,
        data_source: 'clinical_trial'
      },
      {
        id: 7,
        effect_name: 'Fatigue',
        severity: 'Mild',
        occurrence_rate: 62.9,
        description: 'Tiredness, more common after dose 2',
        reported_cases: 13674,
        data_source: 'clinical_trial'
      },
      {
        id: 8,
        effect_name: 'Myocarditis',
        severity: 'Moderate',
        occurrence_rate: 0.005,
        description: 'Inflammation of heart muscle, higher risk in young males',
        reported_cases: 5000,
        data_source: 'post_marketing'
      }
    ]
  },
  {
    id: 3,
    name: 'M-M-R II (MMR Vaccine)',
    manufacturer: 'Merck & Co.',
    fda_approved_date: '1978-03-31',
    childhood_schedule_date: '1978-03-31',
    description: 'Live virus vaccine for measles, mumps, and rubella',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/m-m-r-ii',
    created_at: '2025-09-11T14:37:28.012Z',
    vaccine_type: 'MMR (Measles, Mumps, Rubella)',
    clinicalTrials: [
      {
        id: 4,
        trial_phase: 'Phase III',
        duration_months: 36,
        monitoring_period_days: 42,
        participant_count: 1482,
        age_range_min: 12,
        age_range_max: 15,
        start_date: '1978-03-01',
        end_date: '1981-03-01',
        trial_identifier: 'MMR-001',
        description: 'Pre-licensure efficacy study of M-M-R II in children 12-15 months. Efficacy: Measles 95%, Mumps 96%, Rubella 91%'
      }
    ],
    adverseEffects: [
      {
        id: 9,
        effect_name: 'Injection site pain',
        severity: 'Mild',
        occurrence_rate: 22.4,
        description: 'Local pain and tenderness at injection site',
        reported_cases: 332,
        data_source: 'clinical_trial'
      },
      {
        id: 10,
        effect_name: 'Fever (≥103°F)',
        severity: 'Moderate',
        occurrence_rate: 5.8,
        description: 'Elevated temperature ≥103°F occurring 5-12 days post-vaccination',
        reported_cases: 86,
        data_source: 'clinical_trial'
      },
      {
        id: 11,
        effect_name: 'Febrile seizures',
        severity: 'Moderate',
        occurrence_rate: 0.03,
        description: 'Seizures associated with fever, typically 6-14 days post-vaccination',
        reported_cases: 1653,
        data_source: 'post_marketing'
      }
    ]
  }
];

const mockStats: VaccineStats = {
  totalVaccines: 38,
  totalClinicalTrials: 40,
  totalAdverseEffects: 251,
  recentlyAdded: [
    { name: 'RECOMBIVAX HB (Hepatitis B Vaccine)', created_at: '2025-09-11T17:09:16.160Z' },
    { name: 'COVID-19 Vaccine (Pfizer-BioNTech)', created_at: '2025-09-11T17:20:41.890Z' },
    { name: 'M-M-R II (MMR Vaccine)', created_at: '2025-09-11T17:20:41.850Z' }
  ]
};

export class MockVaccineAPI {
  static async getAllVaccines(): Promise<Vaccine[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockVaccines.map(vaccine => ({
      id: vaccine.id,
      name: vaccine.name,
      manufacturer: vaccine.manufacturer,
      fda_approved_date: vaccine.fda_approved_date,
      childhood_schedule_date: vaccine.childhood_schedule_date,
      description: vaccine.description,
      fda_url: vaccine.fda_url,
      created_at: vaccine.created_at,
      vaccine_type: vaccine.vaccine_type
    }));
  }

  static async getVaccineById(id: number): Promise<VaccineDetails | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockVaccines.find(vaccine => vaccine.id === id) || null;
  }

  static async getVaccineStats(): Promise<VaccineStats> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockStats;
  }
}
