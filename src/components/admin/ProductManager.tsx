import React, { useState } from 'react';
import { Package, Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { getImageUrl } from '../../utils/imageHelper';
import { updateMetadata } from '../../utils/metadataHelper';
import { slugify } from '../../utils/slugify';
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
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'variations' | 'specs' | 'usage'>('basic');

  const openAddModal = () => {
    setFormData({});
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const openEditModal = (item: Product) => {
    // Normalize data to ensure arrays exist for mapping
    const normalizedItem = {
      ...item,
      specifications: Array.isArray(item.specifications) ? item.specifications : [],
      variations: Array.isArray(item.variations) ? item.variations : [],
      images: Array.isArray(item.images) ? item.images : []
    };
    setFormData(normalizedItem);
    setIsEditing(true);
    setEditingId(item.id);
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!formData.name || !formData.image || !formData.price) {
        onNotification('Please fill in all required fields (Name, Image, Price)', 'error');
        return;
      }

      const slug = slugify(formData.name);
      const dataToSave: Partial<Product> = {
        ...formData,
        slug,
        price: Number(formData.price),
        stock: formData.stock ? Number(formData.stock) : undefined,
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

  const addSpecification = () => {
    const specs = formData.specifications || [];
    setFormData({ ...formData, specifications: [...specs, { key: '', value: '' }] });
  };

  const removeSpecification = (index: number) => {
    const specs = [...(formData.specifications || [])];
    specs.splice(index, 1);
    setFormData({ ...formData, specifications: specs });
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const specs = [...(formData.specifications || [])];
    specs[index] = { ...specs[index], [field]: value };
    setFormData({ ...formData, specifications: specs });
  };

  const addVariation = () => {
    const vars = formData.variations || [];
    setFormData({ ...formData, variations: [...vars, { label: '', price: Number(formData.price) || 0 }] });
  };

  const removeVariation = (index: number) => {
    const vars = [...(formData.variations || [])];
    vars.splice(index, 1);
    setFormData({ ...formData, variations: vars });
  };

  const updateVariation = (index: number, field: 'label' | 'price', value: string | number) => {
    const vars = [...(formData.variations || [])];
    vars[index] = { ...vars[index], [field]: field === 'price' ? Number(value) : value };
    setFormData({ ...formData, variations: vars });
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
              className="relative bg-brand-bg w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
                <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                  {isEditing ? 'Edit' : 'Add New'} Product
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-primary" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-brand-accent-secondary/10 bg-brand-bg-secondary/20 overflow-x-auto">
                {[
                  { id: 'basic', label: 'Basic Info' },
                  { id: 'media', label: 'Media & Desc' },
                  { id: 'variations', label: 'Variations' },
                  { id: 'specs', label: 'Specifications' },
                  { id: 'usage', label: 'Usage & Ingredients' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-brand-accent text-brand-accent bg-brand-accent/5' 
                        : 'border-transparent text-brand-text/60 hover:text-brand-primary hover:bg-brand-accent/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
                <div className="flex-1 space-y-8">
                  {activeTab === 'basic' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Base Price (₹) *</label>
                          <input 
                            required 
                            type="number" 
                            className="admin-input" 
                            value={formData.price || ''}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Stock Quantity</label>
                          <input 
                            type="number" 
                            className="admin-input" 
                            value={formData.stock || ''}
                            onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
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
                            <option value="Health">Health</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Brand</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={formData.brand || ''}
                            onChange={e => setFormData({...formData, brand: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-brand-bg-secondary/30 p-6 rounded-2xl border border-brand-accent-secondary/10">
                        <input 
                          type="checkbox" 
                          id="isFeaturedProduct"
                          className="w-5 h-5 rounded border-brand-accent-secondary/20 bg-brand-bg-secondary text-brand-accent focus:ring-brand-accent"
                          checked={formData.isFeatured || false}
                          onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                        />
                        <label htmlFor="isFeaturedProduct" className="text-xs font-bold text-brand-primary uppercase tracking-widest cursor-pointer">Feature this product on home page</label>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'media' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Main Image URL *</label>
                          <input 
                            required 
                            type="text" 
                            className="admin-input" 
                            value={formData.image || ''}
                            onChange={e => setFormData({...formData, image: e.target.value})} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Additional Images (comma separated URLs)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="url1, url2, url3"
                            value={formData.images?.join(', ') || ''}
                            onChange={e => setFormData({...formData, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Description</label>
                        <textarea 
                          rows={6} 
                          className="admin-input resize-none" 
                          value={formData.description || ''}
                          onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'variations' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest">Manage Variations</h3>
                        <button 
                          type="button"
                          onClick={addVariation}
                          className="px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                        >
                          + Add Variation
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.variations?.map((v, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-brand-bg-secondary/30 p-4 rounded-2xl border border-brand-accent-secondary/10">
                            <div className="flex-1 space-y-2">
                              <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Label (e.g. 5kg)</label>
                              <input 
                                type="text" 
                                className="admin-input"
                                value={v.label}
                                onChange={e => updateVariation(idx, 'label', e.target.value)}
                              />
                            </div>
                            <div className="w-32 space-y-2">
                              <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Price (₹)</label>
                              <input 
                                type="number" 
                                className="admin-input"
                                value={v.price}
                                onChange={e => updateVariation(idx, 'price', e.target.value)}
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeVariation(idx)}
                              className="mt-6 p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.variations || formData.variations.length === 0) && (
                          <div className="text-center py-12 border-2 border-dashed border-brand-accent-secondary/10 rounded-[2rem]">
                            <p className="text-brand-text/40 text-[10px] font-bold uppercase tracking-widest">No variations added yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'specs' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest">Manage Specifications</h3>
                        <button 
                          type="button"
                          onClick={addSpecification}
                          className="px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                        >
                          + Add Specification
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.specifications?.map((s, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-brand-bg-secondary/30 p-4 rounded-2xl border border-brand-accent-secondary/10">
                            <div className="flex-1 space-y-2">
                              <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Key (e.g. Material)</label>
                              <input 
                                type="text" 
                                className="admin-input"
                                value={s.key}
                                onChange={e => updateSpecification(idx, 'key', e.target.value)}
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Value (e.g. Plastic)</label>
                              <input 
                                type="text" 
                                className="admin-input"
                                value={s.value}
                                onChange={e => updateSpecification(idx, 'value', e.target.value)}
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeSpecification(idx)}
                              className="mt-6 p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.specifications || formData.specifications.length === 0) && (
                          <div className="text-center py-12 border-2 border-dashed border-brand-accent-secondary/10 rounded-[2rem]">
                            <p className="text-brand-text/40 text-[10px] font-bold uppercase tracking-widest">No specifications added yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'usage' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Ingredients</label>
                        <textarea 
                          rows={5} 
                          className="admin-input resize-none" 
                          value={formData.ingredients || ''}
                          onChange={e => setFormData({...formData, ingredients: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Usage Instructions</label>
                        <textarea 
                          rows={5} 
                          className="admin-input resize-none" 
                          value={formData.usageInstructions || ''}
                          onChange={e => setFormData({...formData, usageInstructions: e.target.value})} 
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between items-center gap-4 pt-8 mt-8 border-t border-brand-accent-secondary/10">
                  <div className="flex gap-2">
                    {['basic', 'media', 'variations', 'specs', 'usage'].map((tabId, idx) => (
                      <div 
                        key={tabId} 
                        className={`w-2 h-2 rounded-full transition-all ${
                          activeTab === tabId ? 'bg-brand-accent w-6' : 'bg-brand-accent/20'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex gap-4">
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
