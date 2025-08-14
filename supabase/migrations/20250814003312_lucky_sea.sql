/*
  # Create Admin User Setup

  1. Instructions
    - Ce fichier contient les instructions pour créer un utilisateur admin
    - À exécuter manuellement dans Supabase Dashboard
  
  2. Étapes à suivre
    - Aller dans Authentication > Users dans Supabase Dashboard
    - Créer un nouvel utilisateur avec votre email
    - Exécuter la requête SQL ci-dessous pour lui donner le rôle admin
*/

-- Une fois l'utilisateur créé dans Authentication > Users, 
-- remplacez 'VOTRE_EMAIL_ICI' par votre vraie adresse email et exécutez :

INSERT INTO user_profiles (id, username, role)
SELECT 
  auth.uid() as id,
  'admin' as username,
  'admin' as role
FROM auth.users 
WHERE email = 'VOTRE_EMAIL_ICI'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Alternative si vous connaissez l'UUID de l'utilisateur :
-- INSERT INTO user_profiles (id, username, role) 
-- VALUES ('UUID_DE_VOTRE_UTILISATEUR', 'admin', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';