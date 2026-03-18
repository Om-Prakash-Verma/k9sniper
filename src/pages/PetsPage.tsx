import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dog, Search, Filter, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { useShopData } from '../context/ShopDataContext';
import { getImageUrl } from '../utils/imageHelper';

const PetsPage = () => {
  const { pets, loading, loadingMore, hasMorePets, loadMorePets } = useShopData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:text-left text-center md:mb-16 gap-8">
          <div className="max-w-2xl w-full">
            <div className="micro-label mb-4 text-brand-accent">Available Companions</div>
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-6">
              Our <span className="text-brand-accent">Pets</span>
            </h1>
            <p className="text-brand-text text-lg md:text-xl leading-relaxed">
              Browse our curated collection of healthy, happy pets waiting for their forever homes.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by breed or name..."
              className="w-full bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-2xl py-3 md:py-4 pl-12 pr-6 text-brand-primary outline-none focus:border-brand-accent transition-all text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && pets.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-brand-bg-secondary rounded-[3rem] overflow-hidden border border-brand-accent-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <Link to={`/pet/${pet.slug || pet.id}`} className="block">
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
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-6 md:p-8">
                    <p className="text-brand-text/70 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 line-clamp-2">
                      {pet.description}
                    </p>
                    <Link 
                      to={`/pet/${pet.slug || pet.id}`}
                      className="w-full py-3 md:py-4 bg-brand-accent/10 text-brand-accent rounded-2xl font-bold uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all duration-500 flex items-center justify-center gap-2"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMorePets && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={loadMorePets}
                  disabled={loadingMore}
                  className="px-12 py-5 bg-brand-primary text-brand-bg-secondary rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-accent transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-bg-secondary/30 border-t-brand-bg-secondary rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Pets'
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

export default PetsPage;
