import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext"; 
import LoginSignup from "./Components/Login/Login"; // import your login modal
import ScrollToTop from "./Scrollingfix";

function App() {
  const [showLogin, setShowLogin] = useState(false); // state to control login modal
  const location = useLocation();

  // Determine if footer should be hidden
  const hideFooter = location.pathname.startsWith("/admin");

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
        <div className={`flex flex-col min-h-screen ${showLogin ? "filter blur-sm" : ""}`}>
          <ScrollToTop />
          <Header onLoginClick={() => setShowLogin(true)} />

          <main className="flex-grow">
            <Outlet />
          </main>

          {/* Footer is hidden on Admin routes */}
          {!hideFooter && <Footer />}
          {/* <Footer /> */}

          {/* Login Modal */}
          {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
