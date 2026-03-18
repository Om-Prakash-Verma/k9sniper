import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
            }`}>
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-brand-primary mb-2 uppercase tracking-tight">
              {title}
            </h3>
            <p className="text-brand-primary/60 mb-8 leading-relaxed">
              {message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs border border-brand-primary/10 hover:bg-brand-bg transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-white transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                  type === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-brand-accent hover:bg-brand-accent-secondary shadow-brand-accent/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
