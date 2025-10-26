import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // save token in localStorage
      localStorage.setItem("authToken", token);
    }

    // ✅ always go to Home
    navigate("/");
  }, [navigate]);

  return <p>Logging you in...</p>;
}
