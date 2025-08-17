import React, { useState } from 'react';
import { CreditCard, Plus, History, TrendingUp, Calendar, Check } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';
import { useAuth } from '../hooks/useAuth';

const creditPackages = [
  { amount: 100, price: 9.99, popular: false },
  { amount: 500, price: 39.99, popular: true },
  { amount: 1000, price: 69.99, popular: false },
  { amount: 2500, price: 149.99, popular: false },
];

export function CreditsPage() {
  const { user } = useAuth();
  const { credits, transactions, loading, purchaseCredits } = useCredits();
  const [selectedPackage, setSelectedPackage] = useState<typeof creditPackages[0] | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async (pkg: typeof creditPackages[0]) => {
    setSelectedPackage(pkg);
    setShowPurchase(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPackage) return;

    setPurchasing(true);
    try {
      const { error } = await purchaseCredits(
        selectedPackage.amount,
        `Achat de ${selectedPackage.amount} crédits pour ${selectedPackage.price}€`
      );

      if (error) {
        alert('Erreur lors de l\'achat des crédits');
      } else {
        setShowPurchase(false);
        setSelectedPackage(null);
      }
    } catch (error) {
      alert('Une erreur est survenue');
    } finally {
      setPurchasing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Connectez-vous pour accéder à vos crédits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-4">
          Mes Crédits
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          Gérez vos crédits universels utilisables sur tous les projets Romain FLG
        </p>
        <div className="mt-4 w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg">Chargement de vos crédits...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Current Balance */}
          <div className="animate-slide-up">
            <div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl animate-glow relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-bold">Solde actuel</h2>
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                  {credits?.balance || 0} crédits
                </div>
                <p className="text-white/80 text-xs sm:text-sm">
                  Mis à jour le {credits?.updated_at ? new Date(credits.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 sm:mt-8 space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total dépensé ce mois</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {transactions
                        .filter(t => t.type === 'spend' && 
                          new Date(t.created_at).getMonth() === new Date().getMonth())
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0)} crédits
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Packages & History */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Purchase Credits */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center mb-6 sm:mb-8">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Acheter des crédits</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {creditPackages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl border-2 p-8 cursor-pointer card-hover transition-all duration-300 ${
                      pkg.popular 
                        ? 'border-primary-500 ring-2 sm:ring-4 ring-primary-100 shadow-2xl sm:scale-105' 
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-xl'
                    }`}
                    onClick={() => handlePurchase(pkg)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce-subtle">
                          ⭐ Populaire
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                        {pkg.amount} crédits
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-primary-600 mb-4">
                        {pkg.price}€
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-6">
                        {(pkg.price / pkg.amount * 100).toFixed(1)}¢ par crédit
                      </div>
                      <button className="btn-primary w-full group text-sm sm:text-base">
                        <span>Acheter</span>
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-6 sm:mb-8">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Historique des transactions</h2>
              </div>

              {transactions.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                  <div className="divide-y divide-gray-100">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                              transaction.type === 'purchase'
                                ? 'bg-gradient-to-r from-accent-400 to-accent-500'
                                : 'bg-gradient-to-r from-red-400 to-red-500'
                            }`}>
                              {transaction.type === 'purchase' ? (
                                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              ) : (
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-180" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                                {transaction.description}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {new Date(transaction.created_at).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className={`text-base sm:text-lg font-bold ${
                            transaction.type === 'purchase'
                              ? 'text-accent-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'purchase' ? '+' : ''}{transaction.amount} crédits
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-lg">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <History className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Aucune transaction</h3>
                  <p className="text-sm sm:text-base text-gray-600 px-4">
                    Vos transactions apparaîtront ici après votre premier achat
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchase && selectedPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-slide-up glass-effect">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Confirmer l'achat
            </h3>
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-primary-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Crédits:</span>
                <span className="font-bold text-base sm:text-lg">{selectedPackage.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Prix:</span>
                <span className="font-bold text-base sm:text-lg">{selectedPackage.price}€</span>
              </div>
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                <span>Total:</span>
                <span className="text-primary-600">{selectedPackage.price}€</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={confirmPurchase}
                disabled={purchasing}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm sm:text-base"
              >
                {purchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Confirmer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowPurchase(false);
                  setSelectedPackage(null);
                }}
                disabled={purchasing}
                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                Annuler
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 text-center bg-gray-50 rounded-lg p-3">
              Ceci est une simulation. Aucun paiement réel ne sera effectué.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}