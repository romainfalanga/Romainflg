import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Calendar, Heart, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { getProfilePhoto } from '../config/profilePhotos';

export default function ProfilePage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
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

        {/* Profile Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Cover Image */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-12 sm:-mt-16 mb-4 sm:mb-6">
              <div className="relative">
                <img
                  src={getProfilePhoto('romain-falanga')}
                  alt="Romain Falanga"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Romain Falanga</h1>
              
              {/* About Text */}
              <div className="max-w-3xl mx-auto mt-6">
                <div className="prose prose-lg max-w-none text-left">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Toujours une idée d'avance.</strong> Romain ne se contente pas d'imaginer, il crée, teste, et transforme ses concepts en projets concrets. Qu'il s'agisse de jeux innovants, de nouveaux concepts, il aime surprendre et repousser les limites.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Son objectif est clair : vivre de sa créativité et emmener ses projets le plus loin possible. Romain croit que les idées ont plus de valeur quand elles sont partagées, et chaque projet est pensé comme une aventure collective où la communauté a un rôle à jouer.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Entrepreneuriat, imagination et détermination</strong> sont ses moteurs. Si un projet peut sembler fou, c'est probablement celui qui le motive le plus.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
}