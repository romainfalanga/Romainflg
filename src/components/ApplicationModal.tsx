import React, { useState } from 'react';
import { X, Send, User, Mail, Briefcase, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  preselectedPosition?: 'COO' | 'CM';
}

export default function ApplicationModal({ isOpen, onClose, projectName, preselectedPosition = 'COO' }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: preselectedPosition,
    motivation: '',
    creativity: '',
    universeModel: '',
    tiktok: '',
    telegram: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mettre à jour la position quand elle change
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, position: preselectedPosition }));
  }, [preselectedPosition]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the edge function to send email and store application
      const { data, error } = await supabase.functions.invoke('send-application-email', {
        body: {
          project_name: projectName,
          name: formData.name,
          email: formData.email,
          position: formData.position,
          telegram: formData.telegram,
          tiktok: formData.tiktok || null,
          motivation: formData.motivation,
          creativity: formData.creativity || null,
          universe_model: formData.universeModel || null,
        },
      });

      if (error) {
        throw error;
      }

      console.log('Application submitted successfully:', data);
      setIsSubmitted(true);
      
      // Fermer le modal après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          position: 'COO',
          motivation: '',
          creativity: '',
          universeModel: '',
          tiktok: '',
          telegram: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Erreur lors de l\'envoi de la candidature. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Candidature envoyée !</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Votre candidature a été envoyée automatiquement à Romain ! Vous recevrez une réponse par email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 pr-4">Postuler pour {projectName}</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </button>
        </div>

        {/* Info Section */}
        <div className="p-4 sm:p-6 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">💡 Conseil pour maximiser vos chances</h3>
              <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                Rejoignez le Telegram pour vous démarquer ! Partagez vos TikToks, proposez des idées innovantes et montrez votre valeur ajoutée. C'est le meilleur moyen de prouver votre motivation et vos compétences.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                <span>Nom complet *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4" />
                <span>Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Poste souhaité */}
          <div>
            <label className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="h-4 w-4" />
              <span>Poste souhaité *</span>
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="COO">COO - Directeur des Opérations (15%)</option>
              <option value="CM">CM - Community Manager (5%)</option>
            </select>
          </div>

          {/* Réseaux sociaux */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                Nom Telegram *
              </label>
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="@votre_nom_telegram"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                TikTok (optionnel)
              </label>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="@votre_tiktok"
              />
            </div>
          </div>

          {/* Motivation */}
          <div>
            <label className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4" />
              <span>Motivation *</span>
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              placeholder="Pourquoi voulez-vous rejoindre ce projet ? Quelle valeur pouvez-vous apporter ?"
            />
          </div>

          {/* Créativité */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Définir la créativité (optionnel)
            </label>
            <textarea
              name="creativity"
              value={formData.creativity}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              placeholder="Comment définissez-vous la créativité ? Comment pensez-vous qu'elle fonctionne ? Que faites-vous pour la provoquer ou la stimuler ? Donnez votre vision personnelle..."
            />
          </div>

          {/* Modèle d'univers */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Imaginez un modèle d'univers créatif (optionnel)
            </label>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Créez un univers imaginaire qui n'a pas besoin de correspondre au nôtre. L'objectif est d'observer votre façon d'imaginer et de connecter vos idées. Vous pouvez lire l'exemple ci-dessous pour mieux comprendre l'exercice.
            </p>
            <textarea
              name="universeModel"
              value={formData.universeModel}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              placeholder="Dans ce modèle, toutes les galaxies sont les souvenirs de « Dieu ». Chaque galaxie possède en son centre un trou noir, sauf une : la galaxie du présent, unique, qui abrite un trou blanc.

Ce trou blanc a un double rôle : il maintient les astres en orbite et expulse directement les astres collectées par tous les autres trous noirs de l'univers.

Une fois que la galaxie du présent est suffisamment remplie, un nouveau trou blanc apparaît quelque part dans l'univers. Ce nouvel astre devient le cœur de la nouvelle galaxie du présent, tandis que celle qui l'était juste avant, devient une des galaxies du passé.

Dans ce modèle, le passé et le futur sont une seule et même chose : chaque souvenir, chaque galaxie du passé est aussi un fragment du futur, et chaque futur nourrit, à son tour, la galaxie du présent.

Ce modèle d'univers a été pensé autour du biais cognitif d'heuristique de disponibilité : plus un souvenir est facilement accessible, plus il influence nos choix et notre perception du présent. De la même manière, dans cet univers, les astres les plus proches des trous noirs des galaxies du passé sont plus susceptibles d'entrer dans la galaxie du présent.

Dans ce modèle d'univers, « Dieu » est en quelque sorte dans un rêve, à la fois l'environnement et l'architecte de ce qu'il est en train de construire. Le futur et le passé sont prédéfini dans ce monde ou le destin semble inévitable."
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Envoyer ma candidature</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}