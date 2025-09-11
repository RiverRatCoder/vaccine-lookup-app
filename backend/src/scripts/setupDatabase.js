const { query, connectDatabase } = require('../config/database');

async function setupDatabase() {
  try {
    await connectDatabase();
    console.log('🔧 Setting up database schema...');

    // Create vaccines table
    await query(`
      CREATE TABLE IF NOT EXISTS vaccines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        fda_approved_date DATE,
        childhood_schedule_date DATE,
        manufacturer VARCHAR(255),
        description TEXT,
        fda_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create manufacturers table
    await query(`
      CREATE TABLE IF NOT EXISTS manufacturers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        website VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create clinical_trials table
    await query(`
      CREATE TABLE IF NOT EXISTS clinical_trials (
        id SERIAL PRIMARY KEY,
        vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
        trial_phase VARCHAR(50),
        duration_months INTEGER,
        participant_count INTEGER,
        age_range_min INTEGER,
        age_range_max INTEGER,
        start_date DATE,
        end_date DATE,
        trial_identifier VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create adverse_effects table
    await query(`
      CREATE TABLE IF NOT EXISTS adverse_effects (
        id SERIAL PRIMARY KEY,
        vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
        effect_name VARCHAR(255) NOT NULL,
        severity VARCHAR(50),
        occurrence_rate DECIMAL(5,4),
        description TEXT,
        reported_cases INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_vaccines_name ON vaccines(name);
      CREATE INDEX IF NOT EXISTS idx_clinical_trials_vaccine_id ON clinical_trials(vaccine_id);
      CREATE INDEX IF NOT EXISTS idx_adverse_effects_vaccine_id ON adverse_effects(vaccine_id);
    `);

    // Insert sample data
    await insertSampleData();

    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  console.log('📝 Inserting sample vaccine data...');

  const vaccines = [
    {
      name: 'COVID-19 Vaccine (Pfizer-BioNTech)',
      manufacturer: 'Pfizer-BioNTech',
      fda_approved_date: '2021-08-23',
      description: 'mRNA COVID-19 vaccine for individuals 12 years and older'
    },
    {
      name: 'COVID-19 Vaccine (Moderna)',
      manufacturer: 'Moderna',
      fda_approved_date: '2022-01-31',
      description: 'mRNA COVID-19 vaccine for individuals 18 years and older'
    },
    {
      name: 'MMR Vaccine',
      manufacturer: 'Merck & Co.',
      fda_approved_date: '1971-04-02',
      childhood_schedule_date: '1971-04-02',
      description: 'Combined vaccine for measles, mumps, and rubella'
    },
    {
      name: 'DTaP Vaccine',
      manufacturer: 'Various',
      fda_approved_date: '1991-07-29',
      childhood_schedule_date: '1991-07-29',
      description: 'Combined vaccine for diphtheria, tetanus, and pertussis'
    },
    {
      name: 'Hepatitis B Vaccine',
      manufacturer: 'Merck & Co.',
      fda_approved_date: '1986-07-23',
      childhood_schedule_date: '1991-11-01',
      description: 'Vaccine to prevent hepatitis B virus infection'
    }
  ];

  for (const vaccine of vaccines) {
    try {
      const result = await query(`
        INSERT INTO vaccines (name, manufacturer, fda_approved_date, childhood_schedule_date, description)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      `, [vaccine.name, vaccine.manufacturer, vaccine.fda_approved_date, vaccine.childhood_schedule_date, vaccine.description]);

      if (result.rows.length > 0) {
        console.log(`✓ Added vaccine: ${vaccine.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to insert vaccine ${vaccine.name}:`, error.message);
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };

