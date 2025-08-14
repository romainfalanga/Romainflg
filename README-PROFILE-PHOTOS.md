# 📸 Guide des Photos de Profil

## Structure du système

```
public/profile-photos/          # Dossier des photos
├── .gitkeep                   # Maintient le dossier
├── RomainFalanga.jpeg         # Votre photo
└── ...                        # Autres photos futures

src/config/profilePhotos.ts    # Configuration centralisée
```

## 🚀 Comment ajouter une nouvelle photo de profil

### Étape 1 : Ajouter la photo
1. Placez votre photo dans `public/profile-photos/`
2. Nommez-la selon le format : `prenom-nom.jpg` (ex: `RomainFalanga.jpeg`)

### Étape 2 : Configurer la photo
Dans `src/config/profilePhotos.ts`, ajoutez :

```typescript
export const profilePhotos = {
  'romain-falanga': '/profile-photos/RomainFalanga.jpeg', // ✅ Votre photo
  'jean-dupont': '/profile-photos/jean-dupont.jpg',       // ✅ Nouvelle photo
  // ...
};
```

### Étape 3 : Utiliser dans une page de profil
```typescript
import { getProfilePhoto } from '../config/profilePhotos';

// Dans votre composant :
<img src={getProfilePhoto('romain-falanga')} alt="Romain Falanga" />
```

## 📋 Avantages de ce système

✅ **Centralisé** : Toutes les photos au même endroit  
✅ **Type-safe** : Autocomplétion et vérification des types  
✅ **Réutilisable** : Une photo peut être utilisée partout  
✅ **Maintenable** : Facile de changer une photo globalement  

## 🔄 Pour changer votre photo

1. Remplacez le fichier dans `public/profile-photos/RomainFalanga.jpeg`
2. Ou changez le chemin dans `profilePhotos.ts`
3. La photo sera automatiquement mise à jour partout !

## 📝 Notes importantes

- Format recommandé : JPG ou PNG
- Taille recommandée : 400x400px minimum
- Ratio 1:1 (carré) pour un meilleur rendu
- Optimisez vos images pour le web