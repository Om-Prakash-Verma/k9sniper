import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  Package, 
  ShoppingCart, 
  Settings,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useShopData } from '../context/ShopDataContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { updateMetadata } from '../utils/metadataHelper';

// Import Manager Components
import PetManager from './admin/PetManager';
import ProductManager from './admin/ProductManager';
import OrderManager from './admin/OrderManager';
import SettingsManager from './admin/SettingsManager';
import Notification, { NotificationType } from './Notification';
import ConfirmationModal from './ConfirmationModal';

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const { pets, products, metadata } = useShopData();
  const [activeTab, setActiveTab] = useState<'pets' | 'products' | 'orders' | 'settings'>('pets');
  const [orders, setOrders] = useState<any[]>([]);
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string, type: 'pets' | 'products' } | null>(null);

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  };

  // Fetch orders in real-time
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;
    try {
      await deleteDoc(doc(db, type, id));
      await updateMetadata(type);
      showNotification('Item deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      showNotification('Failed to delete item.', 'error');
      handleFirestoreError(error, OperationType.DELETE, `${type}/${id}`);
    }
  };

  const tabs = [
    { id: 'pets', label: 'Pets', icon: Dog },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-brand-bg-secondary border-b md:border-b-0 md:border-r border-brand-accent-secondary/5 flex flex-col">
        <div className="p-8">
          <h1 className="text-3xl font-display font-bold text-brand-primary uppercase tracking-tighter italic">
            K9 SNIPERS<br/>
            <span className="text-brand-accent not-italic">ADMIN</span>
          </h1>
          <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest mt-2">Control Center v2.0</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-accent text-brand-bg-secondary shadow-lg shadow-brand-accent/20' 
                  : 'text-brand-text/60 hover:bg-brand-accent/5 hover:text-brand-primary'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-brand-accent-secondary/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {activeTab === 'pets' && (
            <PetManager 
              pets={pets} 
              onNotification={showNotification} 
              onDeleteConfirm={(id, name) => setDeleteConfirm({ id, name, type: 'pets' })} 
            />
          )}
          {activeTab === 'products' && (
            <ProductManager 
              products={products} 
              onNotification={showNotification} 
              onDeleteConfirm={(id, name) => setDeleteConfirm({ id, name, type: 'products' })} 
            />
          )}
          {activeTab === 'orders' && <OrderManager orders={orders} />}
          {activeTab === 'settings' && <SettingsManager metadata={metadata} />}
        </motion.div>
      </main>

      {/* Modals and Notifications */}
      <ConfirmationModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      <AnimatePresence>
        {notification && (
          <Notification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
