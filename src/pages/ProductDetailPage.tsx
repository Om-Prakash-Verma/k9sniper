import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShoppingCart, ShieldCheck, Truck, Package } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          if (data.variations && data.variations.length > 0) {
            setSelectedVariation(data.variations[0]);
          }
        } else {
          navigate('/products');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const images = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-[10px] md:text-xs mb-8 md:mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="aspect-square rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-brand-accent-secondary/10 bg-brand-bg-secondary relative group">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-brand-accent scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="micro-label text-brand-accent mb-4">{product.brand || 'Premium Product'}</div>
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-8">
              {product.name}
            </h1>
            
            <div className="text-3xl md:text-4xl font-display font-bold text-brand-accent mb-8 md:mb-12">
              ₹{currentPrice?.toLocaleString()}
            </div>

            {/* Variations Selector */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-8 md:mb-12">
                <div className="text-[10px] font-bold text-brand-text/60 uppercase tracking-widest mb-4">Select Variation</div>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((v: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold uppercase text-[8px] md:text-[10px] tracking-widest transition-all ${
                        selectedVariation?.label === v.label
                          ? 'bg-brand-accent text-brand-bg-secondary shadow-lg'
                          : 'bg-brand-bg-secondary text-brand-primary border border-brand-accent-secondary/10 hover:border-brand-accent'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
              <div className="px-4 md:px-6 py-2 md:py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-2 md:gap-3">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[8px] md:text-[10px]">
                  {selectedVariation ? `${selectedVariation.stock} In Stock` : (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
                </span>
              </div>
              <div className="px-4 md:px-6 py-2 md:py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-2 md:gap-3">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Quality Guaranteed</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8 md:mb-12">
              <p className="text-brand-text text-lg md:text-xl leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Additional Details Tabs/Accordion Style */}
            <div className="space-y-4 mb-12">
              {product.specifications && (
                <div className="p-4 md:p-6 bg-brand-bg-secondary rounded-3xl border border-brand-accent-secondary/10">
                  <h4 className="text-brand-primary font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">Specifications</h4>
                  <p className="text-brand-text/60 text-xs md:text-sm whitespace-pre-wrap">{product.specifications}</p>
                </div>
              )}
              {product.ingredients && (
                <div className="p-4 md:p-6 bg-brand-bg-secondary rounded-3xl border border-brand-accent-secondary/10">
                  <h4 className="text-brand-primary font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">Ingredients</h4>
                  <p className="text-brand-text/60 text-xs md:text-sm whitespace-pre-wrap">{product.ingredients}</p>
                </div>
              )}
              {product.usageInstructions && (
                <div className="p-4 md:p-6 bg-brand-bg-secondary rounded-3xl border border-brand-accent-secondary/10">
                  <h4 className="text-brand-primary font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">Usage Instructions</h4>
                  <p className="text-brand-text/60 text-xs md:text-sm whitespace-pre-wrap">{product.usageInstructions}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart({ 
                  ...product, 
                  price: currentPrice,
                  name: selectedVariation ? `${product.name} (${selectedVariation.label})` : product.name,
                  type: 'product' 
                })}
                className="flex-1 btn-premium py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-brand-bg-secondary font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="flex-1 py-5 md:py-6 bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-[1.5rem] md:rounded-[2rem] text-brand-primary font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all">
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
