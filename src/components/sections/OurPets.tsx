import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dog, 
  Cat, 
  Bird, 
  Fish, 
  Rabbit, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';

const petCategories = [
  {
    id: "dogs",
    title: "Dogs",
    tagline: "All Major Breeds Available",
    icon: Dog,
    description: "Dogs are known for their loyalty, intelligence, and companionship. At K9SNIPERS, we offer a wide range of popular and premium dog breeds.",
    breeds: [
      "Labrador Retriever", "German Shepherd", "Golden Retriever", "Shih Tzu", 
      "Pomeranian", "Chihuahua", "Rottweiler", "Doberman", "Siberian Husky", "Beagle",
      "Other available breeds"
    ],
    guidance: "All dogs are provided with basic health guidance and breed-specific care instructions to help new pet owners understand their responsibilities.",
    images: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1543466835-00a7907e9ef1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800"
    ],
    theme: "bg-orange-500/5",
    accent: "text-orange-600"
  },
  {
    id: "cats",
    title: "Cats",
    tagline: "Elegant and Loving Companions",
    icon: Cat,
    description: "Cats are independent yet affectionate companions that adapt well to indoor environments.",
    breeds: [
      "Persian Cats", "Himalayan Cats", "Siamese Cats", 
      "British Shorthair", "Maine Coon", "Exotic Cats"
    ],
    guidancePoints: [
      "Feeding habits",
      "Grooming care",
      "Hygiene maintenance",
      "Living environment"
    ],
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800"
    ],
    theme: "bg-blue-500/5",
    accent: "text-blue-600"
  },
  {
    id: "birds",
    title: "Birds",
    tagline: "Colorful and Intelligent Pets",
    icon: Bird,
    description: "Birds are wonderful companions known for their vibrant colors and lively personalities.",
    breeds: [
      "Budgies", "Cockatiels", "Lovebirds", "Finches", "Parrots", "Exotic Birds"
    ],
    guidancePoints: [
      "Bird cages",
      "Bird feed",
      "Maintenance guidance"
    ],
    images: [
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552728089-57bdde30fc3b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522850959073-3220176ef848?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=800"
    ],
    theme: "bg-emerald-500/5",
    accent: "text-emerald-600"
  },
  {
    id: "fish",
    title: "Fish & Aquarium",
    tagline: "Aquarium Solutions",
    icon: Fish,
    description: "Aquariums bring beauty and calmness to homes and offices. Our aquarium section includes a variety of vibrant species.",
    breeds: [
      "Goldfish", "Koi Fish", "Betta Fish", "Guppies", "Angelfish"
    ],
    guidancePoints: [
      "Aquarium tanks",
      "Water filters",
      "Decorative items",
      "Fish feed",
      "Maintenance guidance"
    ],
    images: [
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509105112151-31366966f96f?auto=format&fit=crop&q=80&w=800"
    ],
    theme: "bg-cyan-500/5",
    accent: "text-cyan-600"
  },
  {
    id: "rabbits",
    title: "Rabbits",
    tagline: "Gentle and Friendly Pets",
    icon: Rabbit,
    description: "Rabbits are adorable and gentle pets suitable for families and children.",
    breeds: [
      "Domestic Rabbits", "Fancy Rabbits"
    ],
    guidancePoints: [
      "Feeding habits",
      "Cage setup",
      "Basic rabbit care"
    ],
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1591384382880-418fd4329461?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1559214369-a6b1d7919865?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800"
    ],
    theme: "bg-rose-500/5",
    accent: "text-rose-600"
  }
];

const PetCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden group shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={getImageUrl(images[currentIndex])}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute inset-x-4 bottom-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button 
          onClick={prev}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/40'}`} 
            />
          ))}
        </div>
        <button 
          onClick={next}
          className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const OurPets = () => {
  return (
    <section id="pets" className="bg-brand-bg">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Our Diverse Collection</div>
            <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary">
              Our <span className="text-brand-accent">Pets</span>
            </h2>
          </div>
          <p className="text-brand-text text-xl max-w-xs leading-relaxed font-medium">
            Discover a world of healthy, happy companions curated for every home.
          </p>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-px bg-brand-accent-secondary/10">
        {petCategories.map((category, index) => (
          <div 
            key={category.id} 
            className={`relative py-20 lg:py-32 overflow-hidden ${category.theme}`}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Content Pane */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={index % 2 !== 0 ? 'lg:order-2' : ''}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${category.accent} shadow-xl`}>
                      <category.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="micro-label text-brand-accent">{category.tagline}</div>
                      <h3 className="text-4xl md:text-6xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-none">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-brand-text text-xl md:text-2xl leading-relaxed mb-10 font-medium">
                    {category.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                    <div>
                      <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-4">Available Breeds</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.breeds.map((breed) => (
                          <span 
                            key={breed} 
                            className="px-3 py-1.5 bg-white rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-wider border border-brand-accent-secondary/10 shadow-sm"
                          >
                            {breed}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className={`w-4 h-4 ${category.accent}`} />
                        <h4 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Care Guidance</h4>
                      </div>
                      {category.guidance && (
                        <p className="text-brand-text text-sm leading-relaxed italic">
                          {category.guidance}
                        </p>
                      )}
                      {category.guidancePoints && (
                        <ul className="space-y-2">
                          {category.guidancePoints.map((point, i) => (
                            <li key={i} className="flex items-center gap-2 text-brand-text text-sm font-medium italic">
                              <div className={`w-1 h-1 rounded-full ${category.accent.replace('text-', 'bg-')}`} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <Link 
                    to="/pets"
                    className="inline-flex items-center gap-3 btn-premium px-10 py-5 rounded-2xl text-brand-bg-secondary font-bold uppercase tracking-widest group"
                  >
                    View Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>

                {/* Carousel Pane */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={index % 2 !== 0 ? 'lg:order-1' : ''}
                >
                  <PetCarousel images={category.images} />
                </motion.div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-brand-primary text-brand-bg-secondary text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.85] mb-8">
            Ready to meet your <br />
            <span className="text-brand-accent italic">New Best Friend?</span>
          </h2>
          <p className="text-brand-bg-secondary/60 text-xl mb-12 max-w-2xl mx-auto">
            Visit our store in Mayur Vihar Phase 3 or contact us to inquire about specific breeds and availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pets" className="btn-premium bg-brand-accent text-brand-bg-secondary px-12 py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary">
              Browse All Pets
            </Link>
            <a href="#contact" className="px-12 py-6 border border-white/20 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPets;
