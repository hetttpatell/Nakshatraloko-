import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
      bg: "bg-gradient-to-tr from-[var(--color-productbg)] to-[var(--color-aboutbg)]",
      border: "border border-[var(--color-aboutbg)]",
      text: "text-[var(--color-navy)]",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      progressColor: "bg-[var(--color-navy)]",
      iconBg: "bg-green-100",
    },
    error: {
      bg: "bg-gradient-to-tr from-[var(--color-productbg)] to-[var(--color-aboutbg)]",
      border: "border border-[var(--color-aboutbg)]",
      text: "text-[var(--color-navy)]",
      icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
      progressColor: "bg-red-600",
      iconBg: "bg-red-100",
    },
    info: {
      bg: "bg-gradient-to-tr from-[var(--color-productbg)] to-[var(--color-aboutbg)]",
      border: "border border-[var(--color-aboutbg)]",
      text: "text-[var(--color-navy)]",
      icon: <InformationCircleIcon className="w-5 h-5 text-amber-600" />,
      progressColor: "bg-amber-600",
      iconBg: "bg-amber-100",
    },
  };

  const { bg, text, icon, progressColor, border, iconBg } = types[type] || types.info;

  return (
    <div
      className={`fixed top-25 right-5 z-50 p-4 rounded-xl ${bg} ${text} ${border}
        w-[90%] sm:max-w-sm shadow-[0_8px_30px_rgba(90,77,65,0.35)]
        flex flex-col animate-slideIn transition-all duration-300 ease-out`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${iconBg}`}>
            {icon}
          </div>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-full hover:bg-[var(--color-aboutbg)] transition-all duration-200"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full ${progressColor} rounded-full transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;

// theme 2
// import React, { useEffect, useState } from "react";
// import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

// const Toast = ({ message, type = "success", onClose }) => {
//   const [progress, setProgress] = useState(100);

//   useEffect(() => {
//     const duration = 3000;
//     const intervalTime = 20;
//     const decrement = (intervalTime / duration) * 100;

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev <= 0) {
//           clearInterval(interval);
//           onClose();
//           return 0;
//         }
//         return prev - decrement;
//       });
//     }, intervalTime);

//     return () => clearInterval(interval);
//   }, [onClose]);

//   const types = {
//     success: {
//       bg: "bg-[#f0f8f0]",
//       text: "text-green-800",
//       icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
//       progressColor: "bg-green-600",
//     },
//     error: {
//       bg: "bg-[#fff0f0]",
//       text: "text-red-800",
//       icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
//       progressColor: "bg-red-600",
//     },
//     info: {
//       bg: "bg-[#fffaf0]",
//       text: "text-yellow-800",
//       icon: <InformationCircleIcon className="w-5 h-5 text-yellow-600" />,
//       progressColor: "bg-yellow-600",
//     },
//   };

//   const { bg, text, icon, progressColor } = types[type] || types.info;

//   return (
//     <div
//       className={`fixed top-21 md:top-25 right-5 z-50 p-4 rounded-xl shadow-md ${bg} ${text} 
//         w-[90%] sm:max-w-sm
//         backdrop-blur-sm
//         flex flex-col
//         animate-slideIn transition-transform duration-300 ease-out`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           {icon}
//           <span className="text-sm font-medium">{message}</span>
//         </div>
//         <button
//           onClick={onClose}
//           className="ml-3 text-black/40 hover:text-black transition"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Progress bar */}
//       <div className="h-1 w-full bg-black/10 rounded-full mt-2 overflow-hidden">
//         <div
//           className={`h-full ${progressColor} rounded-full transition-all ease-linear duration-20`}
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default Toast;