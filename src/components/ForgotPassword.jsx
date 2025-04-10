import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import Logo from "./Logo";
import Footerpage from "./Footerpage";
const ForgotPassword = () => {
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
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    try {
      await axios.patch("http://localhost:3000/api/auth/send-forgot-password-code", { email: formData.email });
      alert("Verification code sent! Check your email.");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send code");
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setStep(3);
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    try {
      await axios.patch("http://localhost:3000/api/auth/verify-forgot-password-code", {
        email: formData.email,
        providedCode: formData.providedCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      alert("Password changed successfully!");
      window.location.href = "/login";
    } catch (error) {
      setError(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
      <motion.div
        variants={slideIn("left", "tween", 0.7, 1)}
        style={{ flex: 1, maxWidth: "600px", backgroundColor: "#f2f2f2", padding: "50px", borderRadius: "16px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <h3 className={styles.sectionHeadText} style={{ fontSize: "48px" }}>
          {step === 1 ? "Forgot Password" : step === 2 ? "Enter Verification Code" : "Reset Password"}
        </h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {step === 1 && (
          <form onSubmit={sendEmail} style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px" }}>
            <label style={{ fontSize: "20px" }}>
              Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
            </label>
            <button type="submit" style={buttonStyle}>Send</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyCode} style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px" }}>
            <label style={{ fontSize: "20px" }}>
              Verification Code
              <input type="text" name="providedCode" value={formData.providedCode} onChange={handleChange} required style={inputStyle} />
            </label>
            <button type="submit" style={buttonStyle}>Verify Code</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword} style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px" }}>
            <label style={{ fontSize: "20px" }}>
              New Password
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required style={inputStyle} />
            </label>
            <label style={{ fontSize: "20px" }}>
              Confirm Password
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} />
            </label>
            <button type="submit" style={buttonStyle}>Reset Password</button>
          </form>
        )}
      </motion.div>

      <motion.div variants={slideIn("right", "tween", 0.2, 1)} style={{ flex: 1, maxWidth: "800px", height: "800px" }}>
        <EarthCanvas />
      </motion.div>

    </div>
    
  );
};

const inputStyle = {
  backgroundColor: "#dbcece",
  padding: "20px 24px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "18px",
};

const buttonStyle = {
  backgroundColor: "#ff6b6b",
  color: "white",
  padding: "20px 40px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontSize: "22px",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};

export default SectionWrapper(ForgotPassword, "ForgotPassword");
