import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jhmzfietfykyepvzknkv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobXpmaWV0ZnlreWVwdnprbmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODUyMDQsImV4cCI6MjA3MDE2MTIwNH0.W8XTaN2cW2DvilBairBMb4lM3CjEwJGsJMd0av6bMg4';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});