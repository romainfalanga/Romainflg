import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuration Supabase:', {
  url: supabaseUrl ? '✅ Configurée' : '❌ Manquante',
  key: supabaseAnonKey ? '✅ Configurée' : '❌ Manquante'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'OK' : 'MANQUANTE',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'OK' : 'MANQUANTE'
  });
  throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez la configuration Netlify.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Application {
  id: string;
  project_name: string;
  name: string;
  email: string;
  position: 'COO' | 'CM';
  telegram: string;
  tiktok?: string;
  motivation: string;
  creativity?: string;
  universe_model?: string;
  created_at: string;
}