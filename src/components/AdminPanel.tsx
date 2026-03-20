import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Dog, 
  Package, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  CheckCircle2,
  AlertCircle,
  Settings,
  User
} from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  setDoc
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useAuth } from '../context/AuthContext';
import { useShopData } from '../context/ShopDataContext';
import { slugify } from '../utils/slugify';

import { getImageUrl } from '../utils/imageHelper';
import { updateMetadata } from '../utils/metadataHelper';

import Notification, { NotificationType } from './Notification';
import ConfirmationModal from './ConfirmationModal';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const { pets: cachedPets, products: cachedProducts, loading: shopLoading, refreshData } = useShopData();
  const [activeTab, setActiveTab] = useState<'pets' | 'products' | 'orders' | 'settings'>('pets');
  const [pets, setPets] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [lastOrderDoc, setLastOrderDoc] = useState<any>(null);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [loadingMoreOrders, setLoadingMoreOrders] = useState(false);
  const ORDERS_PER_PAGE = 20;
  const [settings, setSettings] = useState<any>({ whatsapp: '', instagram: '' });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (cachedPets.length > 0) setPets(cachedPets);
    if (cachedProducts.length > 0) setProducts(cachedProducts);
  }, [cachedPets, cachedProducts]);

  useEffect(() => {
    // Only listen if user is logged in and is admin
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    // Initial orders fetch with limit
    const ordersQuery = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc'), 
      limit(ORDERS_PER_PAGE)
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(newOrders);
      setLastOrderDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreOrders(snapshot.docs.length === ORDERS_PER_PAGE);
    }, (error) => {
      console.error('Orders snapshot error:', error);
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    }, (error) => {
      console.error('Settings snapshot error:', error);
      handleFirestoreError(error, OperationType.GET, 'settings/general');
    });

    setLoading(false);
    return () => {
      unsubOrders();
      unsubSettings();
    };
  }, [user, isAdmin]);

  const openAddModal = () => {
    setFormData({});
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setFormData({ ...item });
    setIsEditing(true);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionName = activeTab === 'pets' ? 'pets' : 'products';
    try {
      // Basic validation
      const isPet = activeTab === 'pets';
      const requiredFields = isPet ? ['name', 'image', 'price'] : ['name', 'image', 'price'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        showNotification(`Please fill in all required fields (${missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')})`, 'error');
        return;
      }

      if (formData.price <= 0) {
        showNotification('Price must be greater than zero', 'error');
        return;
      }

      if (!isPet && formData.variations && formData.variations.some((v: any) => v.price <= 0)) {
        showNotification('All variation prices must be greater than zero', 'error');
        return;
      }

      const dataToSave: any = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (activeTab === 'pets') {
        dataToSave.slug = slugify(formData.name);
      }

      if (isEditing && editingId) {
        await updateDoc(doc(db, collectionName, editingId), dataToSave);
        showNotification(`${activeTab === 'pets' ? 'Pet' : 'Product'} updated successfully!`);
      } else {
        await addDoc(collection(db, collectionName), {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          status: activeTab === 'pets' ? (formData.status || 'available') : 'in-stock'
        });
        showNotification(`${activeTab === 'pets' ? 'Pet' : 'Product'} added successfully!`);
      }
      await updateMetadata(collectionName as 'pets' | 'products');
      await refreshData(true);
      setIsModalOpen(false);
      setFormData({});
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      showNotification('Failed to save changes. Please try again.', 'error');
      handleFirestoreError(error, isEditing ? OperationType.WRITE : OperationType.WRITE, collectionName);
    }
  };

  const handleDelete = async (id: string) => {
    const collectionName = activeTab === 'pets' ? 'pets' : 'products';
    try {
      await deleteDoc(doc(db, collectionName, id));
      await updateMetadata(collectionName as 'pets' | 'products');
      await refreshData(true);
      showNotification('Item deleted successfully!');
    } catch (error) {
      showNotification('Failed to delete item.', 'error');
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      showNotification('Settings saved successfully!');
    } catch (error) {
      showNotification('Failed to save settings.', 'error');
      handleFirestoreError(error, OperationType.WRITE, 'settings/general');
    } finally {
      setSavingSettings(false);
    }
  };

  const loadMoreOrders = async () => {
    if (!lastOrderDoc || loadingMoreOrders || !hasMoreOrders) return;

    setLoadingMoreOrders(true);
    try {
      const nextQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        startAfter(lastOrderDoc),
        limit(ORDERS_PER_PAGE)
      );

      const snapshot = await getDocs(nextQuery);
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (newOrders.length > 0) {
        setOrders(prev => [...prev, ...newOrders]);
        setLastOrderDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreOrders(snapshot.docs.length === ORDERS_PER_PAGE);
      } else {
        setHasMoreOrders(false);
      }
    } catch (error) {
      console.error('Error loading more orders:', error);
      showNotification('Failed to load more orders.', 'error');
    } finally {
      setLoadingMoreOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showNotification('Order status updated successfully!');
    } catch (error) {
      showNotification('Failed to update order status.', 'error');
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="micro-label text-brand-accent mb-2">Management Console</div>
            <h1 className="text-5xl font-display font-bold text-brand-primary uppercase tracking-tighter">Admin Dashboard</h1>
          </div>
          <div className="flex flex-wrap bg-brand-bg-secondary p-1 rounded-2xl border border-brand-accent-secondary/10">
            {[
              { id: 'pets', icon: Dog, label: 'Pets' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold uppercase text-[10px] md:text-xs tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-brand-accent text-brand-bg-secondary shadow-lg' 
                    : 'text-brand-text hover:bg-brand-accent/10'
                }`}
              >
                <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-brand-bg-secondary rounded-[3rem] border border-brand-accent-secondary/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">
              Manage {activeTab}
            </h2>
            {activeTab !== 'orders' && (
              <button 
                onClick={openAddModal}
                className="btn-premium px-6 py-3 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New {activeTab.slice(0, -1)}
              </button>
            )}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'settings' ? (
              <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-8">
                <div className="form-section-card">
                  <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Contact Settings</h3>
                      <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Manage WhatsApp and Instagram links</p>
                    </div>
                  </div>
                  <div className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">WhatsApp Number (with country code)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 919643797801"
                        className="admin-input" 
                        value={settings.whatsapp || ''}
                        onChange={e => setSettings({...settings, whatsapp: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Instagram Username</label>
                      <input 
                        type="text" 
                        placeholder="e.g. k9_snipers_petshop"
                        className="admin-input" 
                        value={settings.instagram || ''}
                        onChange={e => setSettings({...settings, instagram: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={savingSettings}
                  className="btn-premium px-10 py-4 rounded-2xl text-brand-bg-secondary font-bold uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            ) : activeTab === 'orders' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="border-b border-brand-accent-secondary/10">
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Order ID</th>
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Customer</th>
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Items</th>
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Amount</th>
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Status</th>
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Date</th>
                      <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-accent-secondary/5">
                    {orders.map(order => (
                      <tr key={order.id} className="group hover:bg-brand-accent/5 transition-colors">
                        <td className="py-4 font-mono text-xs text-brand-primary">{order.id.slice(-8).toUpperCase()}</td>
                        <td className="py-4">
                          <div className="text-brand-text font-bold text-sm">{order.deliveryInfo?.name || 'Anonymous'}</div>
                          <div className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">{order.deliveryInfo?.phone}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-brand-text text-xs">
                            {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'}
                          </div>
                          <div className="text-[10px] text-brand-text/40 font-bold uppercase truncate max-w-[150px]">
                            {order.items?.map((item: any) => item.name).join(', ')}
                          </div>
                        </td>
                        <td className="py-4 text-brand-primary font-bold">₹{order.amount?.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-brand-text/60 text-xs">
                          {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                            : order.createdAt 
                              ? new Date(order.createdAt).toLocaleDateString()
                              : 'N/A'
                          }
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hasMoreOrders && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={loadMoreOrders}
                      disabled={loadingMoreOrders}
                      className="px-8 py-3 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all disabled:opacity-50"
                    >
                      {loadingMoreOrders ? 'Loading...' : 'Load More Orders'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'pets' ? pets : products).map(item => (
                  <div key={item.id} className="bg-brand-bg p-4 md:p-6 rounded-3xl border border-brand-accent-secondary/10 group relative overflow-hidden">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-brand-bg-secondary">
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg md:text-xl font-display font-bold text-brand-primary uppercase tracking-tighter">{item.name}</h3>
                      <div className="text-brand-accent font-bold text-sm md:text-base">₹{item.price?.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-brand-accent/5 text-brand-text/60 rounded-lg text-[8px] font-bold uppercase tracking-widest">
                        {item.category}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${
                        item.status === 'available' || item.status === 'in-stock' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'sold' || item.status === 'out-of-stock' ? 'bg-red-500/10 text-red-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}>
                        {item.status?.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-brand-text/60 text-xs md:text-sm mb-6 line-clamp-2">{item.description}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="flex-1 py-3 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ id: item.id, name: item.name })}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Notifications */}
      <ConfirmationModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm.id)}
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-brand-bg w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
              <div>
                <div className="micro-label text-brand-accent mb-1">Order Details</div>
                <h2 className="text-3xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                  Order #{selectedOrder.id.slice(-8).toUpperCase()}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-brand-accent/10 rounded-2xl transition-colors group">
                <X className="text-brand-primary group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Status & Date */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Payment Status</div>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest outline-none border-none cursor-pointer ${
                      selectedOrder.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 
                      selectedOrder.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                      selectedOrder.status === 'delivered' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Order Date</div>
                  <div className="text-brand-primary font-bold">
                    {selectedOrder.createdAt?.seconds 
                      ? new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString()
                      : selectedOrder.createdAt 
                        ? new Date(selectedOrder.createdAt).toLocaleString()
                        : 'N/A'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Total Amount</div>
                  <div className="text-brand-accent font-bold text-xl">₹{selectedOrder.amount?.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Customer Info */}
                <div className="form-section-card">
                  <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5 mb-6">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-accent" />
                    </div>
                    <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Customer Info</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Name</div>
                      <div className="text-brand-primary font-bold">{selectedOrder.deliveryInfo?.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Email</div>
                      <div className="text-brand-primary font-bold">{selectedOrder.deliveryInfo?.email}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Phone</div>
                      <div className="text-brand-primary font-bold">{selectedOrder.deliveryInfo?.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="form-section-card">
                  <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5 mb-6">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-brand-accent" />
                    </div>
                    <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Delivery Address</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Address</div>
                      <div className="text-brand-primary font-bold leading-relaxed">{selectedOrder.deliveryInfo?.address}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">City</div>
                        <div className="text-brand-primary font-bold">{selectedOrder.deliveryInfo?.city}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Pincode</div>
                        <div className="text-brand-primary font-bold">{selectedOrder.deliveryInfo?.pincode}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="form-section-card">
                <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5 mb-6">
                  <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-accent" />
                  </div>
                  <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Order Items</h3>
                </div>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5">
                      <div>
                        <div className="text-brand-primary font-bold uppercase tracking-tight">{item.name}</div>
                        <div className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-brand-primary font-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-brand-bg-secondary/50 border-t border-brand-accent-secondary/10 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="btn-premium px-10 py-4 rounded-2xl text-brand-bg-secondary font-bold uppercase tracking-widest"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-brand-bg w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50 backdrop-blur-sm sticky top-0 z-10">
              <div>
                <div className="micro-label text-brand-accent mb-1">Inventory Management</div>
                <h2 className="text-3xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                  {isEditing ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-brand-accent/10 rounded-2xl transition-colors group">
                <X className="text-brand-primary group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Main Content Column */}
                <div className="lg:col-span-8 space-y-10">
                  {activeTab === 'pets' ? (
                    <>
                      {/* Basic Information Card */}
                      <div className="form-section-card">
                        <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                            <Dog className="w-5 h-5 text-brand-accent" />
                          </div>
                          <div>
                            <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Basic Information</h3>
                            <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Identify and categorize the pet</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Pet Name <span className="text-brand-accent">*</span></label>
                            <input 
                              required 
                              type="text" 
                              placeholder="e.g. Buddy"
                              className="admin-input" 
                              value={formData.name || ''}
                              onChange={e => setFormData({...formData, name: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Category <span className="text-brand-accent">*</span></label>
                            <select 
                              required 
                              className="admin-input" 
                              value={formData.category || ''}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                              <option value="">Select Category</option>
                              <option value="dog">Dog</option>
                              <option value="cat">Cat</option>
                              <option value="bird">Bird</option>
                              <option value="fish">Fish</option>
                              <option value="rabbit">Rabbit</option>
                              <option value="exotic">Exotic</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Breed</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Golden Retriever"
                              className="admin-input" 
                              value={formData.breed || ''}
                              onChange={e => setFormData({...formData, breed: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Color</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Golden / White"
                              className="admin-input" 
                              value={formData.color || ''}
                              onChange={e => setFormData({...formData, color: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Characteristics Card */}
                      <div className="form-section-card">
                        <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-brand-accent" />
                          </div>
                          <div>
                            <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Characteristics & Temperament</h3>
                            <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Define personality and care needs</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                          {[
                            { label: 'Energy Level', key: 'energyLevel', options: ['Low', 'Medium', 'High'] },
                            { label: 'Shedding', key: 'sheddingLevel', options: ['Low', 'Medium', 'High'] },
                            { label: 'Grooming', key: 'groomingNeeds', options: ['Low', 'Medium', 'High'] },
                            { label: 'Social', key: 'socialNeeds', options: ['Low', 'Medium', 'High'] },
                            { label: 'Training', key: 'trainingLevel', options: ['None', 'Basic', 'Advanced'] },
                            { label: 'Kids Friendly', key: 'goodWithKids', options: ['Yes', 'No', 'Supervised'] },
                          ].map((field) => (
                            <div key={field.key} className="space-y-2">
                              <label className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest ml-1">{field.label}</label>
                              <select 
                                className="admin-input py-2 text-xs" 
                                value={formData[field.key] || field.options[1]}
                                onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                              >
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Temperament Description</label>
                          <textarea 
                            rows={3} 
                            className="admin-input resize-none" 
                            placeholder="Describe the pet's personality, behavior with others, and any special quirks..." 
                            value={formData.temperament || ''}
                            onChange={e => setFormData({...formData, temperament: e.target.value})} 
                          />
                        </div>
                      </div>

                      {/* Health & Origin Card */}
                      <div className="form-section-card">
                        <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                          </div>
                          <div>
                            <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Health & Origin</h3>
                            <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Medical history and background</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Vaccination Status</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              placeholder="e.g. Fully Vaccinated, Up to date" 
                              value={formData.vaccinationStatus || ''}
                              onChange={e => setFormData({...formData, vaccinationStatus: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Health Status</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              placeholder="e.g. Excellent, No known issues" 
                              value={formData.healthStatus || ''}
                              onChange={e => setFormData({...formData, healthStatus: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Origin / Breeder</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              placeholder="e.g. Local Certified Breeder, Rescued" 
                              value={formData.origin || ''}
                              onChange={e => setFormData({...formData, origin: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Microchip ID</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              placeholder="e.g. 985112345678901"
                              value={formData.microchipId || ''}
                              onChange={e => setFormData({...formData, microchipId: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Life Expectancy</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              placeholder="e.g. 10 - 12 Years"
                              value={formData.lifeExpectancy || ''}
                              onChange={e => setFormData({...formData, lifeExpectancy: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Product Information Card */}
                      <div className="form-section-card">
                        <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-brand-accent" />
                          </div>
                          <div>
                            <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Product Information</h3>
                            <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Core product details and identification</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Product Name <span className="text-brand-accent">*</span></label>
                            <input 
                              required 
                              type="text" 
                              placeholder="e.g. Premium Kibble"
                              className="admin-input" 
                              value={formData.name || ''}
                              onChange={e => setFormData({...formData, name: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Category <span className="text-brand-accent">*</span></label>
                            <select 
                              required 
                              className="admin-input" 
                              value={formData.category || ''}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                              <option value="">Select Category</option>
                              <option value="Food">Food</option>
                              <option value="Accessories">Accessories</option>
                              <option value="Grooming">Grooming</option>
                              <option value="Health">Health</option>
                              <option value="Toys">Toys</option>
                              <option value="Beds">Beds</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Brand</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Royal Canin"
                              className="admin-input" 
                              value={formData.brand || ''}
                              onChange={e => setFormData({...formData, brand: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">SKU</label>
                            <input 
                              type="text" 
                              placeholder="e.g. PET-FOOD-001"
                              className="admin-input" 
                              value={formData.sku || ''}
                              onChange={e => setFormData({...formData, sku: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Variations Card */}
                      <div className="form-section-card">
                        <div className="flex justify-between items-center border-b border-brand-accent/10 pb-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                              <Plus className="w-5 h-5 text-brand-accent" />
                            </div>
                            <div>
                              <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Variations</h3>
                              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Manage sizes, weights, and stock</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const currentVars = formData.variations || [];
                              setFormData({...formData, variations: [...currentVars, { label: '', price: formData.price || 0, stock: 10 }]});
                            }}
                            className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:text-brand-primary transition-colors flex items-center gap-2 bg-brand-accent/10 px-4 py-2 rounded-xl"
                          >
                            <Plus className="w-4 h-4" /> Add Variation
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {(formData.variations || []).map((v: any, i: number) => (
                            <div key={i} className="relative bg-brand-bg p-5 rounded-2xl border border-brand-accent-secondary/10 group/var hover:border-brand-accent/30 transition-all">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Label (e.g. 1kg)</label>
                                  <input 
                                    type="text" 
                                    className="admin-input py-2 text-xs" 
                                    value={v.label}
                                    onChange={e => {
                                      const newVars = [...formData.variations];
                                      newVars[i].label = e.target.value;
                                      setFormData({...formData, variations: newVars});
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Price (₹)</label>
                                  <input 
                                    type="number" 
                                    min="1"
                                    className="admin-input py-2 text-xs" 
                                    value={v.price}
                                    onChange={e => {
                                      const newVars = [...formData.variations];
                                      newVars[i].price = Math.max(0, Number(e.target.value));
                                      setFormData({...formData, variations: newVars});
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                  <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Stock Quantity</label>
                                  <input 
                                    type="number" 
                                    className="admin-input py-2 text-xs" 
                                    value={v.stock}
                                    onChange={e => {
                                      const newVars = [...formData.variations];
                                      newVars[i].stock = Number(e.target.value);
                                      setFormData({...formData, variations: newVars});
                                    }}
                                  />
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newVars = formData.variations.filter((_: any, idx: number) => idx !== i);
                                    setFormData({...formData, variations: newVars});
                                  }}
                                  className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-4"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {(formData.variations || []).length === 0 && (
                            <div className="col-span-2 py-12 text-center border-2 border-dashed border-brand-accent/10 rounded-3xl text-brand-text/30 text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-accent/5">
                              No variations defined for this product
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details Card */}
                      <div className="form-section-card">
                        <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                            <Edit className="w-5 h-5 text-brand-accent" />
                          </div>
                          <div>
                            <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Product Details & Specs</h3>
                            <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Technical specifications and instructions</p>
                          </div>
                        </div>
                        <div className="space-y-6 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Specifications</label>
                            <textarea 
                              rows={2} 
                              className="admin-input resize-none" 
                              placeholder="Technical specs, dimensions, material, etc..." 
                              value={formData.specifications || ''}
                              onChange={e => setFormData({...formData, specifications: e.target.value})} 
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Ingredients (if food)</label>
                              <textarea 
                                rows={3} 
                                className="admin-input resize-none" 
                                placeholder="List all ingredients..."
                                value={formData.ingredients || ''}
                                onChange={e => setFormData({...formData, ingredients: e.target.value})} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Usage Instructions</label>
                              <textarea 
                                rows={3} 
                                className="admin-input resize-none" 
                                placeholder="How to use or feed this product..."
                                value={formData.usageInstructions || ''}
                                onChange={e => setFormData({...formData, usageInstructions: e.target.value})} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Description Card (Common) */}
                  <div className="form-section-card">
                    <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-brand-accent" />
                      </div>
                      <div>
                        <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Main Description</h3>
                        <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">The primary storytelling content</p>
                      </div>
                    </div>
                    <textarea 
                      required 
                      rows={6} 
                      className="admin-input resize-none pt-4" 
                      placeholder="Write a compelling description that highlights key features and benefits..."
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Sidebar Column (Media, Pricing, Stock) */}
                <div className="lg:col-span-4 space-y-10">
                  
                  {/* Media Card */}
                  <div className="form-section-card">
                    <div className="flex items-center gap-3 border-b border-brand-accent/10 pb-4">
                      <Package className="w-4 h-4 text-brand-accent" />
                      <h3 className="text-brand-primary font-display font-bold uppercase tracking-tight">Media</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-brand-bg border border-brand-accent-secondary/10 flex items-center justify-center relative group shadow-inner">
                        {formData.image ? (
                          <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="text-brand-text/20 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-brand-text/20 flex items-center justify-center">
                              <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Main Image</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Main Image Filename <span className="text-brand-accent">*</span></label>
                        <input 
                          required 
                          type="text" 
                          placeholder="e.g. dog-01.jpg"
                          className="admin-input text-xs" 
                          value={formData.image || ''}
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                        />
                      </div>

                      {/* Multiple Images */}
                      <div className="space-y-4 pt-4 border-t border-brand-accent/5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Additional Images</label>
                          <button 
                            type="button"
                            onClick={() => {
                              const currentImages = formData.images || [];
                              setFormData({...formData, images: [...currentImages, '']});
                            }}
                            className="text-[8px] font-bold text-brand-accent uppercase tracking-widest hover:text-brand-primary transition-colors flex items-center gap-1 bg-brand-accent/5 px-2 py-1 rounded-lg"
                          >
                            <Plus className="w-3 h-3" /> Add Image
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(formData.images || []).map((img: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="e.g. dog-01-side.jpg"
                                className="admin-input text-xs flex-1" 
                                value={img}
                                onChange={e => {
                                  const newImages = [...formData.images];
                                  newImages[idx] = e.target.value;
                                  setFormData({...formData, images: newImages});
                                }} 
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const newImages = formData.images.filter((_: any, i: number) => i !== idx);
                                  setFormData({...formData, images: newImages});
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                               {/* Pricing & Inventory Card */}
                  <div className="form-section-card">
                    <div className="flex items-center gap-3 border-b border-brand-accent/10 pb-4">
                      {activeTab === 'pets' ? (
                        <Dog className="w-4 h-4 text-brand-accent" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 text-brand-accent" />
                      )}
                      <h3 className="text-brand-primary font-display font-bold uppercase tracking-tight">
                        {activeTab === 'pets' ? 'Pet Specifications' : 'Pricing & Stock'}
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {activeTab === 'products' ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Base Price (INR) <span className="text-brand-accent">*</span></label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold">₹</span>
                              <input 
                                required 
                                type="number" 
                                min="1"
                                className="admin-input pl-10" 
                                value={formData.price || ''}
                                onChange={e => setFormData({...formData, price: Math.max(0, Number(e.target.value))})} 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Product Status</label>
                            <select 
                              className="admin-input text-xs" 
                              value={formData.status || 'in-stock'}
                              onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="in-stock">In Stock</option>
                              <option value="out-of-stock">Out of Stock</option>
                              <option value="discontinued">Discontinued</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Base Stock</label>
                            <input 
                              type="number" 
                              className="admin-input" 
                              value={formData.stock || ''}
                              onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Warranty Info</label>
                            <input 
                              type="text" 
                              className="admin-input text-xs" 
                              placeholder="e.g. 1 Year Manufacturer Warranty"
                              value={formData.warranty || ''}
                              onChange={e => setFormData({...formData, warranty: e.target.value})} 
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Price (INR) <span className="text-brand-accent">*</span></label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-bold">₹</span>
                              <input 
                                required 
                                type="number" 
                                min="1"
                                className="admin-input pl-10" 
                                value={formData.price || ''}
                                onChange={e => setFormData({...formData, price: Math.max(0, Number(e.target.value))})} 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Status</label>
                            <select 
                              className="admin-input text-xs" 
                              value={formData.status || 'available'}
                              onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="available">Available</option>
                              <option value="sold">Sold</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Age</label>
                              <input 
                                type="text" 
                                className="admin-input text-xs" 
                                placeholder="e.g. 2 Months"
                                value={formData.age || ''}
                                onChange={e => setFormData({...formData, age: e.target.value})} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Gender</label>
                              <select 
                                className="admin-input text-xs" 
                                value={formData.gender || 'Unknown'}
                                onChange={e => setFormData({...formData, gender: e.target.value})}
                              >
                                <option value="Unknown">Unknown</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Size Category</label>
                            <select 
                              className="admin-input text-xs" 
                              value={formData.size || 'Medium'}
                              onChange={e => setFormData({...formData, size: e.target.value})}
                            >
                              <option value="Small">Small</option>
                              <option value="Medium">Medium</option>
                              <option value="Large">Large</option>
                              <option value="Extra Large">Extra Large</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest ml-1">Weight</label>
                            <input 
                              type="text" 
                              className="admin-input text-xs" 
                              placeholder="e.g. 5kg - 8kg"
                              value={formData.weight || ''}
                              onChange={e => setFormData({...formData, weight: e.target.value})} 
                            />
                          </div>
                        </div>
                      )}
                      <div className="pt-2">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/5 p-4 rounded-2xl border border-brand-accent/10">
                          <AlertCircle className="w-4 h-4" />
                          <span>Visible in store immediately after saving</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer / Submit */}
              <div className="mt-16 flex flex-col md:flex-row gap-6 items-center justify-end border-t border-brand-accent/10 pt-10">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full md:w-auto px-10 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-brand-text hover:bg-brand-accent/10 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  className="w-full md:w-auto btn-premium px-16 py-4 rounded-2xl text-brand-bg-secondary font-bold uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 group"
                >
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isEditing ? 'Update Inventory' : `Publish ${activeTab.slice(0, -1)}`}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
