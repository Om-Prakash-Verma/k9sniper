import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import OurPets from '../components/sections/OurPets';
import Accessories from '../components/sections/Accessories';
import ExportServices from '../components/sections/ExportServices';
import AfterCare from '../components/sections/AfterCare';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import ResponsibleOwnership from '../components/sections/ResponsibleOwnership';
import VisitStore from '../components/sections/VisitStore';

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <OurPets />
      <Accessories />
      <ExportServices />
      <AfterCare />
      <WhyChooseUs />
      <ResponsibleOwnership />
      <VisitStore />
    </>
  );
};

export default HomePage;
