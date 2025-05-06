import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import Logo from "./Logo";
import Footerpage from "./Footerpage";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    providedCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:3000/api/auth/send-forgot-password-code", {
        email: formData.email,
      });
      alert("📨 A verification code has been sent to your email.");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send code.");
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setStep(3);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:3000/api/auth/verify-forgot-password-code", formData);
      alert("✅ Your password has been successfully changed.");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Password reset failed.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ padding: "20px" }}>
        <Logo />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <motion.div
          variants={slideIn("left", "tween", 0.7, 1)}
          style={{
            flex: 1,
            minWidth: "300px",
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>
            {step === 1 && "Forgot your password?"}
            {step === 2 && "Check your inbox"}
            {step === 3 && "Create a new password"}
          </h2>

          {error && <p style={{ color: "#ff4d4f", marginBottom: "20px" }}>{error}</p>}

          {step === 1 && (
            <form onSubmit={sendEmail} style={formStyle}>
              <label style={labelStyle}>
                Email Address
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </label>
              <button type="submit" style={buttonStyle}>Send Verification Code</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyCode} style={formStyle}>
              <label style={labelStyle}>
                Enter the code from your email
                <input type="text" name="providedCode" value={formData.providedCode} onChange={handleChange} required style={inputStyle} />
              </label>
              <button type="submit" style={buttonStyle}>Continue</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={resetPassword} style={formStyle}>
              <label style={labelStyle}>
                New Password
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required style={inputStyle} />
              </label>
              <label style={labelStyle}>
                Confirm Password
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} />
              </label>
              <button type="submit" style={buttonStyle}>Reset Password</button>
            </form>
          )}

          <button
            onClick={() => navigate("/")}
            style={{
              ...buttonStyle,
              marginTop: "20px",
              backgroundColor: "#888",
            }}
          >
            ⬅ Back to Login
          </button>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          style={{
            flex: 1,
            maxWidth: "700px",
            minHeight: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EarthCanvas />
        </motion.div>
      </div>

      <div style={{ padding: "20px", width: "100%" }}>
        <Footerpage />
      </div>
    </div>
  );
};

// Styles
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const labelStyle = {
  fontSize: "18px",
  color: "#333",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const inputStyle = {
  backgroundColor: "#f1f1f1",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "16px",
  outline: "none",
};

const buttonStyle = {
  backgroundColor: "#ff6b6b",
  color: "#fff",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
  transition: "background 0.3s",
};

export default SectionWrapper(ForgotPassword, "ForgotPassword");