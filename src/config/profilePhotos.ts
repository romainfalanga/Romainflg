// Configuration centralisée des photos de profil
// DEPRECATED: Ce fichier n'est plus utilisé car les profils sont maintenant stockés en base de données
// Gardé pour compatibilité temporaire

export const profilePhotos = {
  // Les profils sont maintenant récupérés depuis la base de données Supabase
  // Voir: global_users table
} as const;

// Type pour l'autocomplétion (deprecated)
export type ProfilePhotoKey = keyof typeof profilePhotos;

// Fonction utilitaire pour récupérer une photo de profil (deprecated)
export function getProfilePhoto(key: ProfilePhotoKey): string {
  console.warn('getProfilePhoto is deprecated. Use database profiles instead.');
  return '/profile-photos/default-avatar.png';
}

// Fonction pour vérifier si une photo existe (deprecated)
export function hasProfilePhoto(key: string): key is ProfilePhotoKey {
  console.warn('hasProfilePhoto is deprecated. Use database profiles instead.');
  return false;
}