import React from "react";
import { motion } from "framer-motion";

export default function AboutSection() {
  const aboutpara = {
    first: "About",
    second: "Nakshatraloka",
    para: `We are not just readers of charts.
We are listeners of silence, interpreters of stars, and guides for the soul.

We believe:

That love deserves direction.

That career needs clarity.

And that healing begins with understanding.


Our tools are ancient.
Our purpose is timeless.
Our mission is modern:
To empower today's seekers with astrological wisdom crafted for real life.

We're here to remove confusion, fear, and uncertainty.
And replace them with hope, harmony, and most of all—smiles.

Because when the stars align, so does life.
And when life aligns, there are happy faces at all places.

This is Nakshatraloka.
This is your cosmic home.`,
    img: "/abot.jpg",
  };

  // Function to format paragraphs with special handling for the "We believe" section
  const formatParagraphs = (text) => {
    const paragraphs = text.split("\n\n");
    const formattedParagraphs = [];

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i].trim();

      if (para === "We believe:") {
        // Handle the "We believe" section as a special block
        formattedParagraphs.push(
          <motion.div
            key={i}
            className="mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-lg md:text-xl font-semibold text-[var(--color-text)] mb-4 font-playfair">
              {para}
            </p>
            <div className="space-y-3 pl-4 md:pl-6 border-l-2 border-[var(--color-primary)]/40">
              {paragraphs[i + 1] && (
                <p className="text-[var(--color-text-light)] text-base md:text-lg">
                  • {paragraphs[i + 1].replace('That ', '').replace('And that ', '')}
                </p>
              )}
              {paragraphs[i + 2] && (
                <p className="text-[var(--color-text-light)] text-base md:text-lg">
                  • {paragraphs[i + 2].replace('That ', '').replace('And that ', '')}
                </p>
              )}
              {paragraphs[i + 3] && (
                <p className="text-[var(--color-text-light)] text-base md:text-lg">
                  • {paragraphs[i + 3].replace('That ', '').replace('And that ', '')}
                </p>
              )}
            </div>
          </motion.div>
        );
        i += 3;
      } else if (para && !para.startsWith("That ") && !para.startsWith("And that ")) {
        // Regular paragraphs with staggered animation
        formattedParagraphs.push(
          <motion.p
            key={i}
            className="text-base md:text-lg leading-7 md:leading-8 text-justify text-[var(--color-text-light)] mb-4 md:mb-6 font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            {para.split("\n").map((line, lineIndex, array) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < array.length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.p>
        );
      }
    }

    return formattedParagraphs;
  };

  return (
    <section className="py-16 md:py-24 bg-[var(--color-aboutbg)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16 xl:gap-20">
          {/* Text Content */}
          <motion.div
            id="about"
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium tracking-wide">OUR STORY</span>
            </div>

            <div className="mb-8 md:mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-[var(--color-text)] tracking-tight">
                {aboutpara.first}
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-[var(--color-text)] mt-2">
                {aboutpara.second}
              </h2>
            </div>

            <div className="space-y-6 md:space-y-8">
              {formatParagraphs(aboutpara.para)}
            </div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10 md:my-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl font-bold text-[var(--color-primary)]">10+</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-base">Years Experience</p>
                  <p className="text-sm text-[var(--color-text-light)]">In astrological guidance</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl font-bold text-[var(--color-primary)]">5K+</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-base">Happy Clients</p>
                  <p className="text-sm text-[var(--color-text-light)]">Worldwide</p>
                </div>
              </div>
            </motion.div>

            <motion.button
              className="px-8 py-3.5 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Discover Our Wisdom
            </motion.button>
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="lg:w-1/2 w-full mt-10 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative max-w-md mx-auto lg:max-w-none lg:ml-auto lg:mr-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-2xl transform rotate-3"></div>
                <motion.img
                  src={aboutpara.img}
                  alt="Nakshatraloka astrological guidance"
                  className="relative w-full h-80 md:h-[28rem] lg:h-[600px] xl:h-[700px] object-cover rounded-xl shadow-2xl"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-base">Cosmic Wisdom</p>
                    <p className="text-sm text-[var(--color-text-light)]">Authentic Guidance</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}