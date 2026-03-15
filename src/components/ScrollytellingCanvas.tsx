import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';

interface Section {
  start: number;
  end: number;
  title: string;
  subtitle?: string;
  content?: string;
  isFinal?: boolean;
}

const ScrollytellingCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const frameCount = 240; // Updated to 240 frames
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Preload images with improved strategy
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(frameCount);
    let loadedCount = 0;
    let isComponentMounted = true;

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameIndex = (index + 1).toString().padStart(3, '0');
        img.src = `/frames/ezgif-frame-${frameIndex}.jpg`;
        
        img.onload = async () => {
          if (!isComponentMounted) return resolve();
          
          try {
            // Ensure image is decoded before resolving to prevent flickering during draw
            if ('decode' in img) {
              await img.decode();
            }
          } catch (e) {
            console.warn(`Decode failed for frame ${frameIndex}`, e);
          }

          loadedImages[index] = img;
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / frameCount) * 100));
          
          if (loadedCount === frameCount) {
            setImages([...loadedImages]);
            setIsLoaded(true);
          }
          resolve();
        };
        
        img.onerror = () => {
          console.error(`Failed to load frame ${frameIndex}`);
          loadedCount++;
          if (loadedCount === frameCount) {
            setImages([...loadedImages]);
            setIsLoaded(true);
          }
          resolve();
        };
      });
    };

    const preloadAll = async () => {
      // Load first 10 frames with high priority
      const priorityFrames = Array.from({ length: 10 }, (_, i) => i);
      await Promise.all(priorityFrames.map(loadFrame));
      
      // Load the rest in batches to avoid network saturation
      const batchSize = 5;
      for (let i = 10; i < frameCount; i += batchSize) {
        if (!isComponentMounted) break;
        const batch = Array.from({ length: Math.min(batchSize, frameCount - i) }, (_, j) => i + j);
        await Promise.all(batch.map(loadFrame));
      }
    };

    preloadAll();

    return () => {
      isComponentMounted = false;
    };
  }, []);

  // Canvas rendering
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const lastFrameIndex = { current: -1 };

    const render = () => {
      const currentProgress = smoothProgress.get();
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(currentProgress * frameCount)
      );

      if (frameIndex !== lastFrameIndex.current && images[frameIndex]) {
        lastFrameIndex.current = frameIndex;
        const img = images[frameIndex];
        
        // Calculate aspect ratio to cover canvas (object-fit: cover equivalent)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawHeight = canvas.height;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Add a subtle warm vignette/overlay to make text readable
        const gradient = context.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.2
        );
        gradient.addColorStop(0, 'rgba(232, 223, 200, 0.1)'); // Primary BG color with alpha
        gradient.addColorStop(1, 'rgba(90, 52, 30, 0.4)'); // Brand text color with alpha
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    const animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isLoaded, images, smoothProgress]);

  // Content sections data
  const sections: Section[] = [
    {
      start: 0,
      end: 0.15,
      title: "K9 Snipers Dog Shop",
      subtitle: "Where healthy pets find happy homes",
      content: "Your trusted destination for pets, care, and companionship."
    },
    {
      start: 0.15,
      end: 0.35,
      title: "A world of pets.",
      content: "From loyal dogs to playful cats, find the perfect companion for your lifestyle."
    },
    {
      start: 0.35,
      end: 0.55,
      title: "Premium Breeds.",
      content: "Labrador, Golden Retriever, German Shepherd, Shih Tzu, and many more."
    },
    {
      start: 0.55,
      end: 0.75,
      title: "Expert Care.",
      content: "Vaccination guidance, feeding advice, and training support for every pet."
    },
    {
      start: 0.75,
      end: 0.9,
      title: "Everything they need.",
      content: "High-quality accessories, premium food, and essential healthcare products."
    },
    {
      start: 0.9,
      end: 1,
      title: "Join the Family.",
      subtitle: "Visit us today",
      isFinal: true
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-brand-bg">
      <div className="sticky top-0 w-full h-screen overflow-hidden relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-bg z-50">
            <div className="w-64 h-1 bg-brand-primary/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-accent"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="mt-4 text-brand-primary/50 text-xs uppercase tracking-widest font-bold">Loading Experience {loadProgress}%</p>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {sections.map((section, index) => {
            return (
              <SectionContent 
                key={index} 
                section={section} 
                progress={scrollYProgress} 
              />
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          {sections.map((_, i) => {
            return (
              <ProgressDot 
                key={i} 
                index={i} 
                total={sections.length} 
                progress={scrollYProgress} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SectionContent: React.FC<{ section: Section; progress: any }> = ({ section, progress }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = progress.on("change", (latest: number) => {
      setIsVisible(latest >= section.start && latest < section.end);
    });
    return () => unsubscribe();
  }, [progress, section.start, section.end]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="max-w-4xl">
            <motion.h2 
              className="text-3xl sm:text-5xl md:text-8xl font-display font-bold mb-3 md:mb-6 tracking-tighter text-brand-primary uppercase leading-[0.9]"
              style={{ textShadow: '0 4px 20px rgba(232, 223, 200, 0.8)' }}
            >
              {section.title}
            </motion.h2>
            {section.subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-xl md:text-3xl text-brand-accent font-bold mb-2 md:mb-4 uppercase tracking-widest"
              >
                {section.subtitle}
              </motion.p>
            )}
            {section.content && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-lg md:text-2xl text-brand-text max-w-2xl mx-auto font-bold px-4"
              >
                {section.content}
              </motion.p>
            )}
            {section.isFinal && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-6 justify-center pointer-events-auto"
              >
                <button className="btn-premium px-8 md:px-10 py-3.5 md:py-5 rounded-full text-brand-bg-secondary font-bold transition-all transform hover:scale-105 shadow-xl uppercase tracking-tighter text-xs md:text-base">
                  Explore Shop
                </button>
                <button className="bg-brand-bg-secondary/80 hover:bg-brand-bg-secondary backdrop-blur-md text-brand-primary px-8 md:px-10 py-3.5 md:py-5 rounded-full font-bold transition-all border border-brand-accent-secondary/20 uppercase tracking-tighter text-xs md:text-base shadow-sm">
                  Contact Us
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProgressDot: React.FC<{ index: number; total: number; progress: any }> = ({ index, total, progress }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const targetProgress = index / (total - 1);
    const unsubscribe = progress.on("change", (latest: number) => {
      setIsActive(Math.abs(latest - targetProgress) < 0.1);
    });
    return () => unsubscribe();
  }, [progress, index, total]);

  return (
    <div 
      className={`w-1 transition-all duration-700 ease-out ${isActive ? 'h-12 bg-brand-accent' : 'h-4 bg-brand-primary/20'}`} 
    />
  );
};

export default ScrollytellingCanvas;
