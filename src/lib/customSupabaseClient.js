import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhmzfietfykyepvzknkv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobXpmaWV0ZnlreWVwdnprbmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODUyMDQsImV4cCI6MjA3MDE2MTIwNH0.W8XTaN2cW2DvilBairBMb4lM3CjEwJGsJMd0av6bMg4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);