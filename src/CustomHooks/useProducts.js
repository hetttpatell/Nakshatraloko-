// hooks/useProducts.js
import { useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to create slug/ID
const slugify = (str) =>
  str?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
  Math.random().toString(36).substr(2, 9);

export default function useProducts(apiUrl) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.post(`${BACKEND_URL}getAllProducts`);

        if (!isMounted) return;

        let apiProducts = [];

        // Handle multiple response structures
        if (Array.isArray(res.data)) {
          apiProducts = res.data;
        } else if (Array.isArray(res.data?.data)) {
          apiProducts = res.data.data;
        } else if (Array.isArray(res.data?.products)) {
          apiProducts = res.data.products;
        } else {
          const possibleArrays = Object.values(res.data).filter(
            (item) => Array.isArray(item) && item.length > 0
          );
          if (possibleArrays.length > 0) {
            apiProducts = possibleArrays[0];
          }
        }

        const uniqueProducts = new Map();
        //  {
        //     "ID": 7,
        //     "CatogaryID": 3,
        //     "Name": " Classic Running Shoes",
        //     "Description": "Lightweight and comfortable running shoes.",
        //     "Price": "1200.00",
        //     "DummyPrice": null,
        //     "DiscountPercentage": 0,
        //     "Stock": 40,
        //     "Advantages": " Breathable, Durable, Stylish",
        //     "HowToWear": " Wear with sports socks for best comfort",
        //     "IsActive": true
        // },
        apiProducts.forEach((p, index) => {
          const productId =
            p.ID || p.id || slugify(p.Name || p.name) || `product-${index}`;

          if (uniqueProducts.has(productId)) return;

          let imgUrl = p.Image || p.image || p.img || "/s1.jpeg";

          if (imgUrl && !imgUrl.startsWith("http") && !imgUrl.startsWith("/")) {
            imgUrl = `/${imgUrl}`;
          }

          uniqueProducts.set(productId, {
            id: productId,
            category: p.Category || p.category || "Uncategorized",
            name: p.Name || p.name || "Gemstone Product",
            description:
              p.Description || p.description || "Beautiful gemstone jewelry",
            price: `₹ ${parseFloat(p.Price || p.price || 0).toLocaleString(
              "en-IN"
            )}`,
            dummyPrice: p.DummyPrice || p.dummyPrice || "",
            discountPercentage:
              p.DiscountPercentage || p.discountPercentage || 0,
            stock: p.Stock || p.stock || 0,
            advantages: p.Advantages || p.advantages || "",
            howToWear: p.HowToWear || p.howToWear || "",
            isActive: p.IsActive ?? true,
            // feature: p.Feature || p.feature || "",
            img: imgUrl,
            rating: parseFloat(
            p.Rating || p.rating || (Math.random() * 2 + 3).toFixed(1)
            ),
          });
        });
        // console.log("object");
        setProducts(Array.from(uniqueProducts.values()));
      } catch (err) {
        // console.error("Error fetching products:", err);
        if (isMounted) {
          setError("Failed to load products.");
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return { products, loading, error };
}
