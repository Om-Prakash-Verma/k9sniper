import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Edit, X, Save, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { motion, AnimatePresence } from 'motion/react';
import { Coupon } from '../../types';

interface CouponManagerProps {
  onNotification: (message: string, type: 'success' | 'error') => void;
}

const CouponManager: React.FC<CouponManagerProps> = ({ onNotification }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    isActive: true,
    type: 'percentage',
    usageCount: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'coupons'), orderBy('code', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const couponsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
      setCoupons(couponsData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setFormData({
      isActive: true,
      type: 'percentage',
      usageCount: 0,
      code: '',
      value: 0
    });
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setFormData(coupon);
    setIsEditing(true);
    setEditingId(coupon.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      onNotification('Please fill in required fields (Code, Value)', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        code: formData.code.toUpperCase(),
        value: Number(formData.value),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null,
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : null,
        updatedAt: new Date().toISOString()
      };

      if (isEditing && editingId) {
        await updateDoc(doc(db, 'coupons', editingId), dataToSave);
        onNotification('Coupon updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'coupons'), {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          usageCount: 0
        });
        onNotification('Coupon added successfully!', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      onNotification('Failed to save coupon.', 'error');
      handleFirestoreError(error, OperationType.WRITE, 'coupons');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        onNotification('Coupon deleted successfully!', 'success');
      } catch (error) {
        onNotification('Failed to delete coupon.', 'error');
        handleFirestoreError(error, OperationType.DELETE, `coupons/${id}`);
      }
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      await updateDoc(doc(db, 'coupons', coupon.id), {
        isActive: !coupon.isActive
      });
      onNotification(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'} successfully!`, 'success');
    } catch (error) {
      onNotification('Failed to update status.', 'error');
      handleFirestoreError(error, OperationType.UPDATE, `coupons/${coupon.id}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Universal Coupons</h2>
        <button 
          onClick={openAddModal}
          className="btn-premium px-6 py-3 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 bg-brand-bg-secondary/20 rounded-[3rem] border-2 border-dashed border-brand-accent-secondary/10">
          <Ticket className="w-12 h-12 text-brand-accent/20 mx-auto mb-4" />
          <p className="text-brand-text/40 font-bold uppercase tracking-widest text-sm">No coupons found</p>
          <button onClick={openAddModal} className="mt-4 text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline">Create your first coupon</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.id} className={`bg-brand-bg p-6 rounded-[2.5rem] border transition-all ${coupon.isActive ? 'border-brand-accent-secondary/10' : 'border-red-500/20 opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${coupon.isActive ? 'bg-brand-accent/10 text-brand-accent' : 'bg-red-500/10 text-red-500'}`}>
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-brand-primary tracking-tighter">{coupon.code}</h3>
                    <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleStatus(coupon)}
                  className={`p-2 rounded-xl transition-all ${coupon.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'}`}
                  title={coupon.isActive ? 'Deactivate' : 'Activate'}
                >
                  {coupon.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-brand-text/40">Usage</span>
                  <span className="text-brand-primary">{coupon.usageCount} {coupon.maxUsage ? `/ ${coupon.maxUsage}` : 'times'}</span>
                </div>
                {coupon.minOrderValue && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-brand-text/40">Min Order</span>
                    <span className="text-brand-primary">₹{coupon.minOrderValue}</span>
                  </div>
                )}
                {coupon.expiryDate && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-brand-text/40">Expires</span>
                    <span className="text-brand-primary">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(coupon)}
                  className="flex-1 py-3 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(coupon.id, coupon.code)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-brand-bg w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
                <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                  {isEditing ? 'Edit' : 'Create'} Coupon
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-primary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Coupon Code *</label>
                  <input 
                    required 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. WELCOME10"
                    value={formData.code || ''}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Type *</label>
                    <select 
                      required 
                      className="admin-input" 
                      value={formData.type || 'percentage'}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Value *</label>
                    <input 
                      required 
                      type="number" 
                      className="admin-input" 
                      value={formData.value || ''}
                      onChange={e => setFormData({...formData, value: Number(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Min Order Value (₹)</label>
                    <input 
                      type="number" 
                      className="admin-input" 
                      value={formData.minOrderValue || ''}
                      onChange={e => setFormData({...formData, minOrderValue: Number(e.target.value)})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Max Usage (Times)</label>
                    <input 
                      type="number" 
                      className="admin-input" 
                      value={formData.maxUsage || ''}
                      onChange={e => setFormData({...formData, maxUsage: Number(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Expiry Date</label>
                  <input 
                    type="date" 
                    className="admin-input" 
                    value={formData.expiryDate || ''}
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
                  />
                </div>

                <div className="flex items-center gap-3 bg-brand-bg-secondary/30 p-4 rounded-2xl border border-brand-accent-secondary/10">
                  <input 
                    type="checkbox" 
                    id="isCouponActive"
                    className="w-5 h-5 rounded border-brand-accent-secondary/20 bg-brand-bg-secondary text-brand-accent focus:ring-brand-accent"
                    checked={formData.isActive || false}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <label htmlFor="isCouponActive" className="text-xs font-bold text-brand-primary uppercase tracking-widest cursor-pointer">Active and ready to use</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest text-brand-primary hover:bg-brand-accent/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="btn-premium flex-[2] py-4 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                  >
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Coupon</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponManager;
