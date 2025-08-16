/*
  # Reset complet de la base de données

  1. Suppression des données
    - Vide toutes les tables existantes
    - Supprime tous les utilisateurs de Supabase Auth
    - Remet les compteurs à zéro

  2. Tables concernées
    - applications
    - comments  
    - posts
    - partners
    - projects
    - user_profiles
    - auth.users (utilisateurs Supabase)

  ⚠️ ATTENTION: Cette migration supprime TOUTES les données de façon irréversible
*/

-- Désactiver temporairement RLS pour les opérations de nettoyage
SET session_replication_role = replica;

-- Vider toutes les tables dans l'ordre des dépendances
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE posts CASCADE;
TRUNCATE TABLE partners CASCADE;
TRUNCATE TABLE applications CASCADE;
TRUNCATE TABLE user_profiles CASCADE;
TRUNCATE TABLE projects CASCADE;

-- Supprimer tous les utilisateurs de Supabase Auth
-- ATTENTION: Ceci supprime tous les comptes utilisateurs
DELETE FROM auth.users;

-- Réactiver RLS
SET session_replication_role = DEFAULT;

-- Optionnel: Réinitialiser les séquences si nécessaire
-- (Les UUID n'utilisent pas de séquences, donc pas nécessaire ici)