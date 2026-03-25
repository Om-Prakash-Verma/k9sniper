import React, { useState, useEffect } from 'react';
import SEO from './SEO';
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

import DashboardLayout from './DashboardLayout';

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const { pets, products, metadata, refreshData } = useShopData();
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
      await refreshData(true);
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
    <DashboardLayout
      title="ADMIN"
      subtitle="Control Center v2.0"
      navItems={tabs as any}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={logout}
    >
      <SEO title="Admin Panel | K9 Sniper" />
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
            onRefresh={refreshData}
          />
        )}
        {activeTab === 'products' && (
          <ProductManager 
            products={products} 
            onNotification={showNotification} 
            onDeleteConfirm={(id, name) => setDeleteConfirm({ id, name, type: 'products' })} 
            onRefresh={refreshData}
          />
        )}
        {activeTab === 'orders' && <OrderManager orders={orders} />}
        {activeTab === 'settings' && <SettingsManager metadata={metadata} />}
      </motion.div>

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
    </DashboardLayout>
  );
};

export default AdminPanel;
