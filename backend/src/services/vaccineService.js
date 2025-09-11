const { query } = require('../config/database');

class VaccineService {
  // Get all vaccines with basic information, grouped by vaccine type
  async getAllVaccines() {
    const result = await query(`
      SELECT 
        id,
        name,
        manufacturer,
        fda_approved_date,
        childhood_schedule_date,
        description,
        created_at,
        CASE 
          WHEN name ILIKE '%hepatitis%b%' OR name ILIKE '%hep%b%' THEN 'Hepatitis B'
          WHEN name ILIKE '%hepatitis%a%' OR name ILIKE '%hep%a%' THEN 'Hepatitis A'
          WHEN name ILIKE '%covid%' OR name ILIKE '%coronavirus%' THEN 'COVID-19'
          WHEN name ILIKE '%influenza%' OR name ILIKE '%flu%' THEN 'Influenza'
          WHEN name ILIKE '%mmr%' OR name ILIKE '%measles%' OR name ILIKE '%mumps%' OR name ILIKE '%rubella%' THEN 'MMR (Measles, Mumps, Rubella)'
          WHEN name ILIKE '%dtap%' OR name ILIKE '%tdap%' OR name ILIKE '%diphtheria%' OR name ILIKE '%tetanus%' OR name ILIKE '%pertussis%' OR name ILIKE '%adacel%' OR name ILIKE '%boostrix%' OR name ILIKE '%tenivac%' THEN 'DTaP/Tdap (Diphtheria, Tetanus, Pertussis)'
          WHEN name ILIKE '%pneumo%' THEN 'Pneumococcal'
          WHEN name ILIKE '%meningococcal%' OR name ILIKE '%meningitis%' THEN 'Meningococcal'
          WHEN name ILIKE '%hpv%' OR name ILIKE '%papillomavirus%' OR name ILIKE '%cervarix%' OR name ILIKE '%gardasil%' THEN 'HPV (Human Papillomavirus)'
          WHEN name ILIKE '%varicella%' OR name ILIKE '%chickenpox%' THEN 'Varicella (Chickenpox)'
          WHEN name ILIKE '%zoster%' OR name ILIKE '%shingles%' THEN 'Zoster (Shingles)'
          WHEN name ILIKE '%rotavirus%' OR name ILIKE '%rota%' THEN 'Rotavirus'
          WHEN name ILIKE '%polio%' OR name ILIKE '%ipv%' THEN 'Polio'
          WHEN name ILIKE '%hib%' OR name ILIKE '%haemophilus%' THEN 'Haemophilus influenzae type b (Hib)'
          WHEN name ILIKE '%rabies%' THEN 'Rabies'
          WHEN name ILIKE '%smallpox%' THEN 'Smallpox'
          ELSE 'Other'
        END as vaccine_type
      FROM vaccines 
      ORDER BY 
        CASE 
          WHEN name ILIKE '%hepatitis%b%' OR name ILIKE '%hep%b%' THEN 1
          WHEN name ILIKE '%covid%' OR name ILIKE '%coronavirus%' THEN 2
          WHEN name ILIKE '%mmr%' OR name ILIKE '%measles%' OR name ILIKE '%mumps%' OR name ILIKE '%rubella%' THEN 3
          WHEN name ILIKE '%dtap%' OR name ILIKE '%tdap%' OR name ILIKE '%diphtheria%' OR name ILIKE '%tetanus%' OR name ILIKE '%pertussis%' OR name ILIKE '%adacel%' OR name ILIKE '%boostrix%' OR name ILIKE '%tenivac%' THEN 4
          WHEN name ILIKE '%influenza%' OR name ILIKE '%flu%' THEN 5
          WHEN name ILIKE '%hpv%' OR name ILIKE '%papillomavirus%' OR name ILIKE '%cervarix%' OR name ILIKE '%gardasil%' THEN 6
          WHEN name ILIKE '%pneumo%' THEN 7
          WHEN name ILIKE '%polio%' OR name ILIKE '%ipv%' THEN 8
          WHEN name ILIKE '%varicella%' OR name ILIKE '%chickenpox%' THEN 9
          WHEN name ILIKE '%hib%' OR name ILIKE '%haemophilus%' THEN 10
          WHEN name ILIKE '%rotavirus%' OR name ILIKE '%rota%' THEN 11
          WHEN name ILIKE '%meningococcal%' OR name ILIKE '%meningitis%' THEN 12
          WHEN name ILIKE '%hepatitis%a%' OR name ILIKE '%hep%a%' THEN 13
          WHEN name ILIKE '%zoster%' OR name ILIKE '%shingles%' THEN 14
          WHEN name ILIKE '%rabies%' THEN 15
          WHEN name ILIKE '%smallpox%' THEN 16
          ELSE 17
        END,
        name ASC
    `);
    return result.rows;
  }

