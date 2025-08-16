import React from 'react';
import { Home, User, Menu, X, ExternalLink, CreditCard, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useData } from '../../contexts/DataContext';
import AuthModal from '../AuthModal';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { globalUser, loading: profileLoading, error: profileError } = useUserProfile('romainflg');
  const { projects } = useData();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a 
              href="/"
              className="flex items-center space-x-2 text-xl sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <span>Romain FLG</span>
            </a>

            <div className="flex items-center space-x-3">
              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                {/* Indicateur si utilisateur connecté */}
                {user && !loading && !profileLoading && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
            <div className="space-y-3">
              {/* Profile Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Compte</h3>
                <div className="space-y-1">
                  {loading || (profileLoading && !profileError) ? (
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Chargement...</span>
                    </div>
                  ) : user && globalUser && !profileError ? (
                    <a
                      href="/profile"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img
                        src={globalUser?.profile_photo_url || '/profile-photos/default-avatar.png'}
                        alt="Photo de profil"
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== '/profile-photos/default-avatar.png') {
                            target.src = '/profile-photos/default-avatar.png';
                          }
                        }}
                      />
                      <span className="font-medium">Mon Profil</span>
                      <span className="text-sm text-gray-500">({globalUser?.username})</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                    >
                      <User className="h-6 w-6 text-blue-600" />
                      <span className="font-medium">Se connecter</span>
                    </button>
                  )}
                  {profileError && (
                    <div className="px-3 py-2 text-sm text-amber-600 bg-amber-50 rounded-lg">
                      <p className="font-medium">⚠️ Configuration requise</p>
                      <p className="text-xs mt-1">Variables Supabase manquantes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Projects Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Projets</h3>
                <div className="space-y-1">
                  {projects.map((project) => (
                    <a
                      key={project.id}
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="font-medium">{project.name}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Other Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</h3>
                <div className="space-y-1">
                  <a
                    href="https://romainflg.fr/flg-pass"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Key className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">FLG PASS</span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                  <a
                    href="https://romainflg.fr/credits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Crédits</span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}