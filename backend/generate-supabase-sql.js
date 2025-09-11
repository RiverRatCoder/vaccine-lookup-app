// Generate SQL files for Supabase import
const fs = require('fs');

function escapeString(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.toString().replace(/'/g, "''")}'`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'NULL';
  return `'${dateStr.split('T')[0]}'`;
}

function formatTimestamp(timestampStr) {
  if (!timestampStr) return 'NOW()';
  return `'${timestampStr}'`;
}

function generateSQL() {
  try {
    console.log('🚀 Generating Supabase SQL import files...');

    // Read exported data
    const vaccines = JSON.parse(fs.readFileSync('./vaccines-export.json', 'utf8'));
    const clinicalTrials = JSON.parse(fs.readFileSync('./clinical-trials-export.json', 'utf8'));
    const adverseEffects = JSON.parse(fs.readFileSync('./adverse-effects-export.json', 'utf8'));

    // Generate vaccines SQL
    let vaccinesSQL = `-- Import Vaccines Data
-- Run this in Supabase SQL Editor

-- Clear existing data (optional)
DELETE FROM adverse_effects;
DELETE FROM clinical_trials;
DELETE FROM vaccines;

-- Reset sequences
ALTER SEQUENCE vaccines_id_seq RESTART WITH 1;
ALTER SEQUENCE clinical_trials_id_seq RESTART WITH 1;
ALTER SEQUENCE adverse_effects_id_seq RESTART WITH 1;

-- Insert vaccines
INSERT INTO vaccines (name, manufacturer, fda_approved_date, childhood_schedule_date, description, fda_url, created_at, updated_at) VALUES
`;

    const vaccineValues = vaccines.map(vaccine => 
      `(${escapeString(vaccine.name)}, ${escapeString(vaccine.manufacturer)}, ${formatDate(vaccine.fda_approved_date)}, ${formatDate(vaccine.childhood_schedule_date)}, ${escapeString(vaccine.description)}, ${escapeString(vaccine.fda_url)}, ${formatTimestamp(vaccine.created_at)}, ${formatTimestamp(vaccine.updated_at)})`
    );

    vaccinesSQL += vaccineValues.join(',\n') + ';\n\n';

    // Generate clinical trials SQL
    let trialsSQL = `-- Insert clinical trials
INSERT INTO clinical_trials (vaccine_id, trial_phase, duration_months, participant_count, age_range_min, age_range_max, start_date, end_date, trial_identifier, description, monitoring_period_days, created_at) VALUES
`;

    const trialValues = clinicalTrials.map(trial => 
      `(${trial.vaccine_id}, ${escapeString(trial.trial_phase)}, ${trial.duration_months || 'NULL'}, ${trial.participant_count || 'NULL'}, ${trial.age_range_min || 'NULL'}, ${trial.age_range_max || 'NULL'}, ${formatDate(trial.start_date)}, ${formatDate(trial.end_date)}, ${escapeString(trial.trial_identifier)}, ${escapeString(trial.description)}, ${trial.monitoring_period_days || 'NULL'}, ${formatTimestamp(trial.created_at)})`
    );

    trialsSQL += trialValues.join(',\n') + ';\n\n';

    // Generate adverse effects SQL
    let effectsSQL = `-- Insert adverse effects
INSERT INTO adverse_effects (vaccine_id, effect_name, severity, occurrence_rate, description, reported_cases, data_source, created_at) VALUES
`;

    const effectValues = adverseEffects.map(effect => 
      `(${effect.vaccine_id}, ${escapeString(effect.effect_name)}, ${escapeString(effect.severity)}, ${effect.occurrence_rate || 'NULL'}, ${escapeString(effect.description)}, ${effect.reported_cases || 'NULL'}, ${escapeString(effect.data_source)}, ${formatTimestamp(effect.created_at)})`
    );

    effectsSQL += effectValues.join(',\n') + ';\n\n';

    // Combine all SQL
    const fullSQL = vaccinesSQL + trialsSQL + effectsSQL + `
-- Verify the import
SELECT 'Import completed successfully!' as status;
SELECT COUNT(*) as vaccine_count FROM vaccines;
SELECT COUNT(*) as trials_count FROM clinical_trials;
SELECT COUNT(*) as effects_count FROM adverse_effects;

-- Show sample data
SELECT name, manufacturer FROM vaccines LIMIT 5;
`;

    fs.writeFileSync('./supabase-import.sql', fullSQL);

    console.log('✅ Generated supabase-import.sql');
    console.log(`📊 Contains ${vaccines.length} vaccines, ${clinicalTrials.length} trials, ${adverseEffects.length} adverse effects`);
    console.log('\n🎯 Next steps:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Click "SQL Editor"');
    console.log('3. Copy and paste the contents of supabase-import.sql');
    console.log('4. Click "Run" to import all data');

  } catch (error) {
    console.error('❌ Error generating SQL:', error);
    process.exit(1);
  }
}

generateSQL();
