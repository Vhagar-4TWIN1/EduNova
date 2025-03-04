import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
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
    photo: "", // L'image de profil est obligatoire
  });

  const [extractionImage, setExtractionImage] = useState(null);
  const [extractionImagePreview, setExtractionImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExtractionImageChange = (e) => {
    const file = e.target.files[0];
    setExtractionImage(file);
    setExtractionImagePreview(URL.createObjectURL(file));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleExtractionImageUpload = async () => {
    if (!extractionImage) {
      alert("Veuillez sélectionner une image pour l'extraction");
      return;
    }

    const formDataImage = new FormData();
    formDataImage.append("image", extractionImage);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/upload-image", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setFormData({
          firstName: response.data.prenom || "",
          lastName: response.data.nom || "",
          email: response.data.email || "",
          photo: response.data.image || "",
          age: "",
          password: "",
          country: "",
        });
      } else {
        alert("Échec de l'extraction des informations.");
      }
    } catch (error) {
      console.error("Erreur lors de l’upload :", error);
      alert("Une erreur est survenue");
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImage) {
      alert("Veuillez sélectionner une image de profil");
      return;
    }
  
    const formDataImage = new FormData();
    formDataImage.append("image", profileImage);
  
    try {
      const response = await axios.post("http://localhost:3000/api/auth/upload-profile-image", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.success) {
        setFormData({ ...formData, photo: response.data.imagePath }); // Mettre à jour le chemin de l'image de profil
        alert("Image de profil uploadée avec succès !");
      } else {
        alert("Échec de l'upload de l'image de profil.");
      }
    } catch (error) {
      console.error("Erreur lors de l’upload :", error);
      alert("Une erreur est survenue lors de l'upload de l'image de profil.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si l'image de profil est uploadée
    if (!formData.photo) {
      alert("Veuillez uploader une image de profil.");
      return;
    }

    console.log("Form Data:", formData); // Log form data to inspect it

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", formData);
      console.log("Sign-up successful:", response.data);
    } catch (error) {
      console.error("Error during sign-up:", error.response?.data || error.message);
    }
  };

  const handleFacebookSignup = () => {
    window.location.href = "http://localhost:3000/api/auth/facebook";
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
          maxWidth: "1200px",
          backgroundColor: "#f2f2f2",
          padding: "50px",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className={styles.sectionSubText} style={{ fontSize: "90px" }}>Welcome</h3>
        <h1 className={styles.sectionHeadText} style={{ fontSize: "30px" }}>Your informations </h1>

        {/* Upload Extraction Image */}
        <label style={{ display: "block", marginBottom: "16px", fontSize: "20px" }}>
          <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Upload Extraction Image</span>
          <input type="file" onChange={handleExtractionImageChange} accept="image/*" style={inputStyle} />
        </label>
        <button
          onClick={handleExtractionImageUpload}
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
          Extract your data
        </button>

        {extractionImagePreview && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ fontSize: "24px" }}>Aperçu de l’image d'extraction:</h3>
            <img src={extractionImagePreview} alt="Aperçu" width="300px" />
          </div>
        )}

        {/* Upload Profile Image */}
        <label style={{ display: "block", marginBottom: "16px", fontSize: "20px" }}>
          <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Upload Profile Image</span>
          <input type="file" onChange={handleProfileImageChange} accept="image/*" style={inputStyle} />
        </label>
        <button
          onClick={handleProfileImageUpload}
          style={{
            padding: "16px 32px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
            transition: "background-color 0.3s ease",
          }}
        >
          Upload Profile Image
        </button>

        {profileImagePreview && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ fontSize: "24px" }}>Aperçu de l’image de profil:</h3>
            <img src={profileImagePreview} alt="Aperçu" width="300px" />
          </div>
        )}

        {/* Bouton de connexion avec Facebook */}
        <button
          onClick={handleFacebookSignup}
          className="facebook-button"
          style={{
            padding: "16px 32px",
            backgroundColor: "#4267B2",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
            marginTop: "16px",
          }}
        >
          Sign up with Facebook
        </button>

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
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>First Name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          {/* Last Name */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Last Name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          {/* Age */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Age</span>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          {/* Email */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Email</span>
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
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

          {/* Country */}
          <label style={{ display: "flex", flexDirection: "column", fontSize: "20px" }}>
            <span style={{ color: "black", marginBottom: "8px", fontSize: "20px" }}>Country</span>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>

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