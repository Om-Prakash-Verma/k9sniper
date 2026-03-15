import React from 'react';
import { motion } from 'motion/react';
import { Dog, Cat, Bird, Fish, Rabbit, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

import { getImageUrl } from '../../utils/imageHelper';

const categories = [
  {
    id: "pet_dog_01",
    title: "Dogs Collection",
    icon: Dog,
    description: "We deal in all popular and premium dog breeds including Labrador Retriever, German Shepherd, Golden Retriever, Shih Tzu, Pomeranian, Chihuahua, Rottweiler, Doberman, Siberian Husky, Beagle, and many more.",
    image: "dog-collection.jpg",
    color: "from-orange-500/20 to-brand-accent/20",
    price: 15000,
    type: 'pet' as const
  },
  {
    id: "pet_cat_01",
    title: "Luxury & Exotic Cats",
    icon: Cat,
    description: "We offer a variety of cat breeds including Persian Cats, Himalayan Cats, Siamese Cats, British Shorthair, Maine Coon, and other exotic cats.",
    image: "cat-collection.jpg",
    color: "from-blue-500/20 to-indigo-500/20",
    price: 12000,
    type: 'pet' as const
  },
  {
    id: "pet_bird_01",
    title: "Birds Section",
    icon: Bird,
    description: "Our Birds Section includes a variety of birds such as Budgies, Cockatiels, Lovebirds, Finches, Parrots, and other available exotic birds.",
    image: "bird-collection.jpg",
    color: "from-emerald-500/20 to-teal-500/20",
    price: 2500,
    type: 'pet' as const
  },
  {
    id: "pet_fish_01",
    title: "Aquatic Collection",
    icon: Fish,
    description: "We deal in a wide range of aquatic pets including Goldfish, Koi Fish, Betta Fish, Guppies, Angelfish, and complete aquarium setup solutions.",
    image: "fish-collection.jpg",
    color: "from-cyan-500/20 to-blue-500/20",
    price: 1500,
    type: 'pet' as const
  },
  {
    id: "pet_rabbit_01",
    title: "Cute Rabbits",
    icon: Rabbit,
    description: "We deal in domestic rabbits and fancy rabbits (as per availability). We provide proper feeding guidance and cage setup assistance.",
    image: "rabbit-collection.jpg",
    color: "from-pink-500/20 to-rose-500/20",
    price: 800,
    type: 'pet' as const
  }
];

const OurPets = () => {
  const { addToCart } = useCart();

  return (
    <section id="pets" className="relative py-16 lg:py-32 bg-brand-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 lg:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Our Collection</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-4">
              Find Your <br />
              <span className="text-brand-accent">Perfect Match</span>
            </h2>
            <div className="h-px w-32 bg-brand-accent" />
          </div>
          <div className="lg:max-w-xs pt-4">
            <p className="text-brand-text text-xl leading-relaxed">
              From loyal dogs to playful cats, we curate the healthiest companions for your home.
            </p>
          </div>
        </div>

        {/* High-End Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="aspect-[3/4] rounded-[3rem] overflow-hidden relative shadow-2xl border border-brand-accent-secondary/10">
                <img 
                  src={getImageUrl(category.image)} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                
                {/* Technical Overlay */}
                <div className="absolute top-8 right-8 font-mono text-[10px] text-brand-bg-secondary/40 tracking-widest">
                  CAT_ID: 0{index + 1}
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-bg-secondary shadow-lg">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <span className="text-brand-bg-secondary font-bold uppercase tracking-widest text-xs">Category</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-4xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter leading-none">
                      {category.title}
                    </h3>
                    <div className="text-brand-accent font-bold text-xl">₹{category.price.toLocaleString()}</div>
                  </div>
                  <p className="text-brand-bg-secondary/70 text-sm leading-relaxed mb-8 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                    {category.description}
                  </p>
                  <Link 
                    to="/pets"
                    className="w-full py-5 bg-brand-accent rounded-2xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-brand-primary transition-all duration-500 flex items-center justify-center gap-2"
                  >
                    Browse Pets
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Custom "Request" Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[3/4] rounded-[3rem] bg-brand-primary p-12 flex flex-col justify-between border border-brand-accent-secondary/10 shadow-2xl"
          >
            <div>
              <div className="micro-label text-brand-accent mb-4">Special Request</div>
              <h3 className="text-5xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter leading-[0.85] mb-4">
                Looking for <br />
                Something <br />
                <span className="text-brand-accent">Unique?</span>
              </h3>
              <p className="text-brand-bg-secondary/60 text-lg">
                We can help you source specific breeds and exotic pets globally.
              </p>
            </div>
            <Link 
              to="/pets"
              className="w-full py-5 bg-brand-accent rounded-2xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-xl flex items-center justify-center gap-2"
            >
              Browse Collection
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurPets;
