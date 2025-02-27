import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backgroundImage from "../assets/backgroundlogin.jpg"; 
import GoogleSvg from "../assets/icons8-google.svg";
import FacebookSVG from "../assets/icons8-facebook.svg";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";
import { Navigate } from "react-router-dom";
import LinkedinSvg from "../assets/icon-linkedin.svg";

const Login = () => {
  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem("rememberedEmail") || "";
    const savedPassword = localStorage.getItem("rememberedPassword") || "";
    return { email: savedEmail, password: savedPassword };
  });
  
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true"; 

    if (savedRememberMe && savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLinkedinLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/linkedin";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/facebook";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signin", formData);
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedPassword", formData.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
    navigate("/home")
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.7, 1)}
        style={{
          flex: 1,
          maxWidth: "600px",
          backgroundColor: "#f2f2f2",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(45, 161, 92, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "48px" }}>Connexion</h3>
        
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginTop: "32px",
          }}
        >
          <label style={{ fontSize: "20px" }}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          <label style={{ fontSize: "20px" }}>
            <span>Password</span>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="remember-checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember-checkbox">Remember me</label>
          </div>

          <button
            type="submit"
            style={buttonStyle}
          >
            Connexion
          </button>
        </form>

        <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
          <button onClick={handleFacebookLogin} style={socialLoginButtonStyle}>
            <img src={FacebookSVG} alt="Facebook" style={{ marginRight: "8px" }} />
            Connexion with Facebook
          </button>

          <button onClick={handleGoogleLogin} style={socialLoginButtonStyle}>
            <img src={GoogleSvg} alt="Google" style={{ marginRight: "8px" }} />
            Connexion with Google
          </button>
        

          <button onClick={handleLinkedinLogin} style={socialLoginButtonStyle}>
            <img src={LinkedinSvg} alt="Linkedin" style={{ marginRight: "8px" }} />
            Connexion with Linkedin
          </button>
        </div>

        <p>
          Vous n'avez pas de compte ? <a href="/registration">Inscrivez-vous</a>
        </p>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        style={{
          flex: 1,
          maxWidth: "800px",
          height: "800px",
        }}
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

// Styles
const inputStyle = {
  backgroundColor: "#dbcece",
  padding: "20px 24px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "18px",
};

const buttonStyle = {
  backgroundColor: "#008000",
  color: "white",
  padding: "20px 40px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontSize: "22px",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};

const socialLoginButtonStyle = {
  backgroundColor: "#dbdbdb",
  color: "black",
  padding: "10px 20px",
  borderRadius: "12px",
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
};

export default SectionWrapper(Login, "login");
