import React from "react";  
import Slideshow from "./Slideshow";
import Featured from "./Featured";
import Information from "./Information";
import AboutSection from "./AboutSection";
import HelpingForm from "./HelpingForm";
import Collection from "./Collections";


export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Slideshow />
      <Featured />
      <Information />
      <AboutSection />
      <Collection />
      <HelpingForm />
    </div>
  );
}
