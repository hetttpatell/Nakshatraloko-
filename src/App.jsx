import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext"; 

function App() {
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scroll-position");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem("scroll-position", window.scrollY.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <CartProvider>
      <WishlistProvider> 
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          {/* <Footer /> */}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;