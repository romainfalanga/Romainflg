import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Target, Trophy } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 -z-10"></div>
        
        {/* Mobile: Logo section first */}
        <div className="lg:hidden">
          <div className="h-48 w-full gradient-bg flex items-center justify-center relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-bounce-subtle"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/10 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
            
            <img 
              src="/logos/FLG.png" 
              alt="FLG Logo" 
              className="w-24 h-24 object-contain drop-shadow-2xl animate-glow relative z-10"
            />
          </div>
        </div>

        {/* Desktop: Traditional layout */}
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-4 sm:pb-8 md:pb-12 lg:max-w-2xl lg:w-full lg:pb-16 xl:pb-20">
            <main className="mt-4 mx-auto max-w-7xl px-4 sm:mt-8 sm:px-6 md:mt-12 lg:mt-16 lg:px-8 xl:mt-20 animate-fade-in">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                  <span className="block">Bienvenue sur</span>
                  <span className="block text-primary-600 xl:inline">
                    Romain FLG
                  </span>
                </h1>
              </div>
            </main>
          </div>
        </div>
        
        {/* Desktop: Logo section on the right */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-full w-full gradient-bg flex items-center justify-center relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-subtle"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
            
            <img 
              src="/logos/FLG.png" 
              alt="FLG Logo" 
              className="w-40 h-40 object-contain drop-shadow-2xl animate-glow relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Draft Chess - Projet 4 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 animate-slide-up">
              <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
                <img 
                  src="/logos/DraftChess.png"
                  alt="Draft Chess"
                  className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs sm:text-sm font-semibold text-primary-600 bg-primary-50 px-2 sm:px-3 py-1 rounded-full">Projet 4</div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Draft Chess</h3>
                <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                  L'échiquier où la partie commence avant le premier coup, en plaçant vos pièces tour à tour avec votre adversaire.
                </p>
                <Link 
                  to="/projects/draft-chess" 
                  className="btn-primary w-full text-center inline-flex items-center justify-center text-sm sm:text-base"
                >
                  Voir le projet
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Chess 100 - Projet 3 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
                <img 
                  src="/logos/Chess100.png"
                  alt="Chess 100"
                  className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs sm:text-sm font-semibold text-primary-600 bg-primary-50 px-2 sm:px-3 py-1 rounded-full">Projet 3</div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Chess 100</h3>
                <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                  Atteignez la 100e rangée sur un plateau 100 x 8. Créez vos parcours, relevez ceux des autres et devenez le plus rapide.
                </p>
                <Link 
                  to="/projects/chess-100" 
                  className="btn-primary w-full text-center inline-flex items-center justify-center text-sm sm:text-base"
                >
                  Voir le projet
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Chess 13 - Projet 2 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
                <img 
                  src="/logos/Chess13.png"
                  alt="Chess 13"
                  className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs sm:text-sm font-semibold text-primary-600 bg-primary-50 px-2 sm:px-3 py-1 rounded-full">Projet 2</div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Chess 13</h3>
                <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                  Un plateau de 13 x 13. Un attaquant aux bords, un défenseur au centre. Préparez votre stratégie positionnelle et matez votre adversaire !
                </p>
                <Link 
                  to="/projects/chess-13" 
                  className="btn-primary w-full text-center inline-flex items-center justify-center text-sm sm:text-base"
                >
                  Voir le projet
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Chess Value - Projet 1 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
                <img 
                  src="/logos/ChessValue.png"
                  alt="Chess Value"
                  className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs sm:text-sm font-semibold text-primary-600 bg-primary-50 px-2 sm:px-3 py-1 rounded-full">Projet 1</div>
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Chess Value</h3>
                <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                  Chess Value évalue en temps réel la valeur des pièces selon la position, pour analyser et améliorer vos stratégies aux échecs.
                </p>
                <Link 
                  to="/projects/chess-value" 
                  className="btn-primary w-full text-center inline-flex items-center justify-center text-sm sm:text-base"
                >
                  Voir le projet
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">4</div>
              <div className="text-sm sm:text-base text-gray-600">Projets Innovants</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">0</div>
              <div className="text-sm sm:text-base text-gray-600">Nombre de comptes créés</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">0</div>
              <div className="text-sm sm:text-base text-gray-600">Community Managers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}