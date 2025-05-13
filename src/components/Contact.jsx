import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import ReCAPTCHA from "react-google-recaptcha";
import Logo from "./Logo";
import Footerpage from "./Footerpage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    country: "",
  });

  const [role, setRole] = useState("Student");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [diplomaFile, setDiplomaFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      email: "",
      password: "",
      country: "",
    });
    setDiplomaFile(null);
    setVerificationResult(null);
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }
    if (!formData.country) errors.country = "Country is required";
    if (!recaptchaValue) errors.recaptcha = "Please verify reCAPTCHA";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDiplomaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large (max 5MB)");
        return;
      }
      setDiplomaFile(file);
      setVerificationResult(null);
    }
  };

  const verifyDiploma = async () => {
  if (!diplomaFile) {
    toast.error('Please upload a diploma file');
    return;
  }

  setIsVerifying(true);

  try {
    const formData = new FormData();
    formData.append('image', diplomaFile);

    const response = await axios.post(
      'http://localhost:3000/api/auth/verify-diploma',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      setVerificationResult({
        success: true,
        message: 'Diploma verified successfully!',
        info: response.data.diplomaInfo,
        certificateURL: response.data.certificateURL
      });
      toast.success('Diploma verified successfully!');
    } else {
      setVerificationResult({
        success: false,
        message: response.data.message || 'Diploma verification failed',
        errors: response.data.errors || {}
      });
      toast.error(response.data.message || 'Diploma verification failed');
    }
  } catch (error) {
    console.error('Verification error:', error);
    setVerificationResult({
      success: false,
      message: error.response?.data?.message || 'Error during diploma verification',
      errors: error.response?.data?.errors || { system: 'Network error' }
    });
    toast.error(error.response?.data?.message || 'Error during diploma verification');
  } finally {
    setIsVerifying(false);
  }
};

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.wav");
    audio.play();
  };

  const startBreakTimer = () => {
    console.log(`Break timer started`);
    setInterval(() => {
      toast.warn("⏳ Time for a break! You've been active for an hour.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      playNotificationSound();
    }, 10000); // 1 min in milliseconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (role === "Teacher") {
      if (!diplomaFile) {
        alert('Please upload your diploma');
        return;
      }

      if (!verificationResult || !verificationResult.success) {
        alert('Please verify your diploma before submitting');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        role,
      };

      if (role === "Teacher") {
        payload.workCertificate = verificationResult.certificateURL;
        payload.bio = "";
        payload.experience = "";
        payload.cin = "";
        payload.number = "";
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        payload,
        {
          headers: {
            'recaptcha-token': recaptchaValue,
            'Content-Type': 'application/json'
          }
        }
      );
     

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("userId",response.data.user.id);
        localStorage.setItem("firstName", response.data.user.firstName);
        localStorage.setItem("lastName", response.data.user.lastName);
        localStorage.setItem("role", response.data.user.role);
        

        const decodedToken = parseJwt(token);
        if (!decodedToken || !decodedToken.userId) {
          alert("Invalid token.");
          return;
        }

         toast.info(
          <div style={{ textAlign: 'center' }}>
            <h3>You will pass a test to test your level</h3>
            <div style={{ margin: '20px 0', textAlign: 'left' }}>
              <p><strong>Instructions:</strong></p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                <li>Only one person allowed in camera view</li>
                <li>Face must be centered and visible at all times</li>
                <li>No looking away from the screen</li>
                <li>No switching tabs/windows</li>
                <li>No copy/paste allowed</li>
                <li>No speaking or communicating with others</li>
              </ul>
            </div>
            <button
              onClick={() => {
                toast.dismiss();
                navigate("/exam");
                startBreakTimer();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              I Understand - Start Test
            </button>
          </div>,
          {
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false,
            style: {
              minWidth: '500px',
              maxWidth: '600px',
              padding: '20px'
            }
          }
        );

        toast.success('Registration successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        
        setFormData({
          firstName: "",
          lastName: "",
          age: "",
          email: "",
          password: "",
          country: "",
        });
        setDiplomaFile(null);
        setVerificationResult(null);
      } else {
        toast.error(response.data.message || 'Registration failed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'An error occurred during registration', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
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
  <Logo 
        customStyle={{
          top: '-120px',    // choose the distance from the top
          right: '0px',  // choose the distance from the right
          // you can override other properties if needed
        }}
      />
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
        <h3 className={styles.sectionSubText} style={{ fontSize: "50px" }}>Welcome</h3>

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

          {role === "Teacher" && (
            <>
              <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
                <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Diploma (PDF/Image)*</span>
                <input
                  type="file"
                  name="diploma"
                  onChange={handleDiplomaUpload}
                  accept="image/*,.pdf"
                  style={inputStyle}
                  disabled={isVerifying}
                />
              </label>
              
              <button
                type="button"
                onClick={verifyDiploma}
                disabled={isVerifying || !diplomaFile}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginBottom: "16px",
                  opacity: isVerifying || !diplomaFile ? 0.7 : 1
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify Diploma'}
              </button>

              {verificationResult && (
                <div style={{
                  padding: "12px",
                  marginBottom: "16px",
                  backgroundColor: verificationResult.success ? "#E8F5E9" : "#FFEBEE",
                  borderLeft: `4px solid ${verificationResult.success ? "#4CAF50" : "#F44336"}`,
                  color: verificationResult.success ? "#2E7D32" : "#C62828"
                }}>
                  {verificationResult.message}
                  {verificationResult.errors && Object.keys(verificationResult.errors).length > 0 && (
                    <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                      {Object.entries(verificationResult.errors).map(([key, value]) => (
                        value && <li key={key}>{value}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}

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

          <ReCAPTCHA
            sitekey="6LeR2eIqAAAAACc0qs2KlTrKqXNpV6RF4NXL1Ggj"
            onChange={(value) => setRecaptchaValue(value)}
          />
          {formErrors.recaptcha && <span style={{ color: 'red' }}>{formErrors.recaptcha}</span>}

          <button
            type="submit"
            disabled={isSubmitting || isVerifying}
            style={{
              padding: "16px 32px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "18px",
              transition: "background-color 0.3s ease",
              opacity: isSubmitting || isVerifying ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </motion.div>

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