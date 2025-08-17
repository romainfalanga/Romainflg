import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  position: string;
  tiktokPlaceholder?: string;
}

export function ApplicationModal({ isOpen, onClose, projectName, position, tiktokPlaceholder = "@projet_pseudo" }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    telegramName: '',
    tiktokUsername: '',
    motivation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on pourrait envoyer les données à un serveur
    console.log('Candidature soumise:', { projectName, position, ...formData });
    alert('Candidature envoyée avec succès !');
    onClose();
    setFormData({
      fullName: '',
      email: '',
      telegramName: '',
      tiktokUsername: '',
      motivation: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
          <h2 className="text-2xl font-bold text-gray-900">
            Postuler pour {projectName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Position Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Poste : Community Manager (1€ par code utilisé)</h3>
                <p className="text-gray-600">
                  Pour devenir un des CM du projet, vous devrez publier régulièrement sur TikTok à propos du projet. Vous pouvez même créer un compte TikTok dédié exclusivement au projet et vous démarquer par votre créativité.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary-50 to-primary-50 border border-secondary-200 rounded-xl p-6 mb-6">
              <p className="text-secondary-800 leading-relaxed">
                En échange de cet investissement créatif et communautaire, vous recevrez <strong>un code promo personnel et toucherez 1€ de commission sur toutes les ventes où votre code promo a été utilisé</strong>.
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Conseil pour maximiser vos chances</h3>
                <p className="text-gray-600">
                  Rejoignez le Telegram pour vous démarquer ! Partagez vos TikToks, proposez des idées innovantes et montrez votre valeur ajoutée. 
                  C'est le meilleur moyen de prouver votre motivation et vos compétences.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nom Telegram *
                </label>
                <input
                  type="text"
                  required
                  value={formData.telegramName}
                  onChange={(e) => setFormData({ ...formData, telegramName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="@votre_nom_telegram"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nom d'utilisateur TikTok *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tiktokUsername}
                  onChange={(e) => setFormData({ ...formData, tiktokUsername: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder={tiktokPlaceholder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Motivation *
              </label>
              <textarea
                required
                rows={4}
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-300"
                placeholder="Pourquoi voulez-vous rejoindre ce projet ? Quelle valeur pouvez-vous apporter ?"
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                Envoyer ma candidature
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}