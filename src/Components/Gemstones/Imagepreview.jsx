import React, { useState } from "react";

export default function ImagePreview() {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full overflow-hidden">
            <img
                src="/horizontal.jpeg"
                alt="Testing Image"
                onLoad={() => setLoaded(true)}
                className={`w-full h-40 lg:h-[400px] object-cover transition-all duration-1300 ease-in-out transform 
                            ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            />
        </div>
    );
}
