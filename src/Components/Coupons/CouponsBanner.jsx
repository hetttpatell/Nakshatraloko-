  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { motion, AnimatePresence } from 'framer-motion';

  const CouponBanner = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentZodiac, setCurrentZodiac] = useState(0);
    const [copied, setCopied] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(0);

    // Zodiac signs with their symbols and dates
    const zodiacSigns = [
      { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19" },
      { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20" },
      { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20" },
      { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22" },
      { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22" },
      { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22" },
      { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22" },
      { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21" },
      { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21" },
      { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19" },
      { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18" },
      { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20" }
    ];

    // Mystical quotes
    const quotes = [
      "Stars align for your savings today 🌌",
      "The universe has gifts in store for you ✨",
      "Your cosmic energy attracts abundance 💫",
      "Celestial forces guide your journey 🌠",
      "The planets favor your intentions today 🔭"
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
        <div className="flex justify-center items-center h-48 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
          <div className="animate-pulse text-white text-lg">Consulting the stars...</div>
        </div>
      );
    }

    if (coupons.length === 0) {
      return null; // Don't show banner if no active coupons
    }

    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-6 rounded-lg shadow-xl border border-[#b89f7a] border-opacity-30">
        {/* Animated stars */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Rotating zodiac symbols in background */}
        <motion.div 
          className="absolute -right-8 -bottom-8 text-8xl opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          {zodiacSigns[currentZodiac].symbol}
        </motion.div>
        
        <motion.div 
          className="absolute -left-8 -top-8 text-8xl opacity-10"
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          {zodiacSigns[(currentZodiac + 6) % 12].symbol}
        </motion.div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <motion.h2 
              className="text-2xl font-serif font-bold mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Unlock Cosmic Energy ✨ Get {coupons[0]?.DiscountPercentage || 20}% OFF Your First Zodiac Stone Order!
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentQuote}
                className="text-[#b89f7a] italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {quotes[currentQuote]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center">
            <motion.button
              className="bg-[#b89f7a] hover:bg-[#a58a65] text-white font-semibold py-3 px-6 rounded-full shadow-lg mb-3 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(184, 159, 122, 0.7)",
                  "0 0 0 10px rgba(184, 159, 122, 0)",
                  "0 0 0 0 rgba(184, 159, 122, 0)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }}
            >
              Claim Your Cosmic Coupon
            </motion.button>

            {coupons[0]?.CouponCode && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-sm text-[#b89f7a] mb-1">Use code at checkout:</div>
                <div 
                  className="bg-white bg-opacity-10 backdrop-blur-sm border border-[#b89f7a] border-opacity-50 rounded-md py-2 px-4 font-mono cursor-pointer flex items-center"
                  onClick={() => copyToClipboard(coupons[0].CouponCode)}
                >
                  {coupons[0].CouponCode}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <AnimatePresence>
                  {copied && (
                    <motion.div 
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      Copied to clipboard!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default CouponBanner;