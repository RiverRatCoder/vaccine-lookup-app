// Populate Supabase with vaccine data
// Run this after creating the schema in Supabase SQL Editor

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mvdlrznuguqcgrmhewumse.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZGxyem51Z3VxY2dybWhld3Vtc2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNjA2NzI3MSwiZXhwIjo4MDQxNjM5MjcxfQ.zX2Stbx8gWEpvo_AHjuSe_PmBbHV23hInCdlOt';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Your comprehensive vaccine data
const vaccinesData = [
  // Hepatitis B Vaccines
  {
    name: 'RECOMBIVAX HB (Hepatitis B Vaccine)',
    manufacturer: 'Merck & Co.',
    fda_approved_date: '1986-07-23',
    childhood_schedule_date: '1991-01-01',
    description: 'Recombinant hepatitis B vaccine for prevention of infection caused by all known subtypes of hepatitis B virus',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/recombivax-hb'
  },
  {
    name: 'ENGERIX-B (Hepatitis B Vaccine)',
    manufacturer: 'GlaxoSmithKline',
    fda_approved_date: '1989-09-08',
    childhood_schedule_date: '1991-01-01',
    description: 'Hepatitis B vaccine (recombinant) for immunization against infection caused by all known subtypes of hepatitis B virus',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/engerix-b'
  },
  {
    name: 'Hepatitis B Vaccine',
    manufacturer: 'Dynavax Technologies',
    fda_approved_date: '2017-11-09',
    childhood_schedule_date: null,
    description: 'Hepatitis B vaccine with novel adjuvant for adults',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/heplisav-b'
  },
  {
    name: 'Twinrix (Hepatitis A and B Vaccine)',
    manufacturer: 'GlaxoSmithKline',
    fda_approved_date: '2001-05-12',
    childhood_schedule_date: null,
    description: 'Combined hepatitis A and hepatitis B vaccine',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/twinrix'
  },

  // COVID-19 Vaccines  
  {
    name: 'COVID-19 Vaccine (Pfizer-BioNTech)',
    manufacturer: 'Pfizer-BioNTech',
    fda_approved_date: '2021-08-23',
    childhood_schedule_date: null,
    description: 'mRNA vaccine for prevention of COVID-19 in individuals 12 years and older',
    fda_url: 'https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/comirnaty-and-pfizer-biontech-covid-19-vaccine'
  },
  {
    name: 'COVID-19 Vaccine (Moderna)',
    manufacturer: 'Moderna',
    fda_approved_date: '2022-01-31',
    childhood_schedule_date: null,
    description: 'mRNA vaccine for prevention of COVID-19 in individuals 18 years and older',
    fda_url: 'https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/spikevax-and-moderna-covid-19-vaccine'
  },

  // MMR Vaccine
  {
    name: 'M-M-R II (MMR Vaccine)',
    manufacturer: 'Merck & Co.',
    fda_approved_date: '1978-03-31',
    childhood_schedule_date: '1978-03-31',
    description: 'Live virus vaccine for measles, mumps, and rubella',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/m-m-r-ii'
  },

  // DTaP/Tdap Vaccines
  {
    name: 'PEDIARIX (DTaP-HepB-IPV Vaccine)',
    manufacturer: 'GlaxoSmithKline',
    fda_approved_date: '2002-12-13',
    childhood_schedule_date: '2002-12-13',
    description: 'Combination vaccine containing DTaP, Hepatitis B, and inactivated poliovirus components',
    fda_url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/pediarix'
  }
];

async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');

    // Insert vaccines
    console.log('📊 Inserting vaccines...');
    const { data: vaccines, error: vaccineError } = await supabase
      .from('vaccines')
      .insert(vaccinesData)
      .select();

    if (vaccineError) {
      throw vaccineError;
    }

    console.log(`✅ Inserted ${vaccines.length} vaccines`);

    // Insert clinical trials for RECOMBIVAX HB (should be vaccine ID 1)
    const recombivaxId = vaccines.find(v => v.name.includes('RECOMBIVAX'))?.id;
    if (recombivaxId) {
      console.log('🧪 Adding clinical trials for RECOMBIVAX HB...');
      
      const recombivaxTrials = [
        {
          vaccine_id: recombivaxId,
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
          vaccine_id: recombivaxId,
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
      ];

      const { error: trialsError } = await supabase
        .from('clinical_trials')
        .insert(recombivaxTrials);

      if (trialsError) throw trialsError;
      console.log(`✅ Added ${recombivaxTrials.length} clinical trials for RECOMBIVAX HB`);

      // Add adverse effects for RECOMBIVAX HB
      console.log('⚠️ Adding adverse effects for RECOMBIVAX HB...');
      
      const recombivaxEffects = [
        // Clinical trial effects
        {
          vaccine_id: recombivaxId,
          effect_name: 'Injection site pain',
          severity: 'Mild',
          occurrence_rate: 17.0,
          description: 'Local pain at injection site (adults)',
          reported_cases: 213,
          data_source: 'clinical_trial'
        },
        {
          vaccine_id: recombivaxId,
          effect_name: 'Fever (≥101°F)',
          severity: 'Mild',
          occurrence_rate: 8.1,
          description: 'Elevated temperature ≥101°F oral equivalent',
          reported_cases: 40,
          data_source: 'clinical_trial'
        },
        {
          vaccine_id: recombivaxId,
          effect_name: 'Irritability',
          severity: 'Mild',
          occurrence_rate: 10.4,
          description: 'Most frequently reported systemic adverse reaction in children',
          reported_cases: 52,
          data_source: 'clinical_trial'
        },
        // Post-marketing effects
        {
          vaccine_id: recombivaxId,
          effect_name: 'Guillain-Barré syndrome',
          severity: 'Severe',
          occurrence_rate: 0.0008,
          description: 'Autoimmune condition affecting peripheral nervous system',
          reported_cases: 3,
          data_source: 'post_marketing'
        },
        {
          vaccine_id: recombivaxId,
          effect_name: 'Multiple sclerosis',
          severity: 'Severe',
          occurrence_rate: 0.0005,
          description: 'Demyelinating disease of central nervous system',
          reported_cases: 2,
          data_source: 'post_marketing'
        },
        {
          vaccine_id: recombivaxId,
          effect_name: 'Arthritis',
          severity: 'Moderate',
          occurrence_rate: 0.008,
          description: 'Joint inflammation',
          reported_cases: 8,
          data_source: 'post_marketing'
        }
      ];

      const { error: effectsError } = await supabase
        .from('adverse_effects')
        .insert(recombivaxEffects);

      if (effectsError) throw effectsError;
      console.log(`✅ Added ${recombivaxEffects.length} adverse effects for RECOMBIVAX HB`);
    }

    // Add sample data for other vaccines...
    console.log('🎉 Database population completed successfully!');
    console.log(`📊 Total vaccines: ${vaccines.length}`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase();