  // Get specific vaccine by ID
  async getVaccineById(id) {
    const result = await query(`
      SELECT 
        id,
        name,
        manufacturer,
        fda_approved_date,
        childhood_schedule_date,
        description,
        fda_url,
        created_at,
        updated_at
      FROM vaccines 
      WHERE id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }

  // Search vaccines by name (case-insensitive)
  async searchVaccines(searchTerm) {
    const result = await query(`
      SELECT 
        id,
        name,
        manufacturer,
        fda_approved_date,
        childhood_schedule_date,
        description
      FROM vaccines 
      WHERE name ILIKE $1 OR manufacturer ILIKE $1 OR description ILIKE $1
      ORDER BY name ASC
    `, [`%${searchTerm}%`]);
    
    return result.rows;
  }

  // Get clinical trials for a specific vaccine
  async getClinicalTrials(vaccineId) {
    const result = await query(`
      SELECT 
        id,
        trial_phase,
        duration_months,
        participant_count,
        age_range_min,
        age_range_max,
        start_date,
        end_date,
        trial_identifier,
        description,
        monitoring_period_days
      FROM clinical_trials 
      WHERE vaccine_id = $1
      ORDER BY start_date DESC
    `, [vaccineId]);
    
    return result.rows;
  }

  // Get adverse effects for a specific vaccine
  async getAdverseEffects(vaccineId) {
    const result = await query(`
      SELECT 
        id,
        effect_name,
        severity,
        occurrence_rate,
        description,
        reported_cases,
        data_source
      FROM adverse_effects 
      WHERE vaccine_id = $1
      ORDER BY data_source ASC, occurrence_rate DESC NULLS LAST, severity ASC
    `, [vaccineId]);
    
    return result.rows;
  }

  // Add or update vaccine information
  async upsertVaccine(vaccineData) {
    const {
      name,
      manufacturer,
      fda_approved_date,
      childhood_schedule_date,
      description,
      fda_url
    } = vaccineData;

    const result = await query(`
      INSERT INTO vaccines (
        name, 
        manufacturer, 
        fda_approved_date, 
        childhood_schedule_date, 
        description, 
        fda_url,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (name) 
      DO UPDATE SET
        manufacturer = EXCLUDED.manufacturer,
        fda_approved_date = EXCLUDED.fda_approved_date,
        childhood_schedule_date = EXCLUDED.childhood_schedule_date,
        description = EXCLUDED.description,
        fda_url = EXCLUDED.fda_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `, [name, manufacturer, fda_approved_date, childhood_schedule_date, description, fda_url]);

    return result.rows[0];
  }

  // Add clinical trial data
  async addClinicalTrial(vaccineId, trialData) {
    const {
      trial_phase,
      duration_months,
      participant_count,
      age_range_min,
      age_range_max,
      start_date,
      end_date,
      trial_identifier,
      description
    } = trialData;

    const result = await query(`
      INSERT INTO clinical_trials (
        vaccine_id,
        trial_phase,
        duration_months,
        participant_count,
        age_range_min,
        age_range_max,
        start_date,
        end_date,
        trial_identifier,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (vaccine_id, trial_identifier) DO NOTHING
      RETURNING id
    `, [vaccineId, trial_phase, duration_months, participant_count, age_range_min, age_range_max, start_date, end_date, trial_identifier, description]);

    return result.rows[0];
  }

  // Add adverse effect data
  async addAdverseEffect(vaccineId, effectData) {
    const {
      effect_name,
      severity,
      occurrence_rate,
      description,
      reported_cases
    } = effectData;

    const result = await query(`
      INSERT INTO adverse_effects (
        vaccine_id,
        effect_name,
        severity,
        occurrence_rate,
        description,
        reported_cases
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (vaccine_id, effect_name) DO UPDATE SET
        severity = EXCLUDED.severity,
        occurrence_rate = EXCLUDED.occurrence_rate,
        description = EXCLUDED.description,
        reported_cases = EXCLUDED.reported_cases
      RETURNING id
    `, [vaccineId, effect_name, severity, occurrence_rate, description, reported_cases]);

    return result.rows[0];
  }

  // Get vaccine statistics
  async getVaccineStats() {
    const [vaccineCount, trialCount, effectCount] = await Promise.all([
      query('SELECT COUNT(*) as count FROM vaccines'),
      query('SELECT COUNT(*) as count FROM clinical_trials'),
      query('SELECT COUNT(*) as count FROM adverse_effects')
    ]);

    const recentlyAdded = await query(`
      SELECT name, created_at 
      FROM vaccines 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    return {
      totalVaccines: parseInt(vaccineCount.rows[0].count),
      totalClinicalTrials: parseInt(trialCount.rows[0].count),
      totalAdverseEffects: parseInt(effectCount.rows[0].count),
      recentlyAdded: recentlyAdded.rows
    };
  }
}

module.exports = new VaccineService();

