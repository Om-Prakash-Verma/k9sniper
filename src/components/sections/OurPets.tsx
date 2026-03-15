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
    <section id="pets" className="py-24 md:py-32 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            Our <span className="text-brand-accent">Pets</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-body max-w-2xl mx-auto"
          >
            Find the perfect companion for your home.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-3xl overflow-hidden bg-brand-bg-secondary border border-white/5 hover:border-brand-accent/30 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-brand-bg-secondary via-brand-bg-secondary/20 to-transparent opacity-60`} />
              </div>

              <div className="p-8 relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors duration-500">
                    <category.icon className="w-6 h-6 text-brand-accent group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
                <p className="text-text-body leading-relaxed">
                  {category.description}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-brand-accent font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  View Breeds <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* Soft Glow Effect */}
              <div className="absolute -inset-px bg-gradient-to-br from-brand-accent/0 via-brand-accent/0 to-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPets;
