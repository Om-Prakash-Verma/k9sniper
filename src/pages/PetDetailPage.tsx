import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Dog, ArrowLeft, ShieldCheck, Truck, Heart, MessageCircle, Instagram } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useShopData } from '../context/ShopDataContext';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';
import { shopDb } from '../db/shopDb';

const PetDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pets, loading: shopLoading } = useShopData();
  const [pet, setPet] = useState<any>(null);
  const [settings, setSettings] = useState<any>({ whatsapp: '', instagram: '' });
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    });

    const fetchPetData = async () => {
      // 1. Try to find in in-memory cache
      const foundPet = pets.find(p => p.slug === slug || p.id === slug);
      if (foundPet) {
        setPet(foundPet);
        setLoading(false);
        return;
      }

      // 2. Try to find in IndexedDB
      try {
        const idbPet = await shopDb.pets.where('slug').equals(slug as string).first() || 
                       await shopDb.pets.get(slug as string);
        if (idbPet) {
          setPet(idbPet);
          setLoading(false);
          // Update lastAccessed for LRU
          shopDb.pets.update(idbPet.id, { lastAccessed: Date.now() });
          return;
        }
      } catch (err) {
        console.error('IndexedDB fetch failed:', err);
      }

      // 3. If not in cache or IDB, fetch on demand from Firestore
      try {
        // Try by ID first
        let petDoc = await getDoc(doc(db, 'pets', slug as string));
        if (petDoc.exists()) {
          setPet({ id: petDoc.id, ...petDoc.data() });
          setLoading(false);
          return;
        }

        // Try by slug
        const q = query(collection(db, 'pets'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPet({ id: doc.id, ...doc.data() });
          setLoading(false);
          return;
        }

        // Truly not found
        navigate('/pets');
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'pet_detail_fetch');
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    };

    if (!shopLoading) {
      fetchPetData();
    }

    return () => unsubSettings();
  }, [slug, navigate, pets, shopLoading]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in ${pet.name} (${pet.breed}). Can you provide more details?`);
    window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank');
  };

  const handleInstagram = () => {
    window.open(`https://instagram.com/${settings.instagram}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
    </div>
  );

  if (!pet) return null;

  const images = [pet.image, ...(pet.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-[10px] md:text-xs mb-8 md:mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-brand-accent-secondary/10 relative group">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={pet.name} 
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
                    <img src={getImageUrl(img)} alt={`${pet.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
            <div className="micro-label text-brand-accent mb-4">Pet Details</div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.9] text-brand-primary mb-8 break-words">
              {pet.name}
            </h1>
            
            <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
              <div className="px-4 md:px-6 py-2 md:py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-2 md:gap-3">
                <Dog className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{pet.breed || 'Pure Breed'}</span>
              </div>
              <div className="px-4 md:px-6 py-2 md:py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-2 md:gap-3">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{pet.vaccinationStatus || 'Health Certified'}</span>
              </div>
              <div className="px-4 md:px-6 py-2 md:py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-2 md:gap-3">
                <Truck className="w-4 h-4 md:w-5 md:h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Global Shipping</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8 md:mb-12">
              <p className="text-brand-text text-lg md:text-xl leading-relaxed break-words whitespace-pre-wrap">
                {pet.description}
              </p>
            </div>

            {/* Detailed Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
              {[
                { label: 'Age', value: pet.age },
                { label: 'Gender', value: pet.gender },
                { label: 'Color', value: pet.color },
                { label: 'Weight', value: pet.weight },
                { label: 'Origin', value: pet.origin },
                { label: 'Health', value: pet.healthStatus },
                { label: 'Energy', value: pet.energyLevel },
                { label: 'Shedding', value: pet.sheddingLevel },
                { label: 'Grooming', value: pet.groomingNeeds }
              ].map((spec, i) => spec.value && (
                <div key={i} className="p-3 md:p-4 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/5">
                  <div className="text-[8px] font-bold text-brand-accent uppercase tracking-widest mb-1">{spec.label}</div>
                  <div className="text-xs md:text-sm font-bold text-brand-primary uppercase">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 p-6 bg-brand-bg-secondary rounded-3xl border border-brand-accent-secondary/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs">Temperament</h4>
                  <p className="text-brand-text/60 text-sm">{pet.temperament || 'Friendly, Loyal, and Highly Intelligent'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleWhatsApp}
                className="flex-1 btn-premium py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-brand-bg-secondary font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl"
              >
                <MessageCircle className="w-5 h-5" />
                Contact on WhatsApp
              </button>
              <button 
                onClick={handleInstagram}
                className="flex-1 py-5 md:py-6 bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-[1.5rem] md:rounded-[2rem] text-brand-primary font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all flex items-center justify-center gap-3"
              >
                <Instagram className="w-5 h-5" />
                Inquire on Instagram
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;
