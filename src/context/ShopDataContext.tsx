import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDoc, 
  doc,
  Timestamp,
  where,
  setDoc,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { getMetadata } from '../utils/metadataHelper';
import { shopDb } from '../db/shopDb';
import { Pet, Product, ShopSettings } from '../types';
import { PAGE_SIZE, SYNC_INTERVAL, MAX_CACHE_SIZE } from '../constants';

interface ShopDataContextType {
  pets: Pet[];
  products: Product[];
  metadata: {
    pets?: { version: number; lastUpdated: any };
    products?: { version: number; lastUpdated: any };
  };
  shopSettings: ShopSettings;
  updateShopSettings: (settings: ShopSettings) => Promise<void>;
  loading: boolean;
  loadingMore: boolean;
  hasMorePets: boolean;
  hasMoreProducts: boolean;
  loadMorePets: () => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  refreshData: (force?: boolean) => Promise<void>;
  searchPets: (query: string) => Promise<Pet[]>;
  searchProducts: (query: string) => Promise<Product[]>;
  error: string | null;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<ShopDataContextType['metadata']>({});
  const [shopSettings, setShopSettings] = useState<ShopSettings>({
    deliveryFeeThreshold: 1000,
    fixedDeliveryFee: 100
  });
  const [lastPetDoc, setLastPetDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastProductDoc, setLastProductDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMorePets, setHasMorePets] = useState(true);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request deduplication and retry state
  const isFetchingPets = useRef(false);
  const isFetchingProducts = useRef(false);
  const retryCount = useRef({ pets: 0, products: 0 });

  // Load from IndexedDB on mount
  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch settings first
        let cachedSettings = null;
        if (shopDb.isOpen()) {
          cachedSettings = await shopDb.settings.get('shop');
        }
        
        if (cachedSettings) {
          const { id, ...settings } = cachedSettings;
          setShopSettings(settings as ShopSettings);
        }

        const settingsSnap = await getDoc(doc(db, 'settings', 'shop'));
        if (settingsSnap.exists()) {
          const remoteSettings = settingsSnap.data() as ShopSettings;
          setShopSettings(remoteSettings);
          if (shopDb.isOpen()) {
            await shopDb.settings.put({ id: 'shop', ...remoteSettings });
          }
        }

        // Ensure DB is open
        await shopDb.safeOpen();

        // Fetch from IDB with ordering
        let cachedPets: Pet[] = [];
        let cachedProducts: Product[] = [];

        if (shopDb.isOpen()) {
          cachedPets = await shopDb.pets.orderBy('name').toArray();
          cachedProducts = await shopDb.products.orderBy('name').toArray();
        }
        
        if (cachedPets.length > 0) setPets(cachedPets);
        if (cachedProducts.length > 0) setProducts(cachedProducts);
        
