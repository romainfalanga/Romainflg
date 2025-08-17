import React, { useState } from 'react';
import { User, Camera, Save, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ImageUpload } from '../components/ImageUpload';

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await updateProfile({
        username: username.trim(),
        avatar_url: avatarUrl.trim() || null,
      });

      if (error) {
        setMessage('Erreur lors de la sauvegarde');
      } else {
        setMessage('Profil mis à jour avec succès');
        setIsEditing(false);
      }
    } catch (error) {
      setMessage('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(profile?.username || '');
    setAvatarUrl(profile?.avatar_url || '');
    setIsEditing(false);
    setMessage('');
  };

  const handleImageChange = (newImageUrl: string) => {
    setAvatarUrl(newImageUrl);
    setShowImageUpload(false);
    // Auto-save the new image
    handleSaveImage(newImageUrl);
  };

  const handleSaveImage = async (newImageUrl: string) => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🖼️ Sauvegarde nouvelle image...');
      const { error } = await updateProfile({ avatar_url: newImageUrl });
      
      if (error) {
        console.error('❌ Erreur sauvegarde image:', error);
        setMessage('Erreur lors de la sauvegarde de l\'image');
      } else {
        console.log('✅ Image sauvegardée avec succès');
        setMessage('Photo de profil mise à jour avec succès');
        setAvatarUrl(newImageUrl);
      }
    } catch (error) {
      console.error('❌ Exception sauvegarde image:', error);
      setMessage('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-500"></div>
        
        {/* Profile Content */}
        <div className="px-6 py-6">
          <div className="relative -mt-16 mb-6">
            <div className="flex items-end space-x-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url || avatarUrl ? (
                  <img
                    src={isEditing ? avatarUrl : profile.avatar_url}
                    alt={profile.username}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
                {!isEditing && (
                  <button 
                    onClick={() => setShowImageUpload(true)}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${
              message.includes('succès') 
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom d'utilisateur"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.username}</span>
                </div>
              )}
            </div>


            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                  Non modifiable
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membre depuis
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save size={16} />
                  <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          currentImage={profile.avatar_url}
          onImageChange={handleImageChange}
          onCancel={() => setShowImageUpload(false)}
        />
      )}
      {/* Placeholder for Future Features */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Fonctionnalités à venir
        </h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Préférences de notification</li>
          <li>• Intégrations avec les projets</li>
          <li>• Historique d'activité</li>
          <li>• Paramètres de sécurité avancés</li>
        </ul>
      </div>
    </div>
  );
}