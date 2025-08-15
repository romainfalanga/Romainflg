// Configuration centralisée des photos de profil
export const profilePhotos = {
  // Ajoutez vos photos de profil ici
  // Format: 'nom-prenom': '/profile-photos/nom-prenom.jpg'
  
  'romain-falanga': '/profile-photos/RomainFalanga.jpeg?v=2',
  
  // Exemples pour de futurs profils :
  // 'jean-dupont': '/profile-photos/jean-dupont.jpg',
  // 'marie-martin': '/profile-photos/marie-martin.jpg',
} as const;

// Type pour l'autocomplétion
export type ProfilePhotoKey = keyof typeof profilePhotos;

// Fonction utilitaire pour récupérer une photo de profil
export function getProfilePhoto(key: ProfilePhotoKey): string {
  return profilePhotos[key];
}

// Fonction pour vérifier si une photo existe
export function hasProfilePhoto(key: string): key is ProfilePhotoKey {
  return key in profilePhotos;
}