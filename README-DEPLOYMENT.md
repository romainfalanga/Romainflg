# 🚀 Guide de Déploiement - romainflg.fr

## Configuration des Variables d'Environnement

Pour que l'authentification fonctionne sur romainflg.fr, vous devez configurer les variables d'environnement Supabase sur votre hébergeur.

### Variables Requises

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Configuration selon l'hébergeur

#### 🌐 **Netlify**
1. Allez dans votre dashboard Netlify
2. Sélectionnez votre site romainflg.fr
3. Allez dans **Site settings** > **Environment variables**
4. Ajoutez les 2 variables :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redéployez le site

#### ⚡ **Vercel**
1. Allez dans votre dashboard Vercel
2. Sélectionnez votre projet romainflg.fr
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez les 2 variables
5. Redéployez

#### 🔥 **Firebase Hosting**
1. Utilisez Firebase Functions pour les variables d'environnement
2. Ou configurez via `firebase.json`

#### 📁 **GitHub Pages**
GitHub Pages ne supporte pas les variables d'environnement côté serveur.
Vous devrez :
1. Soit utiliser un autre hébergeur (Netlify/Vercel)
2. Soit hardcoder les valeurs (non recommandé pour la sécurité)

### Comment obtenir vos clés Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### Vérification

Une fois configuré, l'authentification devrait fonctionner sur romainflg.fr !

Si vous voyez encore "failed to fetch", vérifiez :
1. ✅ Variables bien configurées sur l'hébergeur
2. ✅ Site redéployé après ajout des variables
3. ✅ Pas de typos dans les noms des variables
4. ✅ Clés Supabase valides et actives

## 🔧 Dépannage

**Erreur "failed to fetch"** = Variables d'environnement manquantes
**Erreur "Invalid API key"** = Mauvaise clé Supabase
**Erreur "Project not found"** = Mauvaise URL Supabase