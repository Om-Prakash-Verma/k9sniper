import React from 'react';
import ScrollytellingCanvas from '../components/ScrollytellingCanvas';
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
      <ScrollytellingCanvas />
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
