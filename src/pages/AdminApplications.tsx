import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, MessageCircle, Calendar, User, Briefcase, X, LogOut } from 'lucide-react';
import { supabase, type Application } from '../lib/supabase';

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const checkAuthAndRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        navigate('/login');
        return;
      }

      setUser(session.user);
      setIsAdmin(true);
      setAuthChecked(true);
      fetchApplications();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      setLoading(false);
      navigate('/login');
    }
  };

  const fetchApplications = async () => {
    try {
      // Vérifier la configuration Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configuration Supabase manquante. Vérifiez vos variables d\'environnement.');
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setApplications(data || []);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      if (error.message?.includes('Configuration Supabase')) {
        setError('Configuration Supabase manquante. Contactez l\'administrateur.');
      } else {
        setError(`Erreur de connexion: ${error.message || 'Impossible de charger les candidatures'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Chargement des candidatures...</p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin - Candidatures</h1>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🔒 Sécurisé
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {user?.email}
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            {applications.length} candidature{applications.length !== 1 ? 's' : ''} reçue{applications.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={handleLogout}
            className="mt-2 inline-flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune candidature</h2>
            <p className="text-gray-600">Les candidatures apparaîtront ici une fois soumises.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{application.name}</h3>
                    <p className="text-gray-600 text-sm">{application.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      application.position === 'COO' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {application.position}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{application.project_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>{application.telegram}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(application.created_at)}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm line-clamp-3">
                  {application.motivation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Détails de la candidature</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Candidate Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du candidat</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{selectedApplication.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:underline">
                          {selectedApplication.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                        <span>{selectedApplication.telegram}</span>
                      </div>
                      {selectedApplication.tiktok && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">🎵</span>
                          <span>{selectedApplication.tiktok}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails du poste</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{selectedApplication.project_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">👔</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          selectedApplication.position === 'COO' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedApplication.position}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(selectedApplication.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Motivation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.motivation}</p>
                  </div>
                </div>

                {/* Creativity */}
                {selectedApplication.creativity && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Définition de la créativité</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.creativity}</p>
                    </div>
                  </div>
                )}

                {/* Universe Model */}
                {selectedApplication.universe_model && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Modèle d'univers imaginé</h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.universe_model}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${selectedApplication.email}?subject=Re: Candidature ${selectedApplication.position} - ${selectedApplication.project_name}`}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Répondre par email</span>
                  </a>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}