import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, Shield, Database, Truck, MessageCircle, Instagram } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { useShopData } from '../../context/ShopDataContext';
import { shopDb } from '../../db/shopDb';

import { Metadata, ShopSettings } from '../../types';

interface SettingsManagerProps {
  metadata: {
    pets?: { version: number; lastUpdated: any };
    products?: { version: number; lastUpdated: any };
  };
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ metadata }) => {
  const { shopSettings, updateShopSettings } = useShopData();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [localSettings, setLocalSettings] = useState<ShopSettings>(shopSettings);

  useEffect(() => {
    setLocalSettings(shopSettings);
  }, [shopSettings]);

  const handleUpdateMetadata = async (type: 'pets' | 'products') => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const metadataRef = doc(db, 'metadata', type);
      const currentVersion = metadata?.[type]?.version || 0;
      await updateDoc(metadataRef, {
        lastUpdated: serverTimestamp(),
        version: currentVersion + 1
      });
      setMessage({ text: `${type.charAt(0).toUpperCase() + type.slice(1)} cache invalidated successfully!`, type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `metadata/${type}`);
      setMessage({ text: `Failed to update ${type} metadata.`, type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    setMessage(null);
    try {
      await updateShopSettings(localSettings);
      setMessage({ text: 'Shop settings updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update shop settings.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearLocalCache = async () => {
    setIsUpdating(true);
    setMessage(null);
    try {
      if (shopDb.isOpen()) {
        await Promise.all([
          shopDb.pets.clear(),
          shopDb.products.clear(),
          shopDb.orders.clear(),
          shopDb.settings.clear(),
          shopDb.metadata.clear()
        ]);
        setMessage({ text: 'Local cache cleared successfully! Refresh the page to reload data.', type: 'success' });
      } else {
        setMessage({ text: 'IndexedDB is not open.', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to clear local cache:', error);
      setMessage({ text: 'Failed to clear local cache.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Shop Settings</h2>

      {message && (
        <div className={`p-4 rounded-2xl font-bold text-sm uppercase tracking-widest ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Settings */}
        <div className="bg-brand-bg-secondary p-8 rounded-[2rem] border border-brand-accent-secondary/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-accent/10 rounded-2xl">
              <Truck className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight">Delivery Rules</h3>
              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Configure delivery fees</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest ml-1">Free Delivery Threshold (₹)</label>
              <input 
                type="number"
                value={localSettings.deliveryFeeThreshold}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, deliveryFeeThreshold: Number(e.target.value) }))}
                className="w-full bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl px-4 py-3 text-sm font-bold text-brand-primary focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest ml-1">Fixed Delivery Fee (₹)</label>
              <input 
                type="number"
                value={localSettings.fixedDeliveryFee}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, fixedDeliveryFee: Number(e.target.value) }))}
                className="w-full bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl px-4 py-3 text-sm font-bold text-brand-primary focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <button
              disabled={isUpdating}
              onClick={handleSaveSettings}
              className="w-full py-4 bg-brand-accent text-brand-bg-secondary rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-brand-bg-secondary p-8 rounded-[2rem] border border-brand-accent-secondary/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-accent/10 rounded-2xl">
              <MessageCircle className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight">Contact Info</h3>
              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">WhatsApp & Instagram</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest ml-1 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> WhatsApp Number
              </label>
              <input 
                type="text"
                placeholder="e.g. 919876543210"
                value={localSettings.whatsapp || ''}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl px-4 py-3 text-sm font-bold text-brand-primary focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest ml-1 flex items-center gap-1">
                <Instagram className="w-3 h-3" /> Instagram ID
              </label>
              <input 
                type="text"
                placeholder="e.g. your_shop_id"
                value={localSettings.instagram || ''}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, instagram: e.target.value }))}
                className="w-full bg-brand-bg border border-brand-accent-secondary/10 rounded-2xl px-4 py-3 text-sm font-bold text-brand-primary focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <button
              disabled={isUpdating}
              onClick={handleSaveSettings}
              className="w-full py-4 bg-brand-accent text-brand-bg-secondary rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-brand-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-brand-bg-secondary p-8 rounded-[2rem] border border-brand-accent-secondary/5 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-accent/10 rounded-2xl">
              <Database className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight">Cache Control</h3>
              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Force client-side data refresh</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-brand-text uppercase tracking-tight">Pets Data</p>
                <p className="text-[10px] text-brand-text/40 font-mono">v{metadata.pets?.version || 0}</p>
              </div>
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateMetadata('pets')}
                className="p-2 hover:bg-brand-accent/10 text-brand-accent rounded-xl transition-all disabled:opacity-50"
                title="Invalidate Pets Cache"
              >
                <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-brand-text uppercase tracking-tight">Products Data</p>
                <p className="text-[10px] text-brand-text/40 font-mono">v{metadata.products?.version || 0}</p>
              </div>
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateMetadata('products')}
                className="p-2 hover:bg-brand-accent/10 text-brand-accent rounded-xl transition-all disabled:opacity-50"
                title="Invalidate Products Cache"
              >
                <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-accent-secondary/10">
            <button
              disabled={isUpdating}
              onClick={handleClearLocalCache}
              className="w-full py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" />
              Clear Local Cache
            </button>
            <p className="text-[8px] text-brand-text/40 font-bold uppercase tracking-widest text-center mt-2">
              This will delete all locally cached data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
