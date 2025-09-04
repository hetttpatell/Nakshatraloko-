import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // save JWT in localStorage
      localStorage.setItem("authToken", token);

      // redirect to homepage (or dashboard)
      navigate("/");
    } else {
      // if token missing, send back to login
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}
