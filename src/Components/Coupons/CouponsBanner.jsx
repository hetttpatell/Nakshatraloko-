// CouponsBanner.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Tag } from "lucide-react";
import axios from "axios";

export default function CouponsBanner() {
  const [coupons, setCoupons] = useState([]);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.post("http://localhost:8001/api/getAllCouponsForDisplay");
        if (response.data.success && Array.isArray(response.data.data)) {
          setCoupons(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (coupons.length > 1) {
      const interval = setInterval(() => {
        setCurrentCouponIndex((prevIndex) => (prevIndex + 1) % coupons.length);
      }, 8000); // Rotate every 8s
      return () => clearInterval(interval);
    }
  }, [coupons.length]);

  const handleClose = () => setIsVisible(false);

  if (!isVisible || loading || coupons.length === 0) return null;

  const currentCoupon = coupons[currentCouponIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative w-full bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white font-inter"
        >
          <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4 gap-4">
            {/* Scrolling Coupon */}
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <Tag size={22} className="text-[var(--color-accent-amber)] flex-shrink-0" />

              <motion.div
                key={currentCouponIndex}
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                className="whitespace-nowrap flex items-center gap-3 text-sm md:text-base font-medium"
              >
                <span className="bg-white text-[var(--color-text)] px-2 py-1 rounded font-bold tracking-wide">
                  {currentCoupon.Code || "SPECIALOFFER"}
                </span>
                <span className="opacity-90">
                  {currentCoupon.Description || "Special discount just for you!"}
                </span>
                {currentCoupon.DiscountValue && (
                  <span className="bg-[var(--color-accent-amber)] px-2 py-1 rounded text-xs md:text-sm font-bold">
                    {currentCoupon.DiscountType === "percentage"
                      ? `${currentCoupon.DiscountValue}% OFF`
                      : `₹${currentCoupon.DiscountValue} OFF`}
                  </span>
                )}
              </motion.div>
            </div>

            {/* CTA + Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="flex items-center text-xs md:text-sm font-semibold bg-white text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] transition-colors px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm">
                Claim Offer <ChevronRight size={14} className="ml-1" />
              </button>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {coupons.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                key={currentCouponIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
