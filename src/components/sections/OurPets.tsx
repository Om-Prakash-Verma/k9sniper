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
                  src={category.image} 
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
                  <h3 className="text-4xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter leading-none mb-4">
                    {category.title}
                  </h3>
                  <p className="text-brand-bg-secondary/70 text-sm leading-relaxed mb-8 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                    {category.description}
                  </p>
                  <button className="w-full py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:border-brand-accent transition-all duration-500">
                    Explore Breeds
                  </button>
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
            <button className="w-full py-5 bg-brand-accent rounded-2xl text-brand-bg-secondary font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-xl">
              Contact Specialist
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurPets;
