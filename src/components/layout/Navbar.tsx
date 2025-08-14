import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Heart, User, Users, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    checkUser();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        await checkAdminRole(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      await checkAdminRole(session.user.id);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span>Romain FLG</span>
          </Link>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Link
                to="/admin/applications"
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            
            <a
              href="https://fr.tipeee.com/romain-falanga/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 font-medium text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Heart className="h-4 w-4" />
              <span>Faire un don</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}