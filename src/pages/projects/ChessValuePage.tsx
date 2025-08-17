import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationModal } from '../../components/ApplicationModal';

export function ChessValuePage() {
  const [showApplicationModal, setShowApplicationModal] = React.useState(false);
  const [selectedPosition, setSelectedPosition] = React.useState('');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApply = (position: string) => {
    setSelectedPosition(position);
    setShowApplicationModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-all duration-300 mb-6 sm:mb-8 group"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium">Retour à l'accueil</span>
        </Link>

        {/* Main Project Card */}
        <div className="glass-effect rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex-1 lg:pr-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Projet 1</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Chess Value</h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Chess Value évalue en temps réel la valeur des pièces selon la position, pour analyser et améliorer vos stratégies aux échecs.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end lg:ml-8">
              <img 
                src="/logos/ChessValue.png"
                alt="Chess Value"
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="glass-effect rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">L'équipe du projet</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* CEO */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-2xl mx-auto mb-3 sm:mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                  alt="Romain Falanga" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">CEO</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Directeur général</div>
              <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Romain Falanga</div>
              <button className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
                Voir le profil
              </button>
            </div>

            {/* CM 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-lg sm:text-2xl font-bold">?</span>
              </div>
              <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">CM 1</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Community Manager</div>
              <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Recherche active</div>
              <button 
                className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
                onClick={() => handleApply('CM 1')}
              >
                Postuler
              </button>
            </div>

            {/* CM 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-lg sm:text-2xl font-bold">?</span>
              </div>
              <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">CM 2</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Community Manager</div>
              <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Recherche active</div>
              <button 
                className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
                onClick={() => handleApply('CM 2')}
              >
                Postuler
              </button>
            </div>

            {/* CM 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-lg sm:text-2xl font-bold">?</span>
              </div>
              <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">CM 3</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Community Manager</div>
              <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Recherche active</div>
              <button 
                className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
                onClick={() => handleApply('CM 3')}
              >
                Postuler
              </button>
            </div>
          </div>

          {/* Telegram Button */}
          <div className="text-center">
            <a 
              href="https://t.me/ChessValue" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <span className="text-lg">📱</span>
              <span className="hidden sm:inline">Rejoindre le Telegram</span>
              <span className="sm:hidden">Telegram</span>
            </a>
          </div>
        </div>
      </div>

      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        projectName="Chess Value"
        position={selectedPosition}
        tiktokPlaceholder="@chessvalue_pseudo"
      />
    </div>
  );
}