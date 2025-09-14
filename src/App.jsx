import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import LoginSignup from "./Components/Login/Login";
import ScrollToTop from "./Scrollingfix";
import { ConsultancyProvider } from "./Context/ConsultancyContext";
import { ThemeProvider } from "./Context/ThemeContext";


// ✅ Import toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [backendData, setBackendData] = useState(null); // <-- store backend response
  const location = useLocation();


  const hideFooter = location.pathname.startsWith("/admin");

  // useEffect(() => {
  //   // ✅ Example fetch from backend
  //   fetch(`${import.meta.env.VITE_API_URL}/`, {
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setBackendData(data))
  //     .catch((err) => console.error("Backend error:", err));
  // }, []);


  // SCROLL TO THE TOP WHEN CALL THE SECTION 


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
    <ConsultancyProvider>
      <ThemeProvider>   {/* ✅ use ThemeProvider instead of ThemeContext */}
        <CartProvider>
          <WishlistProvider>
            <div className={`flex flex-col min-h-screen ${showLogin ? "filter blur-sm" : ""}`}>
              <ScrollToTop />
              <Header onLoginClick={() => setShowLogin(true)} />

              <main className="flex-grow">
                <Outlet />
                {/* Optional: backend debug output */}
                {backendData && (
                  <pre className="bg-gray-100 p-2 mt-4 rounded">
                    {JSON.stringify(backendData, null, 2)}
                  </pre>
                )}
              </main>

              {!hideFooter && <Footer />}
              {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}
            </div>

            {/* ✅ Add ToastContainer once here */}
            <ToastContainer position="top-right" autoClose={3000} />

          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </ConsultancyProvider>
  );
}

export default App;
