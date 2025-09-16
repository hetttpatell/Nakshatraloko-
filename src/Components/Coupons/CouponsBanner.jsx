import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CouponBanner = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentZodiac, setCurrentZodiac] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Zodiac signs with their symbols, stones, and colors
  const zodiacSigns = [
    { name: "Aries", symbol: "♈", stone: "Bloodstone", color: "#FF6B6B" },
    { name: "Taurus", symbol: "♉", stone: "Emerald", color: "#51CF66" },
    { name: "Gemini", symbol: "♊", stone: "Agate", color: "#FCC419" },
    { name: "Cancer", symbol: "♋", stone: "Pearl", color: "#E9ECEF" },
    { name: "Leo", symbol: "♌", stone: "Ruby", color: "#FF8787" },
    { name: "Virgo", symbol: "♍", stone: "Sapphire", color: "#339AF0" },
    { name: "Libra", symbol: "♎", stone: "Lapis Lazuli", color: "#228BE6" },
    { name: "Scorpio", symbol: "♏", stone: "Topaz", color: "#CC5DE8" },
    { name: "Sagittarius", symbol: "♐", stone: "Turquoise", color: "#20C997" },
    { name: "Capricorn", symbol: "♑", stone: "Garnet", color: "#FA5252" },
    { name: "Aquarius", symbol: "♒", stone: "Amethyst", color: "#BE4BDB" },
    { name: "Pisces", symbol: "♓", stone: "Aquamarine", color: "#15AABF" }
  ];

  // Mystical quotes
  const quotes = [
    "As the stars align, so shall your savings 🌌",
    "The cosmos has gifts in store for your journey ✨",
    "Your celestial energy attracts abundance 💫",
    "The planets favor your intentions today 🔭",
    "Ancient wisdom flows through these sacred stones 📿"
  ];

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.post("http://localhost:8001/api/getAllCouponsForDisplay");
        if (response.data.success && Array.isArray(response.data.data)) {
          // Filter active coupons only
          const now = new Date();
          const activeCoupons = response.data.data.filter(coupon => 
            coupon.IsActive && 
            new Date(coupon.StartDate) <= now && 
            new Date(coupon.EndDate) >= now
          );
          setCoupons(activeCoupons);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Rotate zodiac signs
  useEffect(() => {
    const zodiacInterval = setInterval(() => {
      setCurrentZodiac((prev) => (prev + 1) % zodiacSigns.length);
    }, 5000);
    
    return () => clearInterval(zodiacInterval);
  }, []);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 7000);
    
    return () => clearInterval(quoteInterval);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gradient-to-br from-[#1a103d] via-[#2d1b69] to-[#3a2282]">
        <div className="animate-pulse text-[#b89f7a] text-lg font-serif">Consulting the celestial charts...</div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return null; // Don't show banner if no active coupons
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1a103d] via-[#2d1b69] to-[#3a2282] text-[#f5f2eb] p-8 rounded-xl shadow-2xl border border-[#b89f7a] border-opacity-30">
      {/* Constellation background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
        {/* Constellation lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-0.5 bg-white rounded-full"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 180}deg)`,
              opacity: Math.random() * 0.2 + 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Animated stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#b89f7a] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      {/* Rotating zodiac symbols in background */}
      <motion.div 
        className="absolute -right-12 -bottom-12 text-9xl opacity-5"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ color: zodiacSigns[currentZodiac].color }}
      >
        {zodiacSigns[currentZodiac].symbol}
      </motion.div>
      
      <motion.div 
        className="absolute -left-12 -top-12 text-9xl opacity-5"
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        style={{ color: zodiacSigns[(currentZodiac + 6) % 12].color }}
      >
        {zodiacSigns[(currentZodiac + 6) % 12].symbol}
      </motion.div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0 md:pr-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-serif font-bold mb-3 text-[#f5f2eb]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Unlock Cosmic Energy ✨<br />
            Get {coupons[0]?.DiscountPercentage || 20}% OFF Your First Zodiac Stone Order!
          </motion.h2>
          
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentQuote}
              className="text-[#b89f7a] italic font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {quotes[currentQuote]}
            </motion.p>
          </AnimatePresence>

          {/* Current zodiac sign display */}
          <motion.div 
            className="mt-4 flex items-center justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-2xl mr-2" style={{ color: zodiacSigns[currentZodiac].color }}>
              {zodiacSigns[currentZodiac].symbol}
            </span>
            <span className="text-sm text-[#b89f7a]">
              {zodiacSigns[currentZodiac].name}'s Stone: {zodiacSigns[currentZodiac].stone}
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col items-center">
          <motion.button
            className="bg-gradient-to-r from-[#b89f7a] to-[#a58a65] hover:from-[#a58a65] hover:to-[#b89f7a] text-[#1a103d] font-serif font-semibold py-3 px-8 rounded-full shadow-lg mb-4 relative overflow-hidden transform transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(184, 159, 122, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(184, 159, 122, 0.4)",
                "0 0 0 12px rgba(184, 159, 122, 0.1)",
                "0 0 0 24px rgba(184, 159, 122, 0)",
                "0 0 0 0 rgba(184, 159, 122, 0)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                repeatType: "loop"
              }
            }}
          >
            Claim Your Cosmic Coupon
            {/* Subtle gem-like facets */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute w-4 h-4 border-t-2 border-l-2 border-white border-opacity-50 top-3 left-4"></div>
              <div className="absolute w-4 h-4 border-t-2 border-r-2 border-white border-opacity-50 top-3 right-4"></div>
              <div className="absolute w-4 h-4 border-b-2 border-l-2 border-white border-opacity-50 bottom-3 left-4"></div>
              <div className="absolute w-4 h-4 border-b-2 border-r-2 border-white border-opacity-50 bottom-3 right-4"></div>
            </div>
          </motion.button>

          {coupons[0]?.CouponCode && (
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm text-[#b89f7a] mb-2 font-serif">Use this celestial code at checkout:</div>
              <motion.div 
                className="bg-[#1a103d] bg-opacity-70 backdrop-blur-md border border-[#b89f7a] border-opacity-50 rounded-lg py-3 px-6 font-mono cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-opacity-90 hover:border-opacity-80"
                onClick={() => copyToClipboard(coupons[0].CouponCode)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-[#f5f2eb] tracking-widest">{coupons[0].CouponCode}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 text-[#b89f7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </motion.div>
              
              <AnimatePresence>
                {copied && (
                  <motion.div 
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-white text-xs py-2 px-3 rounded-md shadow-lg"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    Code copied to clipboard!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative celestial elements */}
      <div className="absolute top-2 right-2 w-16 h-16 opacity-10">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#b89f7a" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="35" stroke="#b89f7a" strokeWidth="1" fill="none" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="#b89f7a" strokeWidth="1" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#b89f7a" strokeWidth="1" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#b89f7a" strokeWidth="1" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="#b89f7a" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default CouponBanner;