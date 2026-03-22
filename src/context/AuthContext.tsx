import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { ADMIN_EMAIL } from '../constants';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isUnverifiedAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isUnverifiedAdmin: false,
  loading: true,
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
          const isHardcodedAdmin = currentUser.email === ADMIN_EMAIL;
          
          let role: 'admin' | 'client' = 'client';
          if (userDoc.exists()) {
            role = userDoc.data().role as 'admin' | 'client';
          } else {
            role = isHardcodedAdmin ? 'admin' : 'client';
            const userData: Omit<UserProfile, 'uid'> = {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', currentUser.uid), userData);
          }

          const isRoleAdmin = role === 'admin' || isHardcodedAdmin;
          setIsUnverifiedAdmin(isRoleAdmin && !currentUser.emailVerified);
          setIsAdmin(isRoleAdmin && currentUser.emailVerified);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          const isHardcoded = currentUser.email === ADMIN_EMAIL;
          setIsUnverifiedAdmin(isHardcoded && !currentUser.emailVerified);
          setIsAdmin(isHardcoded && currentUser.emailVerified);
        }
      } else {
        setIsAdmin(false);
        setIsUnverifiedAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isUnverifiedAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
