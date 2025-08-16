import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour romainflg.fr
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
  console.error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.log('Current values:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? '[SET]' : '[MISSING]' });
  
  // En production, afficher un message d'erreur plus clair
  if (typeof window !== 'undefined') {
    console.error('🔥 ERREUR PRODUCTION: Variables Supabase manquantes sur romainflg.fr');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);