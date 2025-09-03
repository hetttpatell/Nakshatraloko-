import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

const Toast = ({ message, type = "success", onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 3000;
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
      bg: "bg-[#f0f8f0]",
      text: "text-green-800",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      progressColor: "bg-green-600",
    },
    error: {
      bg: "bg-[#fff0f0]",
      text: "text-red-800",
      icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
      progressColor: "bg-red-600",
    },
    info: {
      bg: "bg-[#fffaf0]",
      text: "text-yellow-800",
      icon: <InformationCircleIcon className="w-5 h-5 text-yellow-600" />,
      progressColor: "bg-yellow-600",
    },
  };

  const { bg, text, icon, progressColor } = types[type] || types.info;

  return (
    <div
      className={`fixed top-21 md:top-25 right-5 z-50 p-4 rounded-xl shadow-md ${bg} ${text} 
        w-[90%] sm:max-w-sm
        backdrop-blur-sm
        flex flex-col
        animate-slideIn transition-transform duration-300 ease-out`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-black/40 hover:text-black transition"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-black/10 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full ${progressColor} rounded-full transition-all ease-linear duration-20`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;
