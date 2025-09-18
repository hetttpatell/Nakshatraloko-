import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CouponBanner = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(0);
  const [direction, setDirection] = useState(0); // 0: right, 1: left

  // Mystical quotes
  const quotes = [
    "As the stars align, so shall your savings 🌌",
    "The cosmos has gifts in store for your journey ✨",
    "Your celestial energy attracts abundance 💫"
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

  // Automatic rotation with smooth transitions
  useEffect(() => {
    if (coupons.length > 1) {
      const couponInterval = setInterval(() => {
        setDirection(0); // Always move right for auto-rotation
        setCurrentCoupon((prev) => (prev + 1) % coupons.length);
      }, 5000); // Rotate every 5 seconds
      
      return () => clearInterval(couponInterval);
    }
  }, [coupons.length]);

  const navigateCoupon = (index) => {
    if (index > currentCoupon) setDirection(0); // Moving right
    if (index < currentCoupon) setDirection(1); // Moving left
    setCurrentCoupon(index);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 bg-gradient-to-br from-[#1a103d] via-[#2d1b69] to-[#3a2282]">
        <div className="animate-pulse text-[#b89f7a] text-sm font-serif">Consulting the celestial charts...</div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return null; // Don't show banner if no active coupons
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1a103d] via-[#2d1b69] to-[#3a2282] text-[#f5f2eb] p-4 md:p-5 rounded-xl shadow-xl border border-[#b89f7a] border-opacity-30">
      {/* Animated stars */}
      {[...Array(8)].map((_, i) => (
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

      <div className="relative z-10">
        {/* Navigation arrows for multiple coupons */}
        {coupons.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between z-20">
            {/* <button
              onClick={() => navigateCoupon((currentCoupon - 1 + coupons.length) % coupons.length)}
              className="p-1 rounded-full bg-[#1a103d] bg-opacity-70 backdrop-blur-sm text-[#b89f7a] hover:text-[#f5f2eb] transition-colors"
              aria-label="Previous coupon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigateCoupon((currentCoupon + 1) % coupons.length)}
              className="p-1 rounded-full bg-[#1a103d] bg-opacity-70 backdrop-blur-sm text-[#b89f7a] hover:text-[#f5f2eb] transition-colors"
              aria-label="Next coupon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button> */}
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCoupon}
            custom={direction}
            initial={{ 
              opacity: 0,
              x: direction === 0 ? 100 : -100
            }}
            animate={{ 
              opacity: 1,
              x: 0,
              transition: { duration: 0.5 }
            }}
            exit={{ 
              opacity: 0,
              x: direction === 0 ? -100 : 100,
              transition: { duration: 0.3 }
            }}
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <CouponContent 
              coupon={coupons[currentCoupon]} 
              quotes={quotes} 
              currentCoupon={currentCoupon} 
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
            
            <div className="flex flex-col items-center">
              {coupons[currentCoupon]?.Code && (
                <div className="relative">
                  <div className="text-xs text-[#b89f7a] mb-1 font-serif">Use code:</div>
                  <motion.div 
                    className="bg-[#1a103d] bg-opacity-70 backdrop-blur-md border border-[#b89f7a] border-opacity-50 rounded-lg py-2 px-4 font-mono cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-opacity-90 hover:border-opacity-80"
                    onClick={() => copyToClipboard(coupons[currentCoupon].Code)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-[#f5f2eb] tracking-widest text-sm">{coupons[currentCoupon].Code}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-[#b89f7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  
                  <AnimatePresence>
                    {copied && (
                      <motion.div 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-white text-xs py-1 px-2 rounded shadow-lg"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Multiple coupons indicator */}
              {coupons.length > 1 && (
                <div className="mt-3 flex justify-center space-x-2">
                  {coupons.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateCoupon(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentCoupon 
                          ? 'bg-[#b89f7a] scale-125' 
                          : 'bg-[#b89f7a] bg-opacity-40 hover:bg-opacity-70'
                      }`}
                      aria-label={`View coupon ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Separate component for coupon content to improve readability
const CouponContent = ({ coupon, quotes, currentCoupon, formatCurrency, formatDate }) => {
  const discountValue = coupon.DiscountType === 'PERCENTAGE' 
    ? `${coupon.DiscountValue}% OFF` 
    : `${formatCurrency(coupon.DiscountValue)} OFF`;

  return (
    <div className="text-center md:text-left mb-4 md:mb-0 md:pr-6">
      <h2 className="text-xl md:text-2xl font-serif font-bold mb-2 text-[#f5f2eb]">
        Cosmic Savings ✨ {discountValue}
      </h2>
      
      <div className="text-xs text-[#d6c9af] mb-2">
        <p>Min. order: {formatCurrency(coupon.Min_Order_Amount)}</p>
        {coupon.Max_Discount_Amount && (
          <p>Max. discount: {formatCurrency(coupon.Max_Discount_Amount)}</p>
        )}
        <p>Valid until: {formatDate(coupon.EndDate)}</p>
      </div>

      <p className="text-xs text-[#b89f7a] italic font-light">
        {quotes[currentCoupon % quotes.length]}
      </p>
    </div>
  );
};

export default CouponBanner;