import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db, type User } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Auth state change:', firebaseUser ? 'Connecté' : 'Déconnecté');
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      console.log('👤 Récupération profil pour:', userId);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        console.log('✅ Profil récupéré:', userData);
        setProfile(userData);
      } else {
        console.log('⚠️ Profil non trouvé');
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur profil:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // 1. Vérifier si le username existe déjà
      const usernameQuery = query(
        collection(db, 'users'),
        where('username', '==', username)
      );
      const existingUsers = await getDocs(usernameQuery);

      if (!existingUsers.empty) {
        return { data: null, error: { message: 'Ce nom d\'utilisateur existe déjà' } };
      }

      // 2. Créer l'utilisateur Firebase Auth
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // 3. Créer le profil utilisateur dans Firestore
      const userProfile: User = {
        id: firebaseUser.uid,
        username,
        email,
        created_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

      // 4. Créer les crédits initiaux
      await setDoc(doc(db, 'credits', firebaseUser.uid), {
        id: firebaseUser.uid,
        user_id: firebaseUser.uid,
        balance: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return { data: { user: firebaseUser }, error: null };
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { data: result, error: null };
    } catch (error: any) {
      console.error('❌ Erreur connexion:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erreur déconnexion:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      // Mettre à jour Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updated_at: new Date().toISOString()
      });

      // Mettre à jour le state local
      setProfile(prev => prev ? { ...prev, ...updates } : null);

      return { data: updates, error: null };
    } catch (error: any) {
      console.error('❌ Erreur mise à jour profil:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
}