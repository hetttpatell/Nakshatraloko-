import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond } from "lucide-react";

const faqs = [
  {
    question: "What are zodiac stones?",
    answer:
      "Zodiac stones are gemstones aligned with astrological signs. Each stone resonates with the unique energy and personality traits of its zodiac sign, believed to bring balance and positivity."
  },
  {
    question: "Are your gemstones authentic?",
    answer:
      "Yes. Every gemstone is hand-selected, authenticated, and ethically sourced from trusted suppliers. We prioritize both quality and responsible practices."
  },
  {
    question: "Can I wear multiple zodiac stones?",
    answer:
      "Absolutely. Many individuals combine stones for their Sun, Moon, or Rising signs. Others simply follow their intuition and wear the gems that resonate most with them."
  },
  {
    question: "How do I care for my gemstone jewelry?",
    answer:
      "To maintain the natural brilliance of your gemstones, gently clean them with a soft cloth and avoid harsh chemicals, extreme heat, or prolonged exposure to water."
  }
];

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="min-h-screen bg-[var(--color-bg)] py-24 px-6 flex justify-center items-center font-montserrat">
      <motion.div
        className="max-w-6xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#5a4d41] via-[#8b7d6b] to-[#c5b89f] bg-clip-text text-transparent drop-shadow-xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about our gemstones, zodiac connections, and jewelry care.
          </p>
        </div>

        {/* FAQ Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
        >
          {/* Questions */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.button
                key={index}
                layout
                onClick={() => setActiveIndex(index)}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 20px rgba(133, 111, 75, 0.20)"
                }}
                whileTap={{ scale: 0.98 }}
                className={`relative block w-full text-left py-5 px-7 rounded-xl border transition duration-300 font-playfair tracking-tight
                ${
                  activeIndex === index
                    ? "bg-gradient-to-r from-[#e6d9c3] to-[#f5f5dc] text-[#5a4d41] border-[#d4c6a8] shadow-xl ring-2 ring-[#bfa983]/30"
                    : "text-gray-700 border border-gray-200 hover:border-[#d4c6a8] hover:bg-[#faf9f4]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{
                      scale: activeIndex === index ? 1.2 : 1,
                      rotate: activeIndex === index ? 15 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    <Diamond className={`w-6 h-6 transition-colors ${activeIndex === index ? "text-[#bfa983]" : "text-gray-400"}`} />
                  </motion.span>
                  <span className="font-playfair text-xl">{faq.question}</span>
                </div>
                {/* Plus/minus icon with diamond style */}
                <span className="absolute right-8 top-7">
                  <motion.svg
                    width="26"
                    height="26"
                    fill="none"
                    viewBox="0 0 26 26"
                    animate={{
                      rotate: activeIndex === index ? 45 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <rect
                      x="4"
                      y="12"
                      width="18"
                      height="2"
                      rx="1"
                      fill={activeIndex === index ? "#bfa983" : "#bfa983"}
                    />
                    <rect
                      x="12"
                      y="4"
                      width="2"
                      height="18"
                      rx="1"
                      fill={activeIndex === index ? "#bfa983" : "#bfa983"}
                      style={{
                        opacity: activeIndex === index ? 1 : 0.7
                      }}
                    />
                  </motion.svg>
                </span>
              </motion.button>
            ))}
          </div>

          {/* Answers */}
          <motion.div
            className="bg-gradient-to-tr from-[#f5f5dc] to-[#e6d9c3] rounded-2xl shadow-[0_8px_30px_rgba(90,77,65,0.18)] border border-[#e5e5c0] p-10 flex items-center"
            layout
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <p className="text-gray-700 text-lg leading-relaxed font-montserrat">
                  {faqs[activeIndex].answer}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
