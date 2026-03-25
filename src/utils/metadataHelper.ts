import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const updateMetadata = async (collectionName: 'pets' | 'products') => {
  try {
    const docRef = doc(db, 'metadata', collectionName);
    const docSnap = await getDoc(docRef);
    const currentVersion = docSnap.exists() ? (docSnap.data().version || 0) : 0;
    
    await setDoc(docRef, {
      lastUpdated: serverTimestamp(),
      version: currentVersion + 1
    }, { merge: true });
  } catch (error) {
    console.error(`Failed to update metadata for ${collectionName}:`, error);
  }
};

export const getMetadata = async (collectionName: 'pets' | 'products') => {
  try {
    const docSnap = await getDoc(doc(db, 'metadata', collectionName));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error(`Failed to get metadata for ${collectionName}:`, error);
    return null;
  }
};