        // Initial check for updates (SWR)
        await Promise.all([
          checkUpdates('pets'),
          checkUpdates('products')
        ]);
      } catch (err) {
        console.error('Failed to initialize data from IndexedDB:', err);
        // Fallback to direct fetch if IDB fails
        await Promise.all([fetchInitialData('pets'), fetchInitialData('products')]);
      } finally {
        setLoading(false);
      }
    };

    initData();

    // Periodic Background Sync
    const interval = setInterval(() => {
      checkUpdates('pets');
      checkUpdates('products');
    }, SYNC_INTERVAL);

    // Sync on Tab Visibility Change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUpdates('pets');
        checkUpdates('products');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkUpdates = async (type: 'pets' | 'products', force = false) => {
    const isFetching = type === 'pets' ? isFetchingPets : isFetchingProducts;
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const remoteMetadata = await getMetadata(type);
      let localMetadata = null;
      
      if (shopDb.isOpen()) {
        localMetadata = await shopDb.metadata.get(type);
      }

      if (!remoteMetadata) {
        const currentData = type === 'pets' ? pets : products;
        if (currentData.length === 0) await fetchInitialData(type);
        return;
      }

      // Update metadata state
      setMetadata(prev => ({
        ...prev,
        [type]: {
          version: remoteMetadata.version || 1,
          lastUpdated: remoteMetadata.lastUpdated
        }
      }));

      const remoteLastUpdated = remoteMetadata.lastUpdated?.toMillis() || 0;
      const remoteVersion = remoteMetadata.version || 1;
      
      const localLastUpdated = localMetadata?.lastUpdated || 0;
      const localVersion = localMetadata?.version || 0;

      const needsRefresh = force || 
                           remoteVersion > localVersion || 
                           remoteLastUpdated > localLastUpdated || 
                           (type === 'pets' ? pets.length === 0 : products.length === 0);

      if (needsRefresh) {
        // If version changed or cache empty, full fetch. Otherwise, delta sync.
        if (remoteVersion > localVersion || (type === 'pets' ? pets.length === 0 : products.length === 0)) {
          await fetchInitialData(type);
        } else {
          await performDeltaSync(type, localLastUpdated);
        }

        // Update local metadata
        if (shopDb.isOpen()) {
          await shopDb.metadata.put({
            id: type,
            lastUpdated: remoteLastUpdated,
            version: remoteVersion
          });
        }
        
        // Reset retry count on success
        retryCount.current[type] = 0;
      }
    } catch (err) {
      console.error(`Update check failed for ${type}:`, err);
      // Exponential backoff retry
      if (retryCount.current[type] < 5) {
        const delay = Math.pow(2, retryCount.current[type]) * 1000;
        retryCount.current[type]++;
        setTimeout(() => checkUpdates(type, force), delay);
      }
    } finally {
      isFetching.current = false;
    }
  };

  const performDeltaSync = async (type: 'pets' | 'products', lastSyncTime: number) => {
    try {
      const lastSyncDate = new Date(lastSyncTime).toISOString();
      const q = query(
        collection(db, type), 
        where('updatedAt', '>', lastSyncDate),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return;

      const updatedDocs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        lastAccessed: Date.now() 
      } as any)); // We use any here because Firestore data is untyped by default, but we cast to Pet/Product later

      // Update both in-memory and IDB
      if (type === 'pets') {
        const updatedPets = [...pets];
        updatedDocs.forEach(doc => {
          const index = updatedPets.findIndex(p => p.id === doc.id);
          if (index > -1) updatedPets[index] = doc;
          else updatedPets.unshift(doc);
        });
        setPets(updatedPets.sort((a, b) => a.name.localeCompare(b.name)));
        await shopDb.pets.bulkPut(updatedDocs);
      } else {
        const updatedProducts = [...products];
        updatedDocs.forEach(doc => {
          const index = updatedProducts.findIndex(p => p.id === doc.id);
          if (index > -1) updatedProducts[index] = doc;
          else updatedProducts.unshift(doc);
        });
        setProducts(updatedProducts.sort((a, b) => a.name.localeCompare(b.name)));
        await shopDb.products.bulkPut(updatedDocs);
      }
      
      // Perform LRU eviction
      await evictOldCache(type);
    } catch (err) {
      console.error(`Delta sync failed for ${type}:`, err);
      throw err;
    }
  };

  const fetchInitialData = async (type: 'pets' | 'products') => {
    try {
      const q = query(collection(db, type), orderBy('name'), limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const newData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        lastAccessed: Date.now() 
      } as any));
      
      if (type === 'pets') {
        setPets(newData);
        setLastPetDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMorePets(snapshot.docs.length === PAGE_SIZE);
        if (shopDb.isOpen()) {
          await shopDb.pets.clear();
          await shopDb.pets.bulkAdd(newData);
        }
      } else {
        setProducts(newData);
        setLastProductDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreProducts(snapshot.docs.length === PAGE_SIZE);
        if (shopDb.isOpen()) {
          await shopDb.products.clear();
          await shopDb.products.bulkAdd(newData);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${type}_initial`);
      setError(`Failed to load ${type}`);
    }
  };

  const evictOldCache = async (type: 'pets' | 'products') => {
    const table = type === 'pets' ? shopDb.pets : shopDb.products;
    const count = await table.count();
    if (count > MAX_CACHE_SIZE) {
      const toDelete = await table
        .orderBy('lastAccessed')
        .limit(count - MAX_CACHE_SIZE)
        .primaryKeys();
      await table.bulkDelete(toDelete);
    }
  };

  const loadMorePets = async () => {
    if (loadingMore || !hasMorePets || !lastPetDoc) return;
    setLoadingMore(true);
    try {
      const petsQuery = query(
        collection(db, 'pets'), 
        orderBy('name'), 
        startAfter(lastPetDoc), 
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(petsQuery);
      const morePets = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        lastAccessed: Date.now() 
      } as unknown as Pet));
      
      const updatedPets = [...pets, ...morePets];
      setPets(updatedPets);
      setLastPetDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMorePets(snapshot.docs.length === PAGE_SIZE);
      
      await shopDb.pets.bulkPut(morePets);
      await evictOldCache('pets');
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'pets_more');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMoreProducts || !lastProductDoc) return;
    setLoadingMore(true);
    try {
      const productsQuery = query(
        collection(db, 'products'), 
        orderBy('name'), 
        startAfter(lastProductDoc), 
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(productsQuery);
      const moreProducts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        lastAccessed: Date.now() 
      } as unknown as Product));
      
      const updatedProducts = [...products, ...moreProducts];
      setProducts(updatedProducts);
      setLastProductDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreProducts(snapshot.docs.length === PAGE_SIZE);
      
      await shopDb.products.bulkPut(moreProducts);
      await evictOldCache('products');
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'products_more');
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshData = async (force = false) => {
    setLoading(true);
    await Promise.all([
      checkUpdates('pets', force),
      checkUpdates('products', force)
    ]);
    setLoading(false);
  };

  const searchPets = useCallback(async (query: string): Promise<Pet[]> => {
    if (!query) return pets;
    return await shopDb.pets
      .filter(pet => 
        pet.name.toLowerCase().includes(query.toLowerCase()) || 
        pet.description.toLowerCase().includes(query.toLowerCase())
      )
      .toArray();
  }, [pets]);

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    if (!query) return products;
    return await shopDb.products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase())
      )
      .toArray();
  }, [products]);

  const updateShopSettings = async (newSettings: ShopSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'shop'), newSettings);
      setShopSettings(newSettings);
      if (shopDb.isOpen()) {
        await shopDb.settings.put({ id: 'shop', ...newSettings });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/shop');
      throw err;
    }
  };

  return (
    <ShopDataContext.Provider value={{ 
      pets, 
      products, 
      metadata,
      shopSettings,
      updateShopSettings,
      loading, 
      loadingMore,
      hasMorePets,
      hasMoreProducts,
      loadMorePets,
      loadMoreProducts,
      refreshData,
      searchPets,
      searchProducts,
      error 
    }}>
      {children}
    </ShopDataContext.Provider>
  );
};

export const useShopData = () => {
  const context = useContext(ShopDataContext);
  if (!context) throw new Error('useShopData must be used within a ShopDataProvider');
  return context;
};
