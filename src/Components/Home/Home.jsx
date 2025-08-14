import React from "react";  
import Slideshow from "./Slideshow";
import Featured from "./Featured";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Slideshow />
      <Featured />
    </div>
  );
}
