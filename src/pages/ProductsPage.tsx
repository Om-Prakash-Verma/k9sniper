import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, ChevronRight, ShoppingCart } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useShopData } from '../context/ShopDataContext';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';
import { Product } from '../types';

const ProductsPage = () => {
  const { products, loading, error, loadingMore, hasMoreProducts, loadMoreProducts, searchProducts } = useShopData();
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const performSearch = async () => {
      const results = await searchProducts(searchTerm);
      setFilteredProducts(results);
    };
    performSearch();
  }, [searchTerm, products, searchProducts]);

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg pt-32 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-brand-primary uppercase mb-4">Failed to load products</h2>
          <p className="text-brand-text/60 mb-8">There was an error connecting to our shop database. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-premium px-8 py-4 rounded-2xl text-brand-bg-secondary font-bold uppercase text-xs tracking-widest"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:text-left text-center md:mb-16 gap-8">
          <div className="max-w-2xl w-full">
            <div className="micro-label mb-4 text-brand-accent">Premium Catalog</div>
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-6">
              Pet <span className="text-brand-accent">Essentials</span>
            </h1>
            <p className="text-brand-text text-lg md:text-xl leading-relaxed">
              High-quality food, accessories, and grooming supplies for your beloved companions.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent w-5 h-5" />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-2xl py-3 md:py-4 pl-12 pr-6 text-brand-primary outline-none focus:border-brand-accent transition-all text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-brand-bg-secondary rounded-[2.5rem] overflow-hidden border border-brand-accent-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <Link to={`/product/${product.slug || product.id}`} className="block aspect-square overflow-hidden">
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="text-lg md:text-xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-tight">
                        <Link to={`/product/${product.slug || product.id}`}>{product.name}</Link>
                      </h3>
                      <div className="text-brand-accent font-bold text-base md:text-lg whitespace-nowrap">₹{product.price?.toLocaleString()}</div>
                    </div>
                    <p className="text-brand-text/60 text-xs md:text-sm mb-6 md:mb-8 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="flex gap-2">
                      <Link 
                        to={`/product/${product.slug || product.id}`}
                        className="flex-1 py-2.5 md:py-3 bg-brand-bg border border-brand-accent-secondary/20 rounded-xl text-brand-primary font-bold uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all flex items-center justify-center"
                      >
                        Details
                      </Link>
                      <button 
                        onClick={() => addToCart({ ...product, type: 'product' })}
                        className="p-2.5 md:p-3 bg-brand-accent text-brand-bg-secondary rounded-xl hover:bg-brand-primary transition-all shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMoreProducts && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                  className="px-12 py-5 bg-brand-primary text-brand-bg-secondary rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-bg-secondary/30 border-t-brand-bg-secondary rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
