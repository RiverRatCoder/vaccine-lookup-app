// Export all data from PostgreSQL to JSON files for Supabase import
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'akwalling',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vaccine_lookup',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function exportData() {
  try {
    console.log('🚀 Starting PostgreSQL data export...');

    // Export vaccines
    console.log('📊 Exporting vaccines...');
    const vaccinesResult = await pool.query(`
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
      ORDER BY id
    `);
    
    const vaccines = vaccinesResult.rows;
    fs.writeFileSync('./vaccines-export.json', JSON.stringify(vaccines, null, 2));
    console.log(`✅ Exported ${vaccines.length} vaccines`);

    // Export clinical trials
    console.log('🧪 Exporting clinical trials...');
    const trialsResult = await pool.query(`
      SELECT 
        id,
        vaccine_id,
        trial_phase,
        duration_months,
        participant_count,
        age_range_min,
        age_range_max,
        start_date,
        end_date,
        trial_identifier,
        description,
        monitoring_period_days,
        created_at
      FROM clinical_trials 
      ORDER BY vaccine_id, id
    `);
    
    const trials = trialsResult.rows;
    fs.writeFileSync('./clinical-trials-export.json', JSON.stringify(trials, null, 2));
    console.log(`✅ Exported ${trials.length} clinical trials`);

    // Export adverse effects
    console.log('⚠️ Exporting adverse effects...');
    const effectsResult = await pool.query(`
      SELECT 
        id,
        vaccine_id,
        effect_name,
        severity,
        occurrence_rate,
        description,
        reported_cases,
        data_source,
        created_at
      FROM adverse_effects 
      ORDER BY vaccine_id, data_source, occurrence_rate DESC
    `);
    
    const effects = effectsResult.rows;
    fs.writeFileSync('./adverse-effects-export.json', JSON.stringify(effects, null, 2));
    console.log(`✅ Exported ${effects.length} adverse effects`);

    // Create summary
    const summary = {
      export_timestamp: new Date().toISOString(),
      total_vaccines: vaccines.length,
      total_clinical_trials: trials.length,
      total_adverse_effects: effects.length,
      vaccines_by_manufacturer: vaccines.reduce((acc, v) => {
        acc[v.manufacturer] = (acc[v.manufacturer] || 0) + 1;
        return acc;
      }, {}),
      trials_by_phase: trials.reduce((acc, t) => {
        acc[t.trial_phase || 'Unknown'] = (acc[t.trial_phase || 'Unknown'] || 0) + 1;
        return acc;
      }, {}),
      effects_by_source: effects.reduce((acc, e) => {
        acc[e.data_source || 'Unknown'] = (acc[e.data_source || 'Unknown'] || 0) + 1;
        return acc;
      }, {})
    };

    fs.writeFileSync('./export-summary.json', JSON.stringify(summary, null, 2));

    console.log('\n📋 Export Summary:');
    console.log(`📊 Vaccines: ${summary.total_vaccines}`);
    console.log(`🧪 Clinical Trials: ${summary.total_clinical_trials}`);
    console.log(`⚠️ Adverse Effects: ${summary.total_adverse_effects}`);
    console.log('\n📁 Files created:');
    console.log('  - vaccines-export.json');
    console.log('  - clinical-trials-export.json');
    console.log('  - adverse-effects-export.json');
    console.log('  - export-summary.json');
    
    console.log('\n🎉 Export completed successfully!');

  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

exportData();
