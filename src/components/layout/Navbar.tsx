import React from 'react';
import { Home, Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a 
            href="/"
            to="/" 
            className="flex items-center space-x-2 text-xl sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span>Romain FLG</span>
          </a>

          <div className="flex items-center space-x-3">
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