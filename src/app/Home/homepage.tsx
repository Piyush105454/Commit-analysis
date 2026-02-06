"use client";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";          
import FeaturesSection from "./FeaturesSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";

import React, { useState } from "react";

export default function Homepage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <HeroSection />
       <FeaturesSection />
      {/* <AboutSection /> */}
      <ContactSection />
      <Footer />
    </>
  );
}