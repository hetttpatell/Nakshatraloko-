import React, { useEffect } from "react";  
import HeroSection from "./Slideshow";
import FeaturedProducts from "./Featured";
import ValueProposition from "./Information";
import BrandStory from "./AboutSection";
import Collections from "./Collections";
import Testimonials from "./Testimonals";
import ConsultationForm from "./HelpingForm";
import ExpertCall from "./ExpertCall";
import axios from "axios";

export default function Home() {

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <HeroSection />
      <ValueProposition />
      <FeaturedProducts />
      <BrandStory />
      <Collections />
      <Testimonials />
      <ConsultationForm />
      <ExpertCall />
    </div>
  );
}