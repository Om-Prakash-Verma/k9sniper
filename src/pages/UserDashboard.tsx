import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Package, LogOut, Settings, ChevronRight, ShoppingBag, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
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
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(user, { displayName });
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
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

  return (
    <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">User Account</div>
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-6">
              My <span className="text-brand-accent">Dashboard</span>
            </h1>
            <p className="text-brand-text text-lg md:text-xl leading-relaxed">
              Manage your orders, profile, and preferences.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-2xl text-brand-primary font-bold uppercase text-[10px] tracking-widest hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-brand-bg-secondary rounded-[2.5rem] p-8 md:p-10 border border-brand-accent-secondary/10 shadow-2xl">
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
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="w-full p-4 bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl flex items-center justify-between group hover:border-brand-accent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-brand-accent" />
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Edit Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text/40 group-hover:text-brand-accent transition-colors" />
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full p-4 bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl flex items-center justify-between group hover:border-brand-accent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-brand-accent" />
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text/40 group-hover:text-brand-accent transition-colors" />
                </button>
              </div>
            </div>

            <div className="bg-brand-accent rounded-[2.5rem] p-8 md:p-10 text-brand-bg-secondary shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold uppercase tracking-tighter leading-none mb-4">
                  Join Our <br />
                  <span className="text-brand-primary">Loyalty Club</span>
                </h3>
                <p className="text-brand-bg-secondary/80 text-sm mb-8 max-w-[200px]">
                  Earn points on every purchase and unlock exclusive rewards.
                </p>
                <button 
                  onClick={() => setIsLoyaltyOpen(true)}
                  className="px-6 py-3 bg-brand-primary text-brand-bg-secondary rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-bg-secondary hover:text-brand-primary transition-all"
                >
                  Learn More
                </button>
              </div>
              <ShoppingBag className="absolute -bottom-4 -right-4 w-32 h-32 text-brand-primary/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-brand-bg-secondary rounded-[2.5rem] p-8 md:p-10 border border-brand-accent-secondary/10 shadow-2xl min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Order History</h3>
                </div>
                <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">{orders.length} Orders Total</span>
              </div>

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
                                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })
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
          </motion.div>
        </div>
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
                {/* Status & Date */}
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
                  {/* Delivery Info */}
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

                  {/* Order Items */}
                  <div className="bg-brand-bg-secondary/30 p-6 rounded-3xl border border-brand-accent-secondary/10">
                    <div className="flex items-center gap-4 border-b border-brand-accent/10 pb-5 mb-6">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-brand-accent" />
                      </div>
                      <h3 className="text-brand-primary font-display font-bold text-lg uppercase tracking-tight">Items</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item: any, idx: number) => (
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

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setIsEditProfileOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-brand-bg w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
                <div>
                  <div className="micro-label text-brand-accent mb-1">Account Settings</div>
                  <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Edit Profile</h2>
                </div>
                <button onClick={() => setIsEditProfileOpen(false)} className="p-3 hover:bg-brand-accent/10 rounded-2xl transition-colors group">
                  <X className="text-brand-primary group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2">Display Name</label>
                  <input 
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-2xl px-6 py-4 text-brand-primary font-bold focus:outline-none focus:border-brand-accent transition-all"
                    placeholder="Enter your name"
                    required
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
            </motion.div>
          </div>
        )}

        {/* Loyalty Modal */}
        {isLoyaltyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setIsLoyaltyOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-brand-bg w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-accent text-brand-bg-secondary">
                <div>
                  <div className="micro-label text-brand-primary mb-1">Exclusive Rewards</div>
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tighter">Loyalty Club</h2>
                </div>
                <button onClick={() => setIsLoyaltyOpen(false)} className="p-3 hover:bg-brand-primary/10 rounded-2xl transition-colors group">
                  <X className="text-brand-bg-secondary group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6 p-6 bg-brand-accent/10 rounded-3xl border border-brand-accent/20">
                  <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-bg-secondary shadow-lg">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-brand-primary">0 Points</div>
                    <div className="text-xs text-brand-accent font-bold uppercase tracking-widest">Current Balance</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-brand-primary font-bold uppercase tracking-tight">How it works:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-brand-text/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                      Earn 10 points for every ₹100 spent.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-brand-text/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                      Redeem points for discounts on future orders.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-brand-text/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                      Exclusive early access to new pet arrivals.
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setIsLoyaltyOpen(false)}
                  className="w-full btn-premium py-5 rounded-2xl text-brand-bg-secondary font-bold uppercase tracking-widest"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-brand-bg w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
                <div>
                  <div className="micro-label text-brand-accent mb-1">Preferences</div>
                  <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Account Settings</h2>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-3 hover:bg-brand-accent/10 rounded-2xl transition-colors group">
                  <X className="text-brand-primary group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10">
                    <div>
                      <div className="text-sm font-bold text-brand-primary">Order Notifications</div>
                      <div className="text-[10px] text-brand-text/40 uppercase font-bold tracking-widest">Email & Push</div>
                    </div>
                    <div className="w-12 h-6 bg-brand-accent rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10">
                    <div>
                      <div className="text-sm font-bold text-brand-primary">Marketing Updates</div>
                      <div className="text-[10px] text-brand-text/40 uppercase font-bold tracking-widest">New Arrivals</div>
                    </div>
                    <div className="w-12 h-6 bg-brand-accent/20 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-brand-accent-secondary/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 border border-red-500/20 text-red-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Sign Out Everywhere
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
