import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('Ready to test with CORRECTED URL!');

  const testConnection = async () => {
    try {
      console.log('🧪 Testing Supabase with CORRECTED URL...');
      console.log('🔍 URL:', 'https://mvoirgmuqqcgmhewumse.supabase.co');
      setTestResult('Testing with corrected URL...');
      
      const { data, error } = await supabase
        .from('vaccines')
        .select('id, name')
        .limit(3);
      
      if (error) {
        console.error('❌ Supabase Error:', error);
        setTestResult(`Error: ${error.message}`);
        return;
      }
      
      console.log('✅ SUCCESS! Data:', data);
      setTestResult(`🎉 SUCCESS! Found ${data?.length || 0} vaccines from real Supabase!`);
      
    } catch (err: any) {
      console.error('❌ Network Error:', err);
      setTestResult(`Network Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>🎉 Supabase Connection Test (URL FIXED!)</h3>
      <button onClick={testConnection} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test Supabase Connection
      </button>
      <p><strong>Result:</strong> {testResult}</p>
    </div>
  );
};

export default SupabaseTest;
