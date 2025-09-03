import React from "react";

export default function Information() {
  const FeaturedInfo = [
    { id: 1, name: "Lab Certified", image: "/lab.png" },
    { id: 2, name: "Affordable Price", image: "/price-tag-svgrepo-com.png" },
    { id: 3, name: "100% Pure Product", image: "/100-percent.png" },
    { id: 4, name: "Natural Stones", image: "/leaves.png" },
  ];

  return (
    <div className="w-full mt-4 bg-[var(--color-navy)] py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center px-4 sm:px-6 gap-6 sm:gap-0">
        {FeaturedInfo.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center text-center gap-2 sm:gap-2 w-full sm:w-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 sm:w-10 sm:h-10 mb-1 object-contain invert"
              />
              <p className="text-white text-base sm:text-sm font-sans">
                {item.name}
              </p>
            </div>

            {/* Divider (show only on desktop) */}
            {index < FeaturedInfo.length - 1 && (
              <div className="hidden sm:block w-px h-16 bg-white/30"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
