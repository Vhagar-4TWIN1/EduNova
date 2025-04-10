import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component
import Logo from "./Logo";
import Footerpage from "./Footerpage";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    country: "",
    photo: "",
    workCertificate: "",
  });

  const [role, setRole] = useState("Student"); // Default role is Student
  const [recaptchaValue, setRecaptchaValue] = useState(null); // Store reCAPTCHA value
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setRole(role);
    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      email: "",
      password: "",
      country: "",
      photo: "",
      workCertificate: "",
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required";
    }
    if (!formData.age || formData.age < 18) {
      errors.age = "Age must be at least 18";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }
  

    if (!formData.country) errors.country = "Country is required";
    if (!recaptchaValue) errors.recaptcha = "Please verify reCAPTCHA";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Form Data Submitted:", formData);

    const dataToSend = {
      ...formData,
      role,
      recaptchaToken: recaptchaValue,
    };
    
    if (!formData.photo) {
      alert("Veuillez uploader une image de profil.");
      return;
    }
    if (role === "Student") {
      delete dataToSend.workCertificate;  // Exclure le champ workCertificate
    }
  

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        ...formData,
        role,
        recaptchaToken: recaptchaValue,
      });
      console.log("Sign-up successful:", response.data);
    } catch (error) {
      console.error("Error during sign-up:", error.response?.data || error.message);
      alert("Signup failed! Please try again later.");
    }
  };

  const inputStyle = {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "16px",
    backgroundColor: "#fff",
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
        paddingBottom: '150px',
        position: "relative",
      }}
    >
      <Logo />
      <Footerpage />
      
      <motion.div
        variants={slideIn("left", "tween", 0.7, 1)}
        style={{
          flex: 1,
          maxWidth: "800px",
          backgroundColor: "#f2f2f2",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className={styles.sectionSubText} style={{ fontSize: "90px" }}>Welcome</h3>

        {/* Role Selection */}
        <div style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => handleRoleChange("Student")}
            style={{
              padding: "16px 32px",
              backgroundColor: role === "Student" ? "#4CAF50" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "18px",
              transition: "background-color 0.3s ease",
            }}
          >
            Student
          </button>
          <button 
            onClick={() => handleRoleChange("Teacher")}
            style={{
              padding: "16px 32px",
              backgroundColor: role === "Teacher" ? "#4CAF50" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "18px",
              transition: "background-color 0.3s ease",
              marginLeft: "10px"
            }}
          >
            Teacher
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginTop: "32px",
          }}
        >
          {/* First Name */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>First Name*</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {formErrors.firstName && <span style={{ color: 'red' }}>{formErrors.firstName}</span>}
          </label>

          {/* Last Name */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Last Name*</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {formErrors.lastName && <span style={{ color: 'red' }}>{formErrors.lastName}</span>}
          </label>

          {/* Role Specific Fields */}
          {role === "Teacher" && (
            <>
              <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
                <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Work Certificate*</span>
                <input
                  type="file"
                  name="workCertificate"
                  onChange={handleChange}
                  style={inputStyle}
                />
              </label>
            </>
          )}

          {/* Profile Image */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Profile Image</span>
            <input
              type="file"
              name="photo"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              style={inputStyle}
            />
            {formErrors.photo && <span style={{ color: 'red' }}>{formErrors.photo}</span>}
          </label>

          {/* Email */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Email*</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
          </label>

          {/* Age */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Age*</span>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {formErrors.age && <span style={{ color: 'red' }}>{formErrors.age}</span>}
          </label>

          {/* Password */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Password*</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {formErrors.password && <span style={{ color: 'red' }}>{formErrors.password}</span>}
          </label>

          {/* Country */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Country*</span>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {formErrors.country && <span style={{ color: 'red' }}>{formErrors.country}</span>}
          </label>

          {/* Google reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6LeR2eIqAAAAACc0qs2KlTrKqXNpV6RF4NXL1Ggj" // Replace with your site key
            onChange={(value) => setRecaptchaValue(value)} // Store reCAPTCHA response
          />

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: "16px 32px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "18px",
              transition: "background-color 0.3s ease",
            }}
          >
            Sign Up
          </button>
        </form>
      </motion.div>

      {/* Earth Canvas Section */}
      <motion.div
        variants={slideIn("right", "tween", 0.6, 1)}
        style={{
          flex: 1.5,
          maxWidth: "800px",
          height: "800px",
        }}
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
