import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const updateMetadata = async (collectionName: 'pets' | 'products', version = 1) => {
  try {
    await setDoc(doc(db, 'metadata', collectionName), {
      lastUpdated: serverTimestamp(),
      version: version
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
