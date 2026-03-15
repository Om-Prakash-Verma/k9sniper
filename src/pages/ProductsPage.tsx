import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, ChevronRight, ShoppingCart } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'products')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Premium Catalog</div>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-6">
              Pet <span className="text-brand-accent">Essentials</span>
            </h1>
            <p className="text-brand-text text-xl leading-relaxed">
              High-quality food, accessories, and grooming supplies for your beloved companions.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent w-5 h-5" />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-2xl py-4 pl-12 pr-6 text-brand-primary outline-none focus:border-brand-accent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-brand-bg-secondary rounded-[2.5rem] overflow-hidden border border-brand-accent-secondary/10 flex flex-col hover:border-brand-accent/30 transition-all duration-500"
              >
                <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-tight">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="text-brand-accent font-bold">₹{product.price?.toLocaleString()}</div>
                  </div>
                  <p className="text-brand-text/60 text-sm mb-8 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <Link 
                      to={`/product/${product.id}`}
                      className="flex-1 py-3 bg-brand-bg border border-brand-accent-secondary/20 rounded-xl text-brand-primary font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all flex items-center justify-center"
                    >
                      Details
                    </Link>
                    <button 
                      onClick={() => addToCart({ ...product, type: 'product' })}
                      className="p-3 bg-brand-accent text-brand-bg-secondary rounded-xl hover:bg-brand-primary transition-all shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
