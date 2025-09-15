import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 4000;
    const intervalTime = 20;
    const decrement = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        } 
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onClose]);

  const types = {
    success: {
      icon: <CheckCircle size={20} className="text-green-500" />,
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      progress: "bg-green-500"
    },
    error: {
      icon: <XCircle size={20} className="text-red-500" />,
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      progress: "bg-red-500"
    },
    info: {
      icon: <Info size={20} className="text-blue-500" />,
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      progress: "bg-blue-500"
    }
  };

  const { icon, bg, text, progress: progressColor } = types[type] || types.success;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-26 right-6 z-50 w-100 max-w-full"
      >
        <div className={`rounded-xl border p-4 shadow-lg ${bg}`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${text}`}>{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition"
            >
              <X size={16} className={text} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${progressColor} rounded-full`}
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;