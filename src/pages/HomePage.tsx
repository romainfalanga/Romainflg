import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, TrendingUp, Heart } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function HomePage() {
  const { projects, loading } = useData();

  // Afficher le contenu même si le chargement prend du temps
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bienvenue sur
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Romain FLG
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-medium">
              Créativité • Innovation • Entrepreneuriat
            </p>
            <p className="text-2xl md:text-3xl text-blue-100 mb-4 font-semibold">
              Le site qui centralise tous mes projets
            </p>
          </div>
        </section>

        {/* Loading Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des projets...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Bienvenue sur
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Romain FLG
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-16 sm:gap-4 mt-0 mb-0">
          <div className="flex flex-row justify-center items-center gap-4 mt-2 mb-1">
            <a
              href="https://romainflg.fr/flg-pass"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400/20 w-32 sm:w-auto text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">FLG PASS</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
            <a
              href="https://romainflg.fr/credits"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 border border-emerald-400/20 w-32 sm:w-auto text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">CRÉDITS</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun projet disponible</h2>
              <p className="text-gray-600">Les projets seront bientôt disponibles !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...projects].reverse().map((project, index) => (
                <div 
                  key={project.id}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.name}
                     className="w-full h-48 sm:h-56 md:h-64 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300 p-4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Projet {projects.length - index}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                      {project.description.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < project.description.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    
                    <Link
                      to={`/project/${project.slug}`}
                      className="inline-flex items-center justify-center w-full sm:w-auto space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium group-hover:shadow-lg text-sm sm:text-base"
                    >
                      <span>Voir le projet</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}