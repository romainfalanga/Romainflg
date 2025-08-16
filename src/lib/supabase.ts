import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour romainflg.fr
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  
  // En production, afficher un message d'erreur plus clair
  if (typeof window !== 'undefined') {
    console.error('🔥 ERREUR PRODUCTION: Variables Supabase manquantes sur romainflg.fr');
  }
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);