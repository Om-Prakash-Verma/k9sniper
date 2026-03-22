import React, { useState } from 'react';
import { Package, Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { getImageUrl } from '../../utils/imageHelper';
import { updateMetadata } from '../../utils/metadataHelper';
import { motion, AnimatePresence } from 'motion/react';

import { Product } from '../../types';

interface ProductManagerProps {
  products: Product[];
  onNotification: (message: string, type: 'success' | 'error') => void;
  onDeleteConfirm: (id: string, name: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, onNotification, onDeleteConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSaving, setIsSaving] = useState(false);

  const openAddModal = () => {
    setFormData({});
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Product) => {
    setFormData({ ...item });
    setIsEditing(true);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!formData.name || !formData.image || !formData.price) {
        onNotification('Please fill in all required fields (Name, Image, Price)', 'error');
        return;
      }

      const dataToSave: Partial<Product> = {
        ...formData,
        price: Number(formData.price),
        updatedAt: new Date().toISOString()
      };

      if (isEditing && editingId) {
        await updateDoc(doc(db, 'products', editingId), dataToSave);
        onNotification('Product updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'products'), {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          status: 'in-stock'
        });
        onNotification('Product added successfully!', 'success');
      }
      await updateMetadata('products');
      setIsModalOpen(false);
    } catch (error) {
      onNotification('Failed to save product.', 'error');
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Manage Products</h2>
        <button 
          onClick={openAddModal}
          className="btn-premium px-6 py-3 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-brand-bg p-4 md:p-6 rounded-3xl border border-brand-accent-secondary/10 group relative overflow-hidden">
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-brand-bg-secondary">
              <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg md:text-xl font-display font-bold text-brand-primary uppercase tracking-tighter">{product.name}</h3>
              <div className="text-brand-accent font-bold text-sm md:text-base">₹{product.price?.toLocaleString()}</div>
            </div>
            <p className="text-brand-text/60 text-xs md:text-sm mb-6 line-clamp-2">{product.description}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(product)}
                className="flex-1 py-3 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteConfirm(product.id, product.name)}
                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-brand-bg w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
                <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                  {isEditing ? 'Edit' : 'Add New'} Product
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-primary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Product Name *</label>
                    <input 
                      required 
                      type="text" 
                      className="admin-input" 
                      value={formData.name || ''}
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Price (₹) *</label>
                    <input 
                      required 
                      type="number" 
                      className="admin-input" 
                      value={formData.price || ''}
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Image URL *</label>
                    <input 
                      required 
                      type="text" 
                      className="admin-input" 
                      value={formData.image || ''}
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Category *</label>
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
                      <option value="Toys">Toys</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={4} 
                    className="admin-input resize-none" 
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest text-brand-primary hover:bg-brand-accent/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="btn-premium px-10 py-3 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
                  >
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
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

export default ProductManager;
