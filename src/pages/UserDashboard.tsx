import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, LogOut, Settings, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
                <button className="w-full p-4 bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl flex items-center justify-between group hover:border-brand-accent transition-all">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-brand-accent" />
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Edit Profile</span>
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
                <button className="px-6 py-3 bg-brand-primary text-brand-bg-secondary rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-bg-secondary hover:text-brand-primary transition-all">
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
                              {new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className={`px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                            order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-accent/10 text-brand-accent'
                          }`}>
                            {order.status || 'Processing'}
                          </div>
                          <button className="p-3 bg-brand-bg-secondary rounded-xl hover:bg-brand-accent hover:text-brand-bg-secondary transition-all">
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
    </div>
  );
};

export default UserDashboard;
