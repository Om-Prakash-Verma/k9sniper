import React from 'react';
import { motion } from 'motion/react';
import { Dog, Cat, Bird, Fish, Rabbit } from 'lucide-react';

const categories = [
  {
    title: "Dogs",
    icon: Dog,
    description: "Loyal companions including Labrador Retriever, German Shepherd, Golden Retriever, Shih Tzu, Pomeranian and more.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
    color: "from-orange-500/20 to-brand-accent/20"
  },
  {
    title: "Cats",
    icon: Cat,
    description: "Elegant breeds including Persian, Himalayan, Siamese and British Shorthair.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    title: "Birds",
    icon: Bird,
    description: "Colorful birds including Budgies, Cockatiels, Lovebirds and Finches.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=800",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Aquatic Pets",
    icon: Fish,
    description: "Beautiful aquarium fish including Betta Fish, Goldfish, Guppies and Angelfish.",
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=800",
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Rabbits",
    icon: Rabbit,
    description: "Cute and friendly domestic rabbits perfect for families.",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800",
    color: "from-pink-500/20 to-rose-500/20"
  }
];

const OurPets = () => {
  return (
    <section id="pets" className="relative py-24 lg:py-48 bg-brand-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <div className="micro-label mb-4">Our Collection</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-none text-brand-primary">
              Find Your <br />
              <span className="text-brand-accent">Perfect Match</span>
            </h2>
          </div>
          <p className="hidden lg:block text-brand-text text-lg max-w-xs md:text-right">
            From loyal dogs to playful cats, we curate the healthiest companions for your home.
          </p>
        </div>

        {/* Mobile/Tablet Snap Carousel (hidden on lg) */}
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto snap-x snap-mandatory no-scrollbar flex gap-6 pb-8">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              className="snap-center shrink-0 w-[85vw] md:w-[60vw] relative group"
            >
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-sm border border-brand-accent-secondary/10">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-brand-bg-secondary">
                      <category.icon className="w-5 h-5" />
                    </div>
                    <span className="text-brand-bg-secondary font-bold uppercase tracking-widest text-sm">{category.title}</span>
                  </div>
                  <h3 className="text-4xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter leading-none mb-6">
                    {category.title}
                  </h3>
                  <button className="w-full py-4 bg-brand-bg-secondary/20 backdrop-blur-md border border-brand-bg-secondary/30 rounded-2xl text-brand-bg-secondary font-bold uppercase text-xs tracking-widest hover:bg-brand-accent transition-all">
                    View Breeds
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Bento Grid (hidden on mobile/tablet) */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[800px]">
          {/* Main Feature: Dogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bento-card group"
          >
            <img 
              src={categories[0].image} 
              alt="Dogs" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10">
              <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center mb-6">
                <Dog className="text-brand-bg-secondary w-6 h-6" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter mb-4">Dogs</h3>
              <p className="text-brand-bg-secondary/80 text-lg max-w-sm">Labrador, German Shepherd, Golden Retriever, Shih Tzu, and more.</p>
            </div>
          </motion.div>

          {/* Cats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bento-card group"
          >
            <img 
              src={categories[1].image} 
              alt="Cats" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-bg-secondary/20 backdrop-blur-md flex items-center justify-center">
                  <Cat className="text-brand-bg-secondary w-5 h-5" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter">Cats</h3>
              </div>
            </div>
          </motion.div>

          {/* Birds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bento-card group"
          >
            <img 
              src={categories[2].image} 
              alt="Birds" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter">Birds</h3>
            </div>
          </motion.div>

          {/* Aquatic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bento-card group"
          >
            <img 
              src={categories[3].image} 
              alt="Aquatic" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter">Aquatic</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurPets;
