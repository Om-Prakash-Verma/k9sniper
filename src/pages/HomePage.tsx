import React, { lazy, Suspense } from 'react';
import SEO from '../components/SEO';
import Hero from '../components/sections/Hero';

// Lazy load sections below the fold
const About = lazy(() => import('../components/sections/About'));
const OurPets = lazy(() => import('../components/sections/OurPets'));
const Accessories = lazy(() => import('../components/sections/Accessories'));
const ExportServices = lazy(() => import('../components/sections/ExportServices'));
const AfterCare = lazy(() => import('../components/sections/AfterCare'));
const WhyChooseUs = lazy(() => import('../components/sections/WhyChooseUs'));
const ResponsibleOwnership = lazy(() => import('../components/sections/ResponsibleOwnership'));
const VisitStore = lazy(() => import('../components/sections/VisitStore'));

const SectionFallback = () => <div className="min-h-[40vh] bg-brand-bg" />;

const HomePage = () => {
  return (
    <>
      <SEO 
        title="K9 Sniper | Premium Pets, Quality Supplies & Global Shipping"
        description="Discover premium pets and quality supplies at K9 Sniper. We offer global pet transport, expert care, and a wide selection of birds, dogs, and cats."
      />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <About />
        <OurPets />
        <Accessories />
        <ExportServices />
        <AfterCare />
        <WhyChooseUs />
        <ResponsibleOwnership />
        <VisitStore />
      </Suspense>
    </>
  );
};

export default HomePage;
