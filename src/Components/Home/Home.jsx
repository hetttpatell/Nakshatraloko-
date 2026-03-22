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
import CouponsBanner from "../Coupons/CouponsBanner";
import SEO from "../SEO/SEO";

export default function Home() {

  return (
    <>
      <SEO 
        title="Naksatraloka - Authentic Rudraksha & Spiritual Products | Best Online Store"
        description="Naksatraloka offers authentic Rudraksha, spiritual products, and astrology solutions. Explore our divine collection of rudraksha beads, mala, and spiritual jewelry with free shipping across India."
        keywords="Rudraksha, spiritual products, astrology, rudraksha mala, healing beads, spiritual jewelry, gemstone jewelry, rudraksha beads, online spiritual store India"
        url="/"
      />
      <div className="min-h-screen bg-[var(--color-background)]">
        <CouponsBanner />
        <HeroSection />
        <ValueProposition />
        <FeaturedProducts />
        <BrandStory />
        <Collections />
        <Testimonials />
        <ConsultationForm />
        <ExpertCall />
      </div>
    </>
  );
}
