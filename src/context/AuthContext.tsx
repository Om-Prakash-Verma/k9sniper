import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { UserProfile } from '../types/index';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isUnverifiedAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isUnverifiedAdmin: false,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUnverifiedAdmin, setIsUnverifiedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          let role: 'admin' | 'client' = 'client';
          if (userDoc.exists()) {
            role = userDoc.data().role as 'admin' | 'client';
          } else {
            const userData: Omit<UserProfile, 'uid'> = {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'client',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', currentUser.uid), userData);
          }

          const isRoleAdmin = role === 'admin';
          setIsUnverifiedAdmin(isRoleAdmin && !currentUser.emailVerified);
          setIsAdmin(isRoleAdmin && currentUser.emailVerified);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          setIsUnverifiedAdmin(false);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setIsUnverifiedAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isUnverifiedAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
