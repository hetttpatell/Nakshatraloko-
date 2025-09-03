import React from "react";  
import Slideshow from "./Slideshow";
import Featured from "./Featured";
import Information from "./Information";
import AboutSection from "./AboutSection";
import HelpingForm from "./HelpingForm";
import Collection from "./Collections";
import ExpertCall from "./ExpertCall";


export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Slideshow autoPlay={true} autoPlayInterval={4000} />
      <ExpertCall/>
      <Featured />
      <Information />
      <AboutSection />
      <Collection />
      <HelpingForm />
    </div>
  );
}
