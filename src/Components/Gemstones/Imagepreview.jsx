import React, { useState } from "react";

export default function ImagePreview() {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full overflow-hidden relative">
            <img
                src="/horizontal.jpeg"
                alt="Luxury Gemstone Collection"
                onLoad={() => setLoaded(true)}
                className={`w-full h-48 lg:h-[500px] object-cover transition-all duration-1300 ease-in-out transform 
                            ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            />
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/30 to-transparent"></div>
            
            {/* Text overlay */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
                <h1 className="text-3xl lg:text-5xl font-playfair font-bold mb-2 drop-shadow-lg">
                    Discover Timeless Elegance
                </h1>
                <p className="text-lg lg:text-xl opacity-90 drop-shadow-md max-w-2xl">
                    Handcrafted gemstone jewelry designed for the discerning individual
                </p>
            </div>
        </div>
    );
}