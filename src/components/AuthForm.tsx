import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Firebase est configuré directement dans le code
    console.log('🔥 Firebase Auth Form prêt');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Tentative de connexion/inscription');
    
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!isLogin && !username) {
      setError('Nom d\'utilisateur requis pour l\'inscription');
      return;
    }

    if (!isLogin && username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
        console.log('🔐 Connexion en cours...');
        result = await signIn(email, password);
      } else {
        console.log('📝 Inscription en cours...');
        result = await signUp(email, password, username);
      }

      console.log('📊 Résultat auth:', result);

      if (result.error) {
        console.error('❌ Erreur auth:', result.error);
        let errorMessage = result.error.message || 'Erreur d\'authentification';
        
        // Messages d'erreur plus clairs
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'Un compte existe déjà avec cet email';
        } else if (errorMessage.includes('Password should be at least')) {
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Veuillez vérifier votre email pour confirmer votre compte';
        }
        
        setError(errorMessage);
      } else {
        console.log('✅ Authentification réussie');
        console.log('🔄 Redirection vers la page d\'accueil...');
        // Force la redirection
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('❌ Exception auth:', err);
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img 
              src="/logos/FLG.png" 
              alt="FLG Logo" 
              className="w-16 h-16 object-contain animate-glow"
            />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-primary-500 animate-bounce-subtle" />
            </div>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </h2>
        <p className="text-center text-lg text-gray-600 mb-2">
          Bienvenue sur <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-semibold">Romain FLG</span>
        </p>
        <div className="flex justify-center">
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-effect py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 animate-slide-up">

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all duration-300"
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all duration-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all duration-300"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-primary-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-primary-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors duration-300"
              >
                {isLogin 
                  ? "Vous n'avez pas de compte ? Créer un compte"
                  : "Vous avez déjà un compte ? Se connecter"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}