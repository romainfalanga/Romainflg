import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Trim whitespace from all input values
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();
    const trimmedUsername = formData.username.trim();

    try {
      if (mode === 'signin') {
        await signIn(trimmedEmail, trimmedPassword);
        onClose();
      } else {
        if (!trimmedUsername) {
          setError('Le nom d\'utilisateur est requis');
          return;
        }
        await signUp(trimmedEmail, trimmedPassword, trimmedUsername);
        onClose();
      }
    } catch (err: any) {
      console.error('Erreur d\'authentification:', err);
      
      if (err.message === 'Invalid login credentials') {
        setError('Email ou mot de passe incorrect.');
      } else if (err.message?.includes('Database error saving new user') || err.code === 'unexpected_failure') {
        setError('Erreur lors de la création du compte. Le système d\'authentification a été mis à jour. Veuillez réessayer dans quelques secondes.');
      } else if (err.message?.includes('User already registered')) {
        setError('Un compte avec cet email existe déjà. Essayez de vous connecter.');
      } else if (err.message?.includes('duplicate key') || err.message?.includes('already exists')) {
        setError('Ce nom d\'utilisateur ou cet email est déjà utilisé. Essayez avec des informations différentes.');
      } else {
        setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'signin' ? 'Connexion' : 'Inscription'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                <span>Nom d'utilisateur</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom d'utilisateur"
              />
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4" />
              <span>Mot de passe</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {mode === 'signin' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                <span>{mode === 'signin' ? 'Se connecter' : 'S\'inscrire'}</span>
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {mode === 'signin' 
                ? 'Pas encore de compte ? S\'inscrire' 
                : 'Déjà un compte ? Se connecter'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}