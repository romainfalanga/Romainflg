import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { User, CreditCard, Home, LogOut, Bell, Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCredits } from '../hooks/useCredits';

function Layout() {
  const { user, profile, signOut } = useAuth();
  const { credits } = useCredits();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="glass-effect shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/logos/FLG.png" 
                alt="FLG Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Romain FLG
              </span>
            </Link>

            {/* User Menu - Always visible */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Credits Badge - Only for connected users */}
              {user && (
                <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CreditCard size={12} />
                  <span className="hidden sm:inline">{credits?.balance || 0} crédits</span>
                  <span className="sm:hidden">{credits?.balance || 0}</span>
                </div>
              )}

              {/* Notifications - Only for connected users */}
              {user && (
                <button className="hidden sm:block p-2 text-gray-400 hover:text-primary-600 transition-colors duration-300 relative">
                  <Bell size={16} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
                </button>
              )}

              {/* Hamburger Menu - Always visible */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group relative p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-primary-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-col space-y-1.5">
                    <div className={`w-5 h-0.5 bg-gray-600 group-hover:bg-primary-600 transition-all duration-300 transform origin-center ${userMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-5 h-0.5 bg-gray-600 group-hover:bg-primary-600 transition-all duration-300 ${userMenuOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-5 h-0.5 bg-gray-600 group-hover:bg-primary-600 transition-all duration-300 transform origin-center ${userMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-slide-up">
                    {user && profile ? (
                      <>
                        {/* User Profile Section */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">{profile.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="flex items-center space-x-1 mt-1">
                                <CreditCard size={12} className="text-primary-500" />
                                <span className="text-xs text-primary-600 font-medium">
                                  {credits?.balance || 0} crédits
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2">
                          <Link
                            to="/"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Home size={16} />
                            <span className="font-medium">Accueil</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={16} />
                            <span className="font-medium">Profil</span>
                          </Link>
                          <Link
                            to="/credits"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CreditCard size={16} />
                            <span className="font-medium">Crédits</span>
                          </Link>
                          <Link
                            to="/flg-pass"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CreditCard size={16} />
                            <span className="font-medium">FLG Pass</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Connection Section for non-connected users */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                              <User size={20} className="text-white" />
                            </div>
                            <div className="font-semibold text-gray-900 mb-2">Bienvenue !</div>
                            <Link
                              to="/auth"
                              className="btn-primary text-sm w-full"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Se connecter
                            </Link>
                          </div>
                        </div>

                        {/* Navigation for non-connected users */}
                        <div className="py-2">
                          <Link
                            to="/"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Home size={16} />
                            <span className="font-medium">Accueil</span>
                          </Link>
                          <Link
                            to="/credits"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CreditCard size={16} />
                            <span className="font-medium">Crédits</span>
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Projects Links */}
                    <div className="border-t border-gray-100 py-2">
                      <div className="px-4 py-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Liens des projets
                        </span>
                      </div>
                      <a
                        href="https://t.me/ChessValue"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <img src="/logos/ChessValue.png" alt="Chess Value" className="w-5 h-5 object-contain" />
                          <span className="font-medium">Chess Value</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-400" />
                      </a>
                      <a
                        href="https://t.me/Chess13Game"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <img src="/logos/Chess13.png" alt="Chess 13" className="w-5 h-5 object-contain" />
                          <span className="font-medium">Chess 13</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-400" />
                      </a>
                      <a
                        href="https://t.me/Chess100Game"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <img src="/logos/Chess100.png" alt="Chess 100" className="w-5 h-5 object-contain" />
                          <span className="font-medium">Chess 100</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-400" />
                      </a>
                      <a
                        href="https://t.me/DraftChessGame"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <img src="/logos/DraftChess.png" alt="Draft Chess" className="w-5 h-5 object-contain" />
                          <span className="font-medium">Draft Chess</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-400" />
                      </a>
                    </div>

                    {/* Logout for connected users */}
                    {user && (
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-300 w-full text-left"
                        >
                          <LogOut size={16} />
                          <span className="font-medium">Déconnexion</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/logos/FLG.png" 
                alt="FLG Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain mr-2"
              />
              <span className="text-base sm:text-lg font-semibold text-gray-900">
                Romain FLG
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              &copy; 2025 Romain FLG. Tous droits réservés.
            </p>
            <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;