import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginPageProps {
  isAdmin: boolean;
  user: any;
  onSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ isAdmin, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      let message = "Authentication failed";
      if (err.code === 'auth/user-not-found') message = "User not found";
      if (err.code === 'auth/wrong-password') message = "Incorrect password";
      if (err.code === 'auth/email-already-in-use') message = "Email already in use";
      if (err.code === 'auth/weak-password') message = "Password is too weak";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-bg-secondary rounded-[3rem] p-8 md:p-12 border border-brand-accent-secondary/10 shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-brand-accent" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-brand-primary uppercase tracking-tighter mb-2">
          {isRegistering ? 'Create Account' : 'Admin Access'}
        </h1>
        
        <p className="text-brand-text/60 mb-8 text-sm leading-relaxed">
          {isRegistering 
            ? 'Join the K9 SNIPERS community to manage your preferences.' 
            : 'Please sign in with your credentials to manage the catalog and orders.'}
        </p>

        {user && !isAdmin && !isRegistering && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs text-left"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Access Denied. Your account does not have administrator privileges.</p>
          </motion.div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-accent uppercase tracking-widest ml-2">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-bg border border-brand-accent-secondary/20 rounded-2xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-accent uppercase tracking-widest ml-2">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-bg border border-brand-accent-secondary/20 rounded-2xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-premium py-5 rounded-2xl flex items-center justify-center gap-3 text-brand-bg-secondary font-bold uppercase tracking-widest disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-brand-bg-secondary/30 border-t-brand-bg-secondary rounded-full animate-spin" />
            ) : (
              isRegistering ? 'Register' : 'Sign In'
            )}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-6 text-xs font-bold text-brand-accent hover:text-brand-primary transition-colors uppercase tracking-widest"
        >
          {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Secure Gateway
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
