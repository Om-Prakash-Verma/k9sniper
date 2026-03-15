import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dog, Search, Filter, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { getImageUrl } from '../utils/imageHelper';

const PetsPage = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'pets')), (snapshot) => {
      setPets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'pets');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Available Companions</div>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-6">
              Our <span className="text-brand-accent">Pets</span>
            </h1>
            <p className="text-brand-text text-xl leading-relaxed">
              Browse our curated collection of healthy, happy pets waiting for their forever homes.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by breed or name..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-brand-bg-secondary rounded-[3rem] overflow-hidden border border-brand-accent-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <Link to={`/pet/${pet.id}`} className="block">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={getImageUrl(pet.image)} 
                      alt={pet.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-brand-accent font-bold uppercase tracking-widest text-[10px] mb-2">Available Now</div>
                          <h3 className="text-3xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter leading-none">
                            {pet.name}
                          </h3>
                        </div>
                        <div className="text-brand-accent font-bold text-xl">₹{pet.price?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-8">
                  <p className="text-brand-text/70 text-sm leading-relaxed mb-8 line-clamp-2">
                    {pet.description}
                  </p>
                  <Link 
                    to={`/pet/${pet.id}`}
                    className="w-full py-4 bg-brand-accent/10 text-brand-accent rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all duration-500 flex items-center justify-center gap-2"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;
