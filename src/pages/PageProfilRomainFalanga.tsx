import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, X, LogOut, Camera, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { globalUser, siteProfile, loading, error, updateGlobalProfile, updateSiteProfile } = useUserProfile('romainflg');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    username: '',
    description: '',
    profile_photo_url: ''
  });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Fonction pour gérer le changement d'image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 Fichier sélectionné:', file.name, file.type, file.size);
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setSaveError('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setUploadingImage(true);
      setSaveError(null);

      try {
        // Créer un nom de fichier unique
        const fileExt = file.name.split('.').pop();
        const fileName = `user-${user?.id}-${Date.now()}.${fileExt}`;
        
        console.log('📝 Nom de fichier généré:', fileName);
        
        console.log('☁️ Tentative d\'upload vers Supabase Storage...');

        // Upload vers Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('❌ Erreur upload Supabase:', uploadError);
          throw new Error(`Erreur upload: ${uploadError.message}`);
        }

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        console.log('✅ Upload réussi ! URL Supabase:', publicUrl);

        // Mettre à jour l'état avec la nouvelle URL
        setEditData({ ...editData, profile_photo_url: publicUrl });

      } catch (error: any) {
        console.error('❌ Erreur lors de l\'upload:', error);
        setSaveError(`Impossible d'uploader l'image: ${error.message}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mettre à jour les données d'édition quand les profils changent
  React.useEffect(() => {
    if (globalUser && siteProfile) {
      setEditData({
        username: globalUser.username,
        description: siteProfile.description,
        profile_photo_url: globalUser.profile_photo_url
      });
    }
  }, [globalUser, siteProfile]);

  const handleSave = async () => {
    if (!globalUser || !siteProfile) return;

    setSaving(true);
    setSaveError(null);

    try {
      // Mettre à jour le profil global si nécessaire
      if (editData.username !== globalUser.username || editData.profile_photo_url !== globalUser.profile_photo_url) {
        await updateGlobalProfile({
          username: editData.username.trim(),
          profile_photo_url: editData.profile_photo_url
        });
      }

      // Mettre à jour le profil site si nécessaire
      if (editData.description !== siteProfile.description) {
        await updateSiteProfile({
          description: editData.description.trim()
        });
      }

      setIsEditing(false);
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSaveError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (globalUser && siteProfile) {
      setEditData({
        username: globalUser.username,
        description: siteProfile.description,
        profile_photo_url: globalUser.profile_photo_url
      });
    }
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Si pas d'utilisateur connecté, rediriger vers l'accueil
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Cover Image */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-12 sm:-mt-16 mb-4 sm:mb-6">
              <div className="relative">
                <input
                  type="file"
                  id="profile-photo-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <img
                  src={editData.profile_photo_url || '/profile-photos/default-avatar.png'}
                  alt={editData.username}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Si l'image ne charge pas, essayer l'avatar par défaut
                    if (target.src !== '/profile-photos/default-avatar.png') {
                      target.src = '/profile-photos/default-avatar.png';
                    }
                  }}
                />
                {isEditing && (
                  <button 
                    onClick={() => document.getElementById('profile-photo-upload')?.click()}
                    disabled={uploadingImage}
                    className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                  </button>
                )}
                {!isEditing && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 text-center bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
                    placeholder="Nom d'utilisateur"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{globalUser?.username}</h1>
                )}
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Info sur le nom d'utilisateur global */}
              <div className="mb-4">
                <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
                  🌐 Ce nom d'utilisateur et cette photo sont partagés sur toutes les plateformes Romain FLG
                </p>
                {editData.profile_photo_url?.startsWith('/profile-photos/') && (
                  <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block mt-2">
                    📁 Photo actuelle stockée localement - Uploadez une nouvelle photo pour migrer vers le cloud
                  </p>
                )}
              </div>
              
              {/* About Text */}
              <div className="max-w-3xl mx-auto mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">À propos</h3>
                <div className="prose prose-lg max-w-none text-left">
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={8}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
                      placeholder="Parlez-nous de vous, vos passions, vos projets..."
                    />
                  ) : (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {siteProfile?.description || (
                        <div className="text-gray-500 italic">
                          Aucune description ajoutée. Cliquez sur le bouton modifier pour ajouter une description.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {saveError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{saveError}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                    <span>Annuler</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}