
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import VolunteerSection from '../components/VolunteerSection';
import StudentSection from '../components/StudentSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <VolunteerSection />
        <StudentSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
