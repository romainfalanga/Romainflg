import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  runTransaction
} from 'firebase/firestore';
import { db, type Credits, type CreditTransaction } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCredits();
      fetchTransactions();
    } else {
      setCredits(null);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCredits = async () => {
    if (!user) return;

    try {
      const creditsDoc = await getDoc(doc(db, 'credits', user.uid));

      if (creditsDoc.exists()) {
        const creditsData = creditsDoc.data() as Credits;
        setCredits(creditsData);
      } else {
        // Créer les crédits s'ils n'existent pas
        const newCredits: Credits = {
          id: user.uid,
          user_id: user.uid,
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'credits', user.uid), newCredits);
        setCredits(newCredits);
      }
    } catch (error) {
      console.error('❌ Erreur récupération crédits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      // Requête simplifiée sans orderBy pour éviter l'index composite
      const transactionsQuery = query(
        collection(db, 'credit_transactions'),
        where('user_id', '==', user.uid),
        limit(10)
      );

      const querySnapshot = await getDocs(transactionsQuery);
      const transactionsData: CreditTransaction[] = [];

      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as CreditTransaction);
      });

      // Trier côté client par date de création (plus récent en premier)
      const sortedTransactions = transactionsData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('❌ Erreur récupération transactions:', error);
    }
  };

  const purchaseCredits = async (amount: number, description: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      await runTransaction(db, async (transaction) => {
        // Lire les crédits actuels
        const creditsRef = doc(db, 'credits', user.uid);
        const creditsDoc = await transaction.get(creditsRef);
        
        const currentBalance = creditsDoc.exists() ? creditsDoc.data().balance : 0;
        const newBalance = currentBalance + amount;

        // Mettre à jour le solde
        transaction.update(creditsRef, {
          balance: newBalance,
          updated_at: new Date().toISOString()
        });

        // Ajouter la transaction
        const transactionRef = doc(collection(db, 'credit_transactions'));
        transaction.set(transactionRef, {
          user_id: user.uid,
          amount,
          type: 'purchase',
          description,
          created_at: new Date().toISOString()
        });
      });

      // Rafraîchir les données
      await fetchCredits();
      await fetchTransactions();

      return { error: null };
    } catch (error) {
      console.error('❌ Erreur achat crédits:', error);
      return { error };
    }
  };

  const spendCredits = async (amount: number, description: string) => {
    if (!user) return { error: new Error('No user logged in') };
    if (!credits || credits.balance < amount) {
      return { error: new Error('Insufficient credits') };
    }

    try {
      await runTransaction(db, async (transaction) => {
        // Lire les crédits actuels
        const creditsRef = doc(db, 'credits', user.uid);
        const creditsDoc = await transaction.get(creditsRef);
        
        const currentBalance = creditsDoc.data()?.balance || 0;
        
        if (currentBalance < amount) {
          throw new Error('Insufficient credits');
        }

        const newBalance = currentBalance - amount;

        // Mettre à jour le solde
        transaction.update(creditsRef, {
          balance: newBalance,
          updated_at: new Date().toISOString()
        });

        // Ajouter la transaction
        const transactionRef = doc(collection(db, 'credit_transactions'));
        transaction.set(transactionRef, {
          user_id: user.uid,
          amount: -amount,
          type: 'spend',
          description,
          created_at: new Date().toISOString()
        });
      });

      // Rafraîchir les données
      await fetchCredits();
      await fetchTransactions();

      return { error: null };
    } catch (error) {
      console.error('❌ Erreur dépense crédits:', error);
      return { error };
    }
  };

  return {
    credits,
    transactions,
    loading,
    purchaseCredits,
    spendCredits,
    refresh: () => {
      fetchCredits();
      fetchTransactions();
    }
  };
}