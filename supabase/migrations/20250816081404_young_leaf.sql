/*
  # Vider toutes les données de la base de données

  Cette migration supprime toutes les données de toutes les tables tout en conservant la structure.

  ## Tables vidées
  1. comments - Tous les commentaires
  2. posts - Tous les posts
  3. partners - Tous les partenaires
  4. applications - Toutes les candidatures
  5. user_profiles - Tous les profils utilisateurs
  6. projects - Tous les projets

  ## Important
  - La structure des tables est conservée
  - Les politiques RLS restent en place
  - Seules les données sont supprimées
*/

-- Supprimer toutes les données dans l'ordre des dépendances
-- (les tables enfants d'abord, puis les tables parents)

-- 1. Supprimer les commentaires
DELETE FROM comments;

-- 2. Supprimer les posts
DELETE FROM posts;

-- 3. Supprimer les partenaires
DELETE FROM partners;

-- 4. Supprimer les candidatures
DELETE FROM applications;

-- 5. Supprimer les profils utilisateurs
DELETE FROM user_profiles;

-- 6. Supprimer les projets
DELETE FROM projects;

-- Réinitialiser les séquences si nécessaire
-- (Supabase utilise des UUID par défaut, donc pas de séquences à réinitialiser)