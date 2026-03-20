import React from "react";
import { createContext, useContext, useState } from "react";
import LoginSignup from "../Components/Login/Login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const openLoginModal = () => setShowLogin(true);
  const closeLoginModal = () => setShowLogin(false);

  return (
    <AuthContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      {showLogin && <LoginSignup onClose={closeLoginModal} />}
    </AuthContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthContext);