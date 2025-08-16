import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("http://localhost:5001/auth/logout");
        // Clear the token from local/session storage
        sessionStorage.removeItem("token");
        localStorage.removeItem("user"); // Remove user from localStorage
        window.dispatchEvent(new Event("userLogout")); // Use userLogout for clarity
        // Force full page reload to login page to reset app state
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
        // No need to use navigate or reload here
      } catch (err) {
        console.error("Logout error", err);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
      <span className="sr-only ms-2">Logging out...</span>
    </div>
  );
};

export default Logout;


