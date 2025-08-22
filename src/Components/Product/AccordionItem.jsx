import React, { useState } from "react";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-800 focus:outline-none"
      >
        {title}
        <span className="text-xl">{isOpen ? "−" : "+"}</span>
      </button>

      {/* Content with smooth transition */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: isOpen ? "500px" : "0px", // big enough to fit content
        }}
      >
        <div className="pb-4 text-gray-600">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;