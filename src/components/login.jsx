import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import GoogleSvg from "../assets/icons8-google.svg";
import FacebookSVG from "../assets/icons8-facebook.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signin", formData);
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      // Rediriger après la connexion
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/facebook";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
      <motion.div
        variants={slideIn("left", "tween", 0.7, 1)}
        style={{
          flex: 1,
          maxWidth: "600px",
          backgroundColor: "#f2f2f2",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className={styles.sectionHeadText} style={{ fontSize: "48px" }}>Connexion</h3>
        
        {/* Formulaire de connexion */}
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
          {/* Email */}
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

          {/* Password */}
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

          <button
            type="submit"
            style={{
              backgroundColor: "#ff6b6b",
              color: "white",
              padding: "20px 40px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "22px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
          >
            Connexion
          </button>
        </form>

        {/* Connexion via Facebook et Google */}
        <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
          <button onClick={handleFacebookLogin} style={socialLoginButtonStyle}>
            <img src={FacebookSVG} alt="Facebook" style={{ marginRight: "8px" }} />
            Connexion with Facebook
          </button>

          <button onClick={handleGoogleLogin} style={socialLoginButtonStyle}>
            <img src={GoogleSvg} alt="Google" style={{ marginRight: "8px" }} />
            Connexion with Google
          </button>
        </div>
      </motion.div>

      {/* Earth Canvas Section */}
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

// Styles for inputs and social login buttons
const inputStyle = {
  backgroundColor: "#dbcece",
  padding: "20px 24px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "18px",
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
