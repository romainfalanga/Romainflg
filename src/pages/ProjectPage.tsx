import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, Users, User, MessageCircle, UserPlus, HelpCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ApplicationModal from '../components/ApplicationModal';
import { getProfilePhoto } from '../config/profilePhotos';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useData();
  const project = projects.find(p => p.slug === slug);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = React.useState(false);
  const [selectedPosition, setSelectedPosition] = React.useState<'CM'>('CM');

  // Scroll vers le haut quand on arrive sur la page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Texte à gauche */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{project.name}</h1>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                {project.description.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < project.description.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
            
            {/* Image à droite */}
            <div className="flex justify-center order-first md:order-last">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover object-center bg-gray-100 rounded-xl sm:rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">L'équipe du projet</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4">
            {/* CEO */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-100 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-3 shadow-lg">
                <img 
                  src={getProfilePhoto('romain-falanga')}
                  alt="Romain Falanga"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">CEO</h3>
              <p className="text-xs text-gray-500 mb-1">Directeur général</p>
              <p className="text-gray-700 font-medium text-xs sm:text-sm mt-1 sm:mt-1">Romain Falanga</p>
              <Link
                to="/profile"
                className="mt-2 inline-block text-sm sm:text-sm bg-blue-600 text-white px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Voir le profil
              </Link>
            </div>

            {/* CM 1 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100 text-center">
              {(!project.cm1?.name || project.cm1?.name === 'Recherche active') ? (
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
                </div>
              ) : (
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
                </div>
              )}
              <h3 className="text-base sm:text-lg font-bold text-gray-900">CM 1</h3>
              <p className="text-xs text-gray-500 mb-1">Community Manager</p>
              <p className="text-gray-700 font-medium text-xs sm:text-sm">
                {project.cm1?.name || 'Recherche active'}
              </p>
              {(!project.cm1?.name || project.cm1?.name === 'Recherche active') && (
                <button
                  onClick={() => {
                    setSelectedPosition('CM');
                    setIsApplicationModalOpen(true);
                  }}
                  className="mt-2 sm:mt-3 text-sm sm:text-sm bg-blue-600 text-white px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Postuler
                </button>
              )}
            </div>

            {/* CM 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100 text-center">
              {(!project.cm2?.name || project.cm2?.name === 'Recherche active') ? (
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
                </div>
              ) : (
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
                </div>
              )}
              <h3 className="text-base sm:text-lg font-bold text-gray-900">CM 2</h3>
              <p className="text-xs text-gray-500 mb-1">Community Manager</p>
              <p className="text-gray-700 font-medium text-xs sm:text-sm">
                {project.cm2?.name || 'Recherche active'}
              </p>
              {(!project.cm2?.name || project.cm2?.name === 'Recherche active') && (
                <button
                  onClick={() => {
                    setSelectedPosition('CM');
                    setIsApplicationModalOpen(true);
                  }}
                  className="mt-2 sm:mt-3 text-sm sm:text-sm bg-blue-600 text-white px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Postuler
                </button>
              )}
            </div>

            {/* CM 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-100 text-center">
              {(!project.cm3?.name || project.cm3?.name === 'Recherche active') ? (
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
                </div>
              ) : (
                <div className="relative p-3 sm:p-4 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" />
                </div>
              )}
              <h3 className="text-base sm:text-lg font-bold text-gray-900">CM 3</h3>
              <p className="text-xs text-gray-500 mb-1">Community Manager</p>
              <p className="text-gray-700 font-medium text-xs sm:text-sm">
                {project.cm3?.name || 'Recherche active'}
              </p>
              {(!project.cm3?.name || project.cm3?.name === 'Recherche active') && (
                <button
                  onClick={() => {
                    setSelectedPosition('CM');
                    setIsApplicationModalOpen(true);
                  }}
                  className="mt-2 sm:mt-3 text-sm sm:text-sm bg-blue-600 text-white px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Postuler
                </button>
              )}
            </div>
          </div>

          {/* Bouton Telegram */}
          <div className="mt-4 text-center">
            <a
              href={project.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Rejoindre le Telegram</span>
            </a>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="mb-8 sm:mb-12">
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sm:p-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-xl block w-full"
          >
            <div className="flex items-center justify-center space-x-3">
              <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-xl sm:text-2xl font-bold">Accéder à {project.name}</span>
            </div>
          </a>
        </div>

      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        projectName={project.name}
        preselectedPosition={selectedPosition}
      />
    </div>
  );
}