import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Dog, ArrowLeft, ShoppingCart, ShieldCheck, Truck, Heart } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'pets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPet({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/pets');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `pets/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
    </div>
  );

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-xs mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border border-brand-accent-secondary/10">
              <img 
                src={getImageUrl(pet.image)} 
                alt={pet.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-accent rounded-full flex flex-col items-center justify-center text-brand-bg-secondary shadow-2xl border-8 border-brand-bg">
              <div className="text-sm font-bold uppercase tracking-widest mb-1">Price</div>
              <div className="text-3xl font-display font-bold">₹{pet.petPrice || pet.price?.toLocaleString()}</div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="micro-label text-brand-accent mb-4">Pet Details</div>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-8">
              {pet.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <div className="px-6 py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-3">
                <Dog className="w-5 h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px]">{pet.breed || 'Pure Breed'}</span>
              </div>
              <div className="px-6 py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px]">{pet.vaccinationStatus || 'Health Certified'}</span>
              </div>
              <div className="px-6 py-3 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/10 flex items-center gap-3">
                <Truck className="w-5 h-5 text-brand-accent" />
                <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px]">Global Shipping</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-brand-text text-xl leading-relaxed">
                {pet.description}
              </p>
            </div>

            {/* Detailed Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
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
                <div key={i} className="p-4 bg-brand-bg-secondary rounded-2xl border border-brand-accent-secondary/5">
                  <div className="text-[8px] font-bold text-brand-accent uppercase tracking-widest mb-1">{spec.label}</div>
                  <div className="text-sm font-bold text-brand-primary uppercase">{spec.value}</div>
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
                onClick={() => addToCart({ ...pet, type: 'pet' })}
                className="flex-1 btn-premium py-6 rounded-[2rem] text-brand-bg-secondary font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="flex-1 py-6 bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-[2rem] text-brand-primary font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all">
                Contact Specialist
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;
