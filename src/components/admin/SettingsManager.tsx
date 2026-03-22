import React, { useState } from 'react';
import { RefreshCw, Save, Shield, Database } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';

import { Metadata } from '../../types';

interface SettingsManagerProps {
  metadata: Metadata;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ metadata }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateMetadata = async (type: 'pets' | 'products') => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const metadataRef = doc(db, 'metadata', type);
      await updateDoc(metadataRef, {
        lastUpdated: serverTimestamp(),
        version: (metadata[type]?.version || 0) + 1
      });
      setMessage({ text: `${type.charAt(0).toUpperCase() + type.slice(1)} cache invalidated successfully!`, type: 'success' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `metadata/${type}`);
      setMessage({ text: `Failed to update ${type} metadata.`, type: 'error' });
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
        {/* Cache Management */}
        <div className="bg-brand-bg-secondary p-8 rounded-[2rem] border border-brand-accent-secondary/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-accent/10 rounded-2xl">
              <Database className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight">Cache Control</h3>
              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Force client-side data refresh</p>
            </div>
          </div>

          <div className="space-y-4">
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
        </div>

        {/* System Info */}
        <div className="bg-brand-bg-secondary p-8 rounded-[2rem] border border-brand-accent-secondary/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-accent/10 rounded-2xl">
              <Shield className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight">Security & System</h3>
              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">Admin access & shop status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5">
              <p className="text-xs font-bold text-brand-text uppercase tracking-tight">Shop Status</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live & Accepting Orders</span>
              </div>
            </div>

            <div className="p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5">
              <p className="text-xs font-bold text-brand-text uppercase tracking-tight">Admin Role</p>
              <p className="mt-1 text-[10px] text-brand-text/60 font-medium">Your account has full administrative privileges.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
