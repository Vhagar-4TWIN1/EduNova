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

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    country: "",
    photo: "",
  });

  const [role, setRole] = useState("Student");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [diplomaFile, setDiplomaFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      photo: "",
    });
    setDiplomaFile(null);
    setVerificationResult(null);
    setProfileImageFile(null);
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
      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (max 5MB)");
        return;
      }
      setDiplomaFile(file);
      setVerificationResult(null);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification de la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (max 2MB)");
        return;
      }
      setProfileImageFile(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImageFile) return null;

    setIsUploadingProfile(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', profileImageFile);

      const response = await axios.post(
        'http://localhost:3000/api/auth/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (response.data.success) {
        return response.data.imagePath;
      }
      return null;
    } catch (error) {
      console.error('Profile image upload error:', error);
      alert("Échec de l'upload de l'image de profil");
      return null;
    } finally {
      setIsUploadingProfile(false);
      setUploadProgress(0);
    }
  };

  const verifyDiploma = async () => {
    if (!diplomaFile) {
      alert('Veuillez télécharger un fichier de diplôme');
      return;
    }

    setIsVerifying(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', diplomaFile);

      const response = await axios.post(
        'http://localhost:3000/api/auth/verify-diploma',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (response.data.success) {
        setVerificationResult({
          success: true,
          message: 'Diplôme vérifié avec succès!',
          info: response.data.diplomaInfo,
          certificateURL: response.data.certificateURL
        });
      } else {
        setVerificationResult({
          success: false,
          message: response.data.message || 'Échec de la vérification du diplôme',
          errors: response.data.errors || {}
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Erreur lors de la vérification du diplôme',
        errors: { system: 'Erreur réseau' }
      });
    } finally {
      setIsVerifying(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (role === "Teacher") {
      if (!diplomaFile) {
        alert('Veuillez télécharger votre diplôme');
        return;
      }

      if (!verificationResult || !verificationResult.success) {
        alert('Veuillez vérifier votre diplôme avant de soumettre');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Upload profile image first if selected
      let photoUrl = formData.photo;
      if (profileImageFile) {
        photoUrl = await uploadProfileImage();
        if (!photoUrl) {
          alert('Échec du téléchargement de la photo de profil');
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        role,
        photo: photoUrl,
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
        alert('Inscription réussie!');
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          age: "",
          email: "",
          password: "",
          country: "",
          photo: "",
        });
        setDiplomaFile(null);
        setVerificationResult(null);
        setProfileImageFile(null);
      } else {
        alert(response.data.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
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
            Étudiant
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
            Enseignant
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
                <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Diplôme (PDF/Image)*</span>
                <input
                  type="file"
                  name="diploma"
                  onChange={handleDiplomaUpload}
                  accept="image/*,.pdf"
                  style={inputStyle}
                  disabled={isVerifying}
                />
                {isVerifying && (
                  <div style={{ marginTop: "8px" }}>
                    <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
                    <span>Vérification en cours... {uploadProgress}%</span>
                  </div>
                )}
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
                {isVerifying ? 'Vérification...' : 'Vérifier le diplôme'}
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
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Photo de profil</span>
            <input
              type="file"
              name="photo"
              accept=".jpg,.jpeg,.png"
              onChange={handleProfileImageUpload}
              style={inputStyle}
              disabled={isUploadingProfile}
            />
            {isUploadingProfile && (
              <div style={{ marginTop: "8px" }}>
                <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
                <span>Téléchargement... {uploadProgress}%</span>
              </div>
            )}
          </label>

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
            disabled={isSubmitting || isUploadingProfile || isVerifying}
            style={{
              padding: "16px 32px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "18px",
              transition: "background-color 0.3s ease",
              opacity: isSubmitting || isUploadingProfile || isVerifying ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
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