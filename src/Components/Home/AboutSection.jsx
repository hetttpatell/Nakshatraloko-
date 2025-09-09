import React from "react";
import { motion } from "framer-motion";

export default function AboutSection() {
  const aboutpara = {
    first: "About",
    second: "Nakshatraloka",
    para: "Nakshatraloko brings you exquisite gemstones and jewelry crafted with precision and care. Each piece is thoughtfully designed to complement your unique style and energy, creating timeless elegance that lasts forever.",
    img: "/abot.jpg",
  };

  return (
    <section className="py-12 md:py-20 bg-[var(--color-aboutbg)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 xl:gap-20">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-4 md:mb-6">
              <span className="text-sm font-medium">Our Story</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair text-[var(--color-text)]">
              {aboutpara.first}
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-[var(--color-text)] mt-4">
              {aboutpara.second}
            </h2>
            
            <p className="mt-6 w-full md:w-5/6 text-lg md:text-xl leading-7 md:leading-9 tracking-wide text-justify font-playfair text-[var(--color-text-light)]">
              {aboutpara.para}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 my-6 md:my-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--color-primary)]/10 rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-[var(--color-primary)]">10+</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm md:text-base">Years Experience</p>
                  <p className="text-xs md:text-sm text-[var(--color-text-light)]">In jewelry crafting</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--color-primary)]/10 rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-[var(--color-primary)]">5K+</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm md:text-base">Happy Clients</p>
                  <p className="text-xs md:text-sm text-[var(--color-text-light)]">Worldwide</p>
                </div>
              </div>
            </div>
            
            <button className="px-5 py-2.5 md:px-6 md:py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] text-sm md:text-base">
              Discover Our Story
            </button>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative mt-6 md:mt-0 flex justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-2/3 md:w-2/3">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-xl md:rounded-2xl transform rotate-3"></div>
              <img
                src={aboutpara.img}
                alt="Nakshatraloko craftsmanship"
                className="relative w-full h-100 md:h-180 object-cover rounded-4xl shadow-xl"
              />
              
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-[var(--color-primary)]/10 rounded-md md:rounded-lg flex items-center justify-center">
                    <span className="text-lg md:text-xl">✨</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-sm md:text-base">Premium Quality</p>
                    <p className="text-xs text-[var(--color-text-light)]">Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}