import { useState, useEffect } from 'react';

const AUTHORIZED_IPS = [
  '2a02:8428:21dd:ca01:a19b:ce5d:6e97:1856', // Votre IPv6
  '127.0.0.1', // Localhost pour développement
  '::1', // IPv6 localhost
];

export function useIPAccess() {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userIP, setUserIP] = useState<string>('');

  useEffect(() => {
    checkIPAccess();
  }, []);

  const checkIPAccess = async () => {
    try {
      // En développement, on autorise toujours
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setHasAdminAccess(true);
        setUserIP('localhost');
        setLoading(false);
        return;
      }

      // Essayer plusieurs services pour obtenir l'IP
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json', // IPv6
        'https://ipapi.co/json/',
      ];

      let currentIP = '';
      
      for (const service of ipServices) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          currentIP = data.ip || data.query || '';
          if (currentIP) break;
        } catch (error) {
          console.log(`Service ${service} failed:`, error);
          continue;
        }
      }

      setUserIP(currentIP);
      
      // Vérifier si l'IP est autorisée
      const isAuthorized = AUTHORIZED_IPS.some(authorizedIP => {
        // Comparaison exacte
        if (currentIP === authorizedIP) return true;
        
        // Pour IPv6, on peut aussi vérifier le préfixe réseau
        if (authorizedIP.includes(':') && currentIP.includes(':')) {
          const authorizedPrefix = authorizedIP.split(':').slice(0, 4).join(':');
          const currentPrefix = currentIP.split(':').slice(0, 4).join(':');
          return authorizedPrefix === currentPrefix;
        }
        
        return false;
      });

      setHasAdminAccess(isAuthorized);
      
    } catch (error) {
      console.error('Erreur lors de la vérification IP:', error);
      setHasAdminAccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { hasAdminAccess, loading, userIP };
}