import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleSvg from "../assets/icons8-google.svg";
import FacebookSVG from "../assets/icons8-facebook.svg";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GithubSVG from "../assets/icons8-github.svg";
import LinkedinSvg from "../assets/icon-linkedin.svg";
import Logo from "./Logo";
import Footerpage from "./Footerpage";

const Login = () => {
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/oauth";
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem("rememberedEmail") || "";
    const savedPassword = localStorage.getItem("rememberedPassword") || "";
    return { email: savedEmail, password: savedPassword };
  });
  
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      navigate("/"); // Redirect to home or dashboard if already logged in
    }
    
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true"; 

    if (savedRememberMe && savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };
  
  const handleLinkedinLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/linkedin";
  };

  const handleFacebookLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    window.location.href = 'http://localhost:3000/api/auth/facebook';
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
  
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/home');
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { ...formData, password: '****' });
      
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError("Password must be at least 8 characters with uppercase, lowercase, and numbers");
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin", 
        formData,
        { 
          timeout: 5000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log("Login response:", response.data);
      
      if (response.data?.success && response.data?.token) {
        console.log("Login successful:", response.data);
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rememberMe", rememberMe.toString());
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberedPassword", formData.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        localStorage.setItem("firstName", response.data.user.firstName);
        localStorage.setItem("lastName", response.data.user.lastName);      
        localStorage.setItem('role', response.data.user.role);
       
        if (response.data.user.role === 'Admin') {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        setError(response.data?.message || "Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'ECONNABORTED') {
        setError("Connection timeout. Server may be down or not responding.");
      } else if (error.code === 'ERR_NETWORK') {
        setError("Network error. Please check if the backend server is running.");
      } else if (error.response?.status === 401) {
        setError(error.response.data?.message || "Invalid email or password.");
      } else {
        setError(
          error.response?.data?.message || 
          "Login failed. Please check your credentials and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        padding: "20px",
        position: "relative",
        flexDirection: "column", // Stack elements vertically
      }}
    >
      <Logo />
      <Footerpage />

      <div style={{ display: "flex", flexDirection: "row", width: "100%", maxWidth: "1300px", flexWrap: "wrap" }}>
        <motion.div
          variants={slideIn("left", "tween", 0.7, 1)}
          style={{
            flex: 1,
            maxWidth: "600px",
            backgroundColor: "#f2f2f2",
            padding: "50px",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(45, 161, 92, 0.1)",
            width: "100%",
            boxSizing: "border-box",
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
                  style={{ ...inputStyle, paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "transparent",
                    border: "none",
                    position: "absolute",
                    top: "40%",
                    right: "-160px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} color="#555" />
                  ) : (
                    <FaEye size={16} color="#555" />
                  )}
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
              disabled={loading}
            >
              {loading ? "Signing in..." : "Connexion"}
            </button>
          </form>
          <p style={{ fontSize: "18px", textAlign: "center", marginTop: "32px" }}>
            Vous n'avez pas de compte? <Link to="/registration" style={{ color: "#ff6b6b" }}>Inscrivez-vous</Link>
            <br />
            <Link to="/forgot-password">Forgot Password</Link>
          </p>

          <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
            <button onClick={handleGoogleLogin} style={socialLoginButtonStyle}>
              <img src={GoogleSvg} alt="Google" style={{ marginRight: "8px" }} />
            </button>
            <button onClick={handleLinkedinLogin} style={socialLoginButtonStyle}>
              <img src={LinkedinSvg} alt="Linkedin" style={{ marginRight: "8px" }} />
            </button>
            <button onClick={handleGitHubLogin} style={socialLoginButtonStyle}>
              <img src={GithubSVG} alt="GitHub" style={{ marginRight: "8px" }} />
            </button>
            <button onClick={handleFacebookLogin} style={socialLoginButtonStyle}>
              <img src={FacebookSVG} alt="Facebook" style={{ marginRight: "8px" }} />
            </button>
          </div>

          <p>
            Vous n'avez pas de compte ? <Link to="/registration">Inscrivez-vous</Link>
          </p>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          style={{
            flex: 1,
            maxWidth: "800px",
            height: "800px",
            width: "100%",
          }}
        >
          <EarthCanvas />
        </motion.div>
      </div>
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
  width: "100%",
  boxSizing: "border-box",
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
  color: "#333",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  transition: "background-color 0.3s ease",
};

export default SectionWrapper(Login, "login");