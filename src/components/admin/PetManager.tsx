import React, { useState } from 'react';
import { Dog, Plus, Trash2, Edit, X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { slugify } from '../../utils/slugify';
import { getImageUrl } from '../../utils/imageHelper';
import { updateMetadata } from '../../utils/metadataHelper';
import { motion, AnimatePresence } from 'motion/react';

import { Pet } from '../../types';

interface PetManagerProps {
  pets: Pet[];
  onNotification: (message: string, type: 'success' | 'error') => void;
  onDeleteConfirm: (id: string, name: string) => void;
  onRefresh?: (force?: boolean) => Promise<void>;
}

const PetManager: React.FC<PetManagerProps> = ({ pets, onNotification, onDeleteConfirm, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Pet>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'health' | 'media' | 'extra'>('basic');
  const [imagesInput, setImagesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  const parseCommaSeparated = (value: string) => value.split(',').map(s => s.trim()).filter(Boolean);

  const openAddModal = () => {
    setFormData({});
    setImagesInput('');
    setFeaturesInput('');
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const openEditModal = (item: Pet) => {
    // Normalize data to ensure arrays exist for mapping
    const normalizedItem = {
      ...item,
      features: Array.isArray(item.features) ? item.features : [],
      images: Array.isArray(item.images) ? item.images : []
    };
    setFormData(normalizedItem);
    setImagesInput(normalizedItem.images.join(', '));
    setFeaturesInput(normalizedItem.features.join(', '));
    setIsEditing(true);
    setEditingId(item.id);
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!formData.name || !formData.image) {
        onNotification('Please fill in all required fields (Name, Image)', 'error');
        return;
      }

      const dataToSave: any = {
        ...formData,
        updatedAt: new Date().toISOString(),
        slug: slugify(formData.name)
      };

      // Ensure no undefined values are sent to Firestore
      if (formData.price !== undefined && formData.price !== null && formData.price !== '') {
        dataToSave.price = Number(formData.price);
      } else {
        delete dataToSave.price;
      }

      if (isEditing && editingId) {
        await updateDoc(doc(db, 'pets', editingId), dataToSave);
        onNotification('Pet updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'pets'), {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          status: 'available'
        });
        onNotification('Pet added successfully!', 'success');
      }
      await updateMetadata('pets');
      if (onRefresh) await onRefresh(true);
      setIsModalOpen(false);
    } catch (error) {
      onNotification('Failed to save pet.', 'error');
      handleFirestoreError(error, OperationType.WRITE, 'pets');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Manage Pets</h2>
        <button 
          onClick={openAddModal}
          className="btn-premium px-6 py-3 rounded-xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Pet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map(pet => (
          <div key={pet.id} className="bg-brand-bg p-4 md:p-6 rounded-3xl border border-brand-accent-secondary/10 group relative overflow-hidden">
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-brand-bg-secondary">
              <img src={getImageUrl(pet.image)} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg md:text-xl font-display font-bold text-brand-primary uppercase tracking-tighter">{pet.name}</h3>
              {pet.price ? (
                <div className="text-brand-accent font-bold text-sm md:text-base">₹{pet.price.toLocaleString()}</div>
              ) : (
                <div className="text-brand-accent font-bold text-[8px] uppercase tracking-widest">Price on Req</div>
              )}
            </div>
            <p className="text-brand-text/60 text-xs md:text-sm mb-6 line-clamp-2">{pet.description}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(pet)}
                className="flex-1 py-3 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteConfirm(pet.id, pet.name)}
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
                  {isEditing ? 'Edit' : 'Add New'} Pet
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-primary" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-brand-accent-secondary/10 bg-brand-bg-secondary/20 overflow-x-auto">
                {[
                  { id: 'basic', label: 'Basic Info' },
                  { id: 'health', label: 'Health & Origin' },
                  { id: 'media', label: 'Media & Desc' },
                  { id: 'extra', label: 'Additional' }
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
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Pet Name *</label>
                        <input 
                          required 
                          type="text" 
                          className="admin-input" 
                          value={formData.name || ''}
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Price (₹) - Leave empty for "Price on Req"</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={formData.price || ''}
                          onChange={e => setFormData({...formData, price: e.target.value})} 
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
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                          <option value="bird">Bird</option>
                          <option value="fish">Fish</option>
                          <option value="rabbit">Rabbit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Breed</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.breed || ''}
                          onChange={e => setFormData({...formData, breed: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Age</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.age || ''}
                          onChange={e => setFormData({...formData, age: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Gender</label>
                        <select 
                          className="admin-input" 
                          value={formData.gender || ''}
                          onChange={e => setFormData({...formData, gender: e.target.value as any})}
                        >
                          <option value="unknown">Unknown</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Color</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.color || ''}
                          onChange={e => setFormData({...formData, color: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Weight</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.weight || ''}
                          onChange={e => setFormData({...formData, weight: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Location</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.location || ''}
                          onChange={e => setFormData({...formData, location: e.target.value})} 
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'health' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Vaccination Status</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.vaccinationStatus || ''}
                          onChange={e => setFormData({...formData, vaccinationStatus: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Origin</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.origin || ''}
                          onChange={e => setFormData({...formData, origin: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Health Status</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.healthStatus || ''}
                          onChange={e => setFormData({...formData, healthStatus: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Energy Level</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.energyLevel || ''}
                          onChange={e => setFormData({...formData, energyLevel: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Shedding Level</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.sheddingLevel || ''}
                          onChange={e => setFormData({...formData, sheddingLevel: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Grooming Needs</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={formData.groomingNeeds || ''}
                          onChange={e => setFormData({...formData, groomingNeeds: e.target.value})} 
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'media' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Main Image URL / Filename *</label>
                            <input 
                              required 
                              type="text" 
                              className="admin-input" 
                              value={formData.image || ''}
                              onChange={e => setFormData({...formData, image: e.target.value})} 
                            />
                          </div>
                          {formData.image && (
                            <div className="space-y-2">
                              <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Preview</label>
                              <div className="aspect-video rounded-2xl overflow-hidden border border-brand-accent-secondary/10 bg-brand-bg-secondary">
                                <img 
                                  src={getImageUrl(formData.image)} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                  onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/800/600')}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Additional Images (comma separated)</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              placeholder="url1, url2, url3"
                              value={imagesInput}
                              onChange={e => {
                                const value = e.target.value;
                                setImagesInput(value);
                                setFormData({...formData, images: parseCommaSeparated(value)});
                              }} 
                            />
                          </div>
                          {formData.images && formData.images.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-[8px] font-bold text-brand-text/40 uppercase tracking-widest">Gallery Preview</label>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {formData.images.map((img, idx) => (
                                  <div key={idx} className="w-24 aspect-square rounded-xl overflow-hidden border border-brand-accent-secondary/10 bg-brand-bg-secondary shrink-0">
                                    <img 
                                      src={getImageUrl(img)} 
                                      alt={`Preview ${idx + 1}`} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                      onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/800/600')}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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

                  {activeTab === 'extra' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Features (comma separated)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="Vaccinated, Friendly, Trained"
                            value={featuresInput}
                            onChange={e => {
                              const value = e.target.value;
                              setFeaturesInput(value);
                              setFormData({...formData, features: parseCommaSeparated(value)});
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest">Temperament</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={formData.temperament || ''}
                            onChange={e => setFormData({...formData, temperament: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-brand-bg-secondary/30 p-6 rounded-2xl border border-brand-accent-secondary/10">
                        <input 
                          type="checkbox" 
                          id="isFeatured"
                          className="w-5 h-5 rounded border-brand-accent-secondary/20 bg-brand-bg-secondary text-brand-accent focus:ring-brand-accent"
                          checked={formData.isFeatured || false}
                          onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                        />
                        <label htmlFor="isFeatured" className="text-xs font-bold text-brand-primary uppercase tracking-widest cursor-pointer">Feature this pet on home page</label>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between items-center gap-4 pt-8 mt-8 border-t border-brand-accent-secondary/10">
                  <div className="flex gap-2">
                    {['basic', 'health', 'media', 'extra'].map((tabId, idx) => (
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
                      {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Pet</>}
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

export default PetManager;
