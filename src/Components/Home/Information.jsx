import React from "react";

export default function Information() {
  const FeaturedInfo = [
    {
      id: 1,
      name: "Lab Certified",
      image: "/lab.png",
    },
    {
      id: 2,
      name: "Affordable Price",
      image: "/price-tag-svgrepo-com.png",
    },
    {
      id: 3,
      name: "100% Pure Product",
      image: "/100-percent.png",
    },
    {
      id: 4,
      name: "Natural Stones",
      image: "/leaves.png",
    },
  ];

  return (
    <div className="w-full mt-4 bg-[var(--color-navy)] py-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {FeaturedInfo.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center text-center gap-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 mb-2 object-contain invert"
              />
              <p className="text-white text-sm font[var(font-familfont-family)]">{item.name}</p>
            </div>

            {/* Divider (skip after last item) */}
            {index < FeaturedInfo.length - 1 && (
              <div className="w-px h-19 bg-white/40"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
