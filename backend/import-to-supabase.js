// Import all exported PostgreSQL data to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://mvdlrznuguqcgrmhewumse.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZGxyem51Z3VxY2dybWhld3Vtc2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNjA2NzI3MSwiZXhwIjo4MDQxNjM5MjcxfQ.zX2Stbx8gWEpvo_AHjuSe_PmBbHV23hInCdlOt';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importData() {
  try {
    console.log('🚀 Starting Supabase data import...');

    // Read exported data
    console.log('📁 Reading exported files...');
    const vaccines = JSON.parse(fs.readFileSync('./vaccines-export.json', 'utf8'));
    const clinicalTrials = JSON.parse(fs.readFileSync('./clinical-trials-export.json', 'utf8'));
    const adverseEffects = JSON.parse(fs.readFileSync('./adverse-effects-export.json', 'utf8'));

    console.log(`📊 Found ${vaccines.length} vaccines, ${clinicalTrials.length} trials, ${adverseEffects.length} adverse effects`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await supabase.from('adverse_effects').delete().neq('id', 0);
    await supabase.from('clinical_trials').delete().neq('id', 0);
    await supabase.from('vaccines').delete().neq('id', 0);

    // Import vaccines first (they are referenced by other tables)
    console.log('📊 Importing vaccines...');
    
    // Process vaccines in smaller batches to avoid size limits
    const batchSize = 10;
    let vaccineIdMapping = {}; // Map old IDs to new IDs

    for (let i = 0; i < vaccines.length; i += batchSize) {
      const batch = vaccines.slice(i, i + batchSize);
      
      // Remove the id field to let Supabase auto-generate new ones
      const vaccinesForInsert = batch.map(vaccine => {
        const { id, ...vaccineData } = vaccine;
        return vaccineData;
      });

      const { data: insertedVaccines, error: vaccineError } = await supabase
        .from('vaccines')
        .insert(vaccinesForInsert)
        .select('id, name');

      if (vaccineError) {
        console.error('Error inserting vaccines:', vaccineError);
        throw vaccineError;
      }

      // Create mapping from old vaccine names to new IDs
      batch.forEach((originalVaccine, index) => {
        if (insertedVaccines[index]) {
          vaccineIdMapping[originalVaccine.id] = insertedVaccines[index].id;
        }
      });

      console.log(`✅ Imported batch ${Math.floor(i / batchSize) + 1} of vaccines (${insertedVaccines.length} vaccines)`);
    }

    console.log(`✅ Imported all ${vaccines.length} vaccines`);

    // Import clinical trials (update vaccine_id references)
    console.log('🧪 Importing clinical trials...');
    
    const trialsForInsert = clinicalTrials.map(trial => {
      const { id, vaccine_id, ...trialData } = trial;
      return {
        ...trialData,
        vaccine_id: vaccineIdMapping[vaccine_id]
      };
    }).filter(trial => trial.vaccine_id); // Only include trials with valid vaccine references

    for (let i = 0; i < trialsForInsert.length; i += batchSize) {
      const batch = trialsForInsert.slice(i, i + batchSize);
      
      const { error: trialsError } = await supabase
        .from('clinical_trials')
        .insert(batch);

      if (trialsError) {
        console.error('Error inserting clinical trials:', trialsError);
        throw trialsError;
      }

      console.log(`✅ Imported batch ${Math.floor(i / batchSize) + 1} of clinical trials (${batch.length} trials)`);
    }

    console.log(`✅ Imported all ${trialsForInsert.length} clinical trials`);

    // Import adverse effects (update vaccine_id references)
    console.log('⚠️ Importing adverse effects...');
    
    const effectsForInsert = adverseEffects.map(effect => {
      const { id, vaccine_id, ...effectData } = effect;
      return {
        ...effectData,
        vaccine_id: vaccineIdMapping[vaccine_id]
      };
    }).filter(effect => effect.vaccine_id); // Only include effects with valid vaccine references

    for (let i = 0; i < effectsForInsert.length; i += batchSize) {
      const batch = effectsForInsert.slice(i, i + batchSize);
      
      const { error: effectsError } = await supabase
        .from('adverse_effects')
        .insert(batch);

      if (effectsError) {
        console.error('Error inserting adverse effects:', effectsError);
        throw effectsError;
      }

      console.log(`✅ Imported batch ${Math.floor(i / batchSize) + 1} of adverse effects (${batch.length} effects)`);
    }

    console.log(`✅ Imported all ${effectsForInsert.length} adverse effects`);

    // Verify the import
    console.log('\n🔍 Verifying import...');
    const [vaccinesCount, trialsCount, effectsCount] = await Promise.all([
      supabase.from('vaccines').select('*', { count: 'exact', head: true }),
      supabase.from('clinical_trials').select('*', { count: 'exact', head: true }),
      supabase.from('adverse_effects').select('*', { count: 'exact', head: true })
    ]);

    console.log(`📊 Verified: ${vaccinesCount.count} vaccines`);
    console.log(`🧪 Verified: ${trialsCount.count} clinical trials`);
    console.log(`⚠️ Verified: ${effectsCount.count} adverse effects`);

    console.log('\n🎉 Import completed successfully!');
    console.log('🚀 Your Supabase database is now populated with all your vaccine data!');

  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();
