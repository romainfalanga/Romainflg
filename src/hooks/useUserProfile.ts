import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export interface GlobalUser {
  id: string;
  auth_user_id: string;
  username: string;
  email: string;
  profile_photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface SiteUserProfile {
  id: string;
  global_user_id: string;
  site_name: string;
  description: string;
  site_specific_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfileData {
  globalUser: GlobalUser | null;
  siteProfile: SiteUserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(siteName: string = 'romainflg'): UserProfileData & {
  updateGlobalProfile: (updates: Partial<Pick<GlobalUser, 'username' | 'profile_photo_url'>>) => Promise<void>;
  updateSiteProfile: (updates: Partial<Pick<SiteUserProfile, 'description' | 'site_specific_data'>>) => Promise<void>;
  refreshProfile: () => Promise<void>;
} {
  const { user } = useAuth();
  const [globalUser, setGlobalUser] = useState<GlobalUser | null>(null);
  const [siteProfile, setSiteProfile] = useState<SiteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    // Vérifier si Supabase est configuré avant d'essayer de fetch
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
      setGlobalUser(null);
      setSiteProfile(null);
      setLoading(false);
      setError('Configuration Supabase manquante. Veuillez configurer les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (!user) {
      setGlobalUser(null);
      setSiteProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer le profil global
      const { data: globalData, error: globalError } = await supabase
        .from('global_users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (globalError) {
        throw globalError;
      }

      setGlobalUser(globalData);

      // Récupérer le profil spécifique au site
      const { data: siteData, error: siteError } = await supabase
        .from('site_user_profiles')
        .select('*')
        .eq('global_user_id', globalData.id)
        .eq('site_name', siteName)
        .single();

      if (siteError && siteError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw siteError;
      }

      // Si pas de profil site, le créer
      if (!siteData) {
        const { data: newSiteData, error: createError } = await supabase
          .from('site_user_profiles')
          .insert({
            global_user_id: globalData.id,
            site_name: siteName,
            description: '',
            site_specific_data: {}
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setSiteProfile(newSiteData);
      } else {
        setSiteProfile(siteData);
      }

    } catch (err: any) {
      console.error('Erreur lors du chargement du profil:', err);
      setError(err.message || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalProfile = async (updates: Partial<Pick<GlobalUser, 'username' | 'profile_photo_url'>>) => {
    if (!globalUser) throw new Error('Aucun profil global trouvé');

    try {
      const { data, error } = await supabase
        .from('global_users')
        .update(updates)
        .eq('id', globalUser.id)
        .select()
        .single();

      if (error) throw error;

      setGlobalUser(data);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil global:', err);
      throw err;
    }
  };

  const updateSiteProfile = async (updates: Partial<Pick<SiteUserProfile, 'description' | 'site_specific_data'>>) => {
    if (!siteProfile) throw new Error('Aucun profil site trouvé');

    try {
      const { data, error } = await supabase
        .from('site_user_profiles')
        .update(updates)
        .eq('id', siteProfile.id)
        .select()
        .single();

      if (error) throw error;

      setSiteProfile(data);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil site:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [user, siteName]);

  return {
    globalUser,
    siteProfile,
    loading,
    error,
    updateGlobalProfile,
    updateSiteProfile,
    refreshProfile
  };
}