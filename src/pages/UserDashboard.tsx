import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import { User, Package, LogOut, Settings, ChevronRight, ShoppingBag, X, ShoppingCart, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useNavigate } from 'react-router-dom';
import { shopDb } from '../db/shopDb';

import DashboardLayout from '../components/DashboardLayout';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile' | 'settings'>('overview');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [updating, setUpdating] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const [marketingSettings, setMarketingSettings] = useState(() => {
    const saved = localStorage.getItem('k9_marketing_settings');
    return saved ? JSON.parse(saved) : { orders: true, marketing: false };
  });

  useEffect(() => {
    localStorage.setItem('k9_marketing_settings', JSON.stringify(marketingSettings));
  }, [marketingSettings]);


  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const initOrders = async () => {
      try {
        await shopDb.safeOpen();
        if (shopDb.isOpen()) {
          const cachedOrders = await shopDb.orders
            .where('userId')
            .equals(user.uid)
            .reverse()
            .sortBy('createdAt');
          if (cachedOrders.length > 0) {
            setOrders(cachedOrders);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Failed to load orders from IndexedDB:', err);
      }
    };

    initOrders();

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setOrders(newOrders);
      setLoading(false);

      // Update IndexedDB
      try {
        if (shopDb.isOpen()) {
          await shopDb.orders.bulkPut(newOrders);
        }
      } catch (err) {
        console.error('Failed to cache orders in IndexedDB:', err);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    try {
      await updateProfile(user, { displayName });
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        updatedAt: new Date().toISOString()
      });
      
      setActiveTab('overview');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    navigate('/');
    return null;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <DashboardLayout
      title="DASHBOARD"
      subtitle="User Control Center"
      navItems={navItems as any}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      <SEO title="User Dashboard | K9 Sniper" />
      <div className="max-w-4xl">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary">
              Welcome, <span className="text-brand-accent">{user.displayName || 'Member'}</span>
            </h1>
            {!user.emailVerified && (
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
                <AlertCircle className="w-3 h-3 text-brand-accent" />
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Email Not Verified</span>
                <button 
                  onClick={handleSendVerification}
                  disabled={verificationSent}
                  className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors ml-2 underline underline-offset-2"
                >
                  {verificationSent ? 'Email Sent' : 'Verify Now'}
                </button>
              </div>
            )}
          </div>
          <p className="text-brand-text text-lg leading-relaxed">
            {activeTab === 'overview' && "Here's what's happening with your account."}
            {activeTab === 'orders' && "Track and manage your recent purchases."}
            {activeTab === 'profile' && "Update your personal information."}
            {activeTab === 'settings' && "Manage your account preferences."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-brand-bg-secondary rounded-[2.5rem] p-8 border border-brand-accent-secondary/10 shadow-xl max-w-2xl">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-brand-accent flex items-center justify-center text-brand-bg-secondary shadow-lg overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                        {user.displayName || 'Valued Member'}
                      </h3>
                      <p className="text-brand-text/60 text-xs font-bold uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Total Orders</span>
                      <span className="text-brand-primary font-bold">{orders.length}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-brand-bg-secondary rounded-[2.5rem] p-8 border border-brand-accent-secondary/10 shadow-xl min-h-[400px]">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mb-6 text-brand-text/20">
                      <Package className="w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-display font-bold text-brand-primary uppercase tracking-tighter mb-2">No Orders Yet</h4>
                    <p className="text-brand-text/60 text-sm mb-8 max-w-xs">
                      You haven't placed any orders yet. Start shopping to see your history here.
                    </p>
                    <button 
                      onClick={() => navigate('/products')}
                      className="btn-premium px-8 py-4 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        className="p-6 bg-brand-bg border border-brand-accent-secondary/10 rounded-3xl hover:border-brand-accent/30 transition-all group"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-brand-accent border border-brand-accent-secondary/10">
                              <Package className="w-8 h-8" />
                            </div>
                             <div>
                              <div className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1">Order #{order.id.slice(-8).toUpperCase()}</div>
                              <h4 className="text-lg font-display font-bold text-brand-primary uppercase tracking-tighter mb-1">
                                ₹{order.amount?.toLocaleString()}
                              </h4>
                              <p className="text-brand-text/60 text-xs font-bold uppercase tracking-widest">
                                {order.createdAt?.seconds 
                                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                                  : order.createdAt 
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : 'N/A'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-4">
                            <div className={`px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                              order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-accent/10 text-brand-accent'
                            }`}>
                              {order.status || 'Processing'}
                            </div>
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="p-3 bg-brand-bg-secondary rounded-xl hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {activeTab === 'profile' && (
              <div className="bg-brand-bg-secondary rounded-[2.5rem] p-8 border border-brand-accent-secondary/10 shadow-xl">
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Display Name</label>
                    <input 
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-accent-secondary/20 rounded-2xl px-6 py-4 text-brand-primary font-bold focus:outline-none focus:border-brand-accent transition-all"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full bg-brand-bg/50 border border-brand-accent-secondary/10 rounded-2xl px-6 py-4 text-brand-primary/40 font-bold cursor-not-allowed"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={updating}
                    className="w-full btn-premium py-5 rounded-2xl text-brand-bg-secondary font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-brand-bg-secondary rounded-[2.5rem] p-8 border border-brand-accent-secondary/10 shadow-xl">
                <div className="space-y-6 max-w-md">
                  <div className="flex items-center justify-between p-6 bg-brand-bg rounded-2xl border border-brand-accent-secondary/10">
                    <div>
                      <div className="text-sm font-bold text-brand-primary">Order Notifications</div>
                      <div className="text-[10px] text-brand-text/40 uppercase font-bold tracking-widest">Email & Push</div>
                    </div>
                    <button 
                      onClick={() => setMarketingSettings(prev => ({ ...prev, orders: !prev.orders }))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${marketingSettings.orders ? 'bg-brand-accent' : 'bg-brand-accent/20'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${marketingSettings.orders ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-brand-bg rounded-2xl border border-brand-accent-secondary/10">
                    <div>
                      <div className="text-sm font-bold text-brand-primary">Marketing Updates</div>
                      <div className="text-[10px] text-brand-text/40 uppercase font-bold tracking-widest">New Arrivals</div>
                    </div>
                    <button 
                      onClick={() => setMarketingSettings(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${marketingSettings.marketing ? 'bg-brand-accent' : 'bg-brand-accent/20'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${marketingSettings.marketing ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Payment Status</div>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                      selectedOrder.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {selectedOrder.status}
                    </span>
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
                  <div className="bg-brand-bg-secondary/30 p-6 rounded-3xl border border-brand-accent-secondary/10">
                    <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5 mb-6">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-brand-accent" />
                      </div>
                      <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Delivery Info</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Recipient</div>
                        <div className="text-brand-primary font-bold">{selectedOrder.deliveryInfo?.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Address</div>
                        <div className="text-brand-primary font-bold leading-relaxed">{selectedOrder.deliveryInfo?.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-bg-secondary/30 p-6 rounded-3xl border border-brand-accent-secondary/10">
                    <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5 mb-6">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-brand-accent" />
                      </div>
                      <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Items</h3>
                    </div>
                    <div className="space-y-4">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5">
                          <div>
                            <div className="text-brand-primary font-bold text-sm uppercase tracking-tight">{item.name}</div>
                            <div className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">
                              Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-brand-primary font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-brand-bg-secondary/50 border-t border-brand-accent-secondary/10 flex justify-end">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-10 py-4 bg-brand-accent text-brand-bg-secondary rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-primary transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default UserDashboard;
