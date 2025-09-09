import React from "react";
import { Gem, Shield, Award, Heart } from "lucide-react";

const features = [
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Lab Certified",
    description: "Every piece undergoes rigorous testing in certified laboratories to ensure authenticity and quality."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Premium Materials",
    description: "Crafted with 925 Sterling Silver and genuine gemstones sourced from ethical suppliers worldwide."
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Expert Craftsmanship",
    description: "Each jewelry piece is meticulously handcrafted by our master artisans with decades of experience."
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Ethical Practices",
    description: "Committed to sustainable and ethical practices throughout our supply chain and production process."
  }
];

export default function ValueProposition() {
  return (
    <section className="py-20 bg-[var(--color-background-alt)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            The Nakshatraloko <span className="text-[var(--color-primary)]">Difference</span>
          </h2>
          <p className="text-lg text-[var(--color-text-light)] max-w-2xl mx-auto">
            Excellence is in the details. Discover what sets our jewelry apart in quality, craftsmanship, and customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] transition-all duration-500 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-[var(--color-primary)]/10 rounded-2xl mb-6 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                  <div className="text-[var(--color-primary)]">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-[var(--color-text-light)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}