import React from "react";
import { Gem, Shield, Award, Heart } from "lucide-react";

const features = [
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Authentic Zodiac Stones",
    description: "Every gemstone is carefully selected and aligned with your zodiac sign to enhance spiritual balance and positive energy."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Astrological Benefits",
    description: "Each stone is chosen for its unique planetary influence, helping attract success, love, health, and prosperity into your life."
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Energized & Blessed",
    description: "Our gemstones are spiritually cleansed and energized with Vedic rituals to maximize their astrological power."
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Personalized Guidance",
    description: "We provide expert recommendations to ensure you wear the right stone based on your zodiac sign and birth chart."
  }
];

export default function ValueProposition() {
  return (
    <section className="py-12 md:py-20 bg-[var(--color-background-alt)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            The Nakshatraloka <span className="text-[var(--color-primary)]">Difference</span>
          </h2>
          <p className="text-lg text-[var(--color-text-light)] max-w-2xl mx-auto">
            The power lies in the stars. Discover how our authentic zodiac stones bring harmony, positivity, and spiritual guidance into your life.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 sm:p-6 md:p-8 bg-white rounded-xl md:rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] transition-all duration-500 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-2 sm:p-3 md:p-4 bg-[var(--color-primary)]/10 rounded-xl md:rounded-2xl mb-4 md:mb-6 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                  <div className="text-[var(--color-primary)]">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base md:text-xl font-semibold text-[var(--color-text)] mb-2 md:mb-3">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-light)] leading-relaxed">
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