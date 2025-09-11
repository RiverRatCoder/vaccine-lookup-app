// Quick Supabase connection test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvdlrznuguqcgrmhewumse.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZGxyem51Z3VxY2dybWhld3Vtc2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNjA2NzI3MSwiZXhwIjo4MDQxNjM5MjcxfQ.zX2Stbx8gWEpvo_AHjuSe_PmBbHV23hInCdlOt';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test 1: Simple select
    const { data, error } = await supabase
      .from('vaccines')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase Error:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('📊 Sample data:', data);
    
  } catch (err) {
    console.error('❌ Network Error:', err);
  }
}

// Run test immediately
testConnection();

export default testConnection;
