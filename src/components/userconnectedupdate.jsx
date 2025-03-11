import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import {
  TextField,
  Button,
  CircularProgress,
  Container,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css";

// Styled components for image upload
const ProfileImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(5),
  position: "relative",
  marginTop: "-85px",
  zIndex: 10,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 170,
  height: 170,
  border: `5px solid white`,
  boxShadow: "0 10px 30px rgba(79, 165, 79, 0.25)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 15px 35px rgba(79, 165, 79, 0.35)",
    border: `5px solid rgba(79, 165, 79, 0.1)`,
  },
}));

const UploadInput = styled("input")({
  display: "none",
});

const EditIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 10,
  right: "calc(50% - 85px)",
  backgroundColor: "#4fa54f",
  color: "white",
  width: 45,
  height: 45,
  boxShadow: "0 6px 16px rgba(61, 138, 61, 0.3)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    backgroundColor: "#3d8a3d",
    transform: "translateY(-3px) scale(1.1)",
    boxShadow: "0 8px 20px rgba(61, 138, 61, 0.4)",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(249, 250, 251, 0.8)",
    "&:hover": {
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
      backgroundColor: "rgba(249, 250, 251, 1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 5px 15px rgba(79, 165, 79, 0.2)",
      backgroundColor: "white",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
    outline: "none",
  },
  "& .MuiInputLabel-root": {
    fontWeight: "500",
    "&.Mui-focused": {
      color: "#3d8a3d",
    },
  },
  "& .MuiInputBase-input": {
    padding: "15px 14px",
  },
  marginBottom: "8px",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  paddingBottom: "15px",
  marginBottom: "30px",
  fontWeight: "700",
  color: "#333",
  fontSize: "1.25rem",
  letterSpacing: "0.5px",
  "&:after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    height: "4px",
    width: "50px",
    backgroundColor: "#4fa54f",
    borderRadius: "4px",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    height: "4px",
    width: "100px",
    backgroundColor: "rgba(79, 165, 79, 0.2)",
    borderRadius: "4px",
  },
}));

const ActionButton = styled(Button)(({ color = "primary" }) => ({
  borderRadius: "10px",
  padding: "14px 0",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "none",
  fontSize: "1rem",
  boxShadow: color === "primary" 
    ? "0 6px 16px rgba(79, 165, 79, 0.25)" 
    : "0 6px 16px rgba(239, 83, 80, 0.25)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: color === "primary" 
      ? "0 8px 20px rgba(79, 165, 79, 0.35)" 
      : "0 8px 20px rgba(239, 83, 80, 0.35)",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
}));

const StyledFormControl = styled(FormControl)({
  display: "flex",
  alignItems: "center",
  marginTop: "12px",
  padding: "10px",
  backgroundColor: "rgba(79, 165, 79, 0.05)",
  borderRadius: "10px",
  border: "1px solid rgba(79, 165, 79, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(79, 165, 79, 0.08)",
    border: "1px solid rgba(79, 165, 79, 0.2)",
  },
  "& label": {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    fontWeight: "500",
    "& input": {
      marginRight: "10px",
      width: "18px",
      height: "18px",
      accentColor: "#4fa54f",
    },
  },
});

const GradientHeader = styled(Box)({
  background: "linear-gradient(135deg, #4fa54f 0%, #2E7D32 100%)",
  paddingTop: "70px",
  paddingBottom: "110px",
  position: "relative",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  textAlign: "center",
  boxShadow: "inset 0 -10px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMG0tMTAwIDBhMTAwIDEwMCAwIDEgMCAyMDAgMCAxMDAgMTAwIDAgMSAwIC0yMDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')",
    backgroundRepeat: "repeat",
    backgroundSize: "30px 30px",
    opacity: 0.2,
  },
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40px",
    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))",
  },
});

const ProfileCard = styled(Paper)({
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
  marginTop: "30px",
  marginBottom: "50px",
  position: "relative",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)",
  },
});

const ContentContainer = styled(Box)({
  padding: "30px 40px 50px",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "5%",
    right: "5%",
    height: "1px",
    background: "linear-gradient(to right, transparent, rgba(0,0,0,0.05), transparent)",
  },
});

const CustomDivider = styled(Divider)({
  margin: "40px 0",
  background: "linear-gradient(to right, transparent, rgba(79, 165, 79, 0.3), transparent)",
  height: "2px",
  borderRadius: "1px",
});

const ErrorMessage = styled(Typography)({
  marginTop: "24px",
  padding: "16px",
  backgroundColor: "rgba(239, 83, 80, 0.1)",
  borderRadius: "10px",
  textAlign: "center",
  border: "1px solid rgba(239, 83, 80, 0.3)",
  fontWeight: "500",
  color: "#d32f2f",
  boxShadow: "0 4px 8px rgba(239, 83, 80, 0.1)",
});

const HelperText = styled(Typography)({
  marginTop: "8px", 
  color: "rgba(0, 0, 0, 0.6)",
  fontStyle: "italic",
  fontSize: "0.85rem",
  lineHeight: "1.4",
});

const UserProfile = () => {
  // Basic user information
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    country: "",
    role: "",
    photo: "",
  });
  
  // Role-specific data
  const [adminData, setAdminData] = useState({
    cin: "",
    number: ""
  });
  
  const [teacherData, setTeacherData] = useState({
    number: "",
    bio: "",
    cv: "",
    diplomas: [],
    experience: "",
    cin: ""
  });
  
  const [studentData, setStudentData] = useState({
    identifier: "",
    situation: "",
    disease: "",
    socialCase: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Token is missing. Please log in.");
      return;
    }

    // Extract userId from the token
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };

    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.userId) {
      alert("Invalid token.");
      return;
    }
    
    const userId = decodedToken.userId;
    setId(userId);

    axios
      .get(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("User data response:", response.data);
        
        if (response.data && response.data.data) {
          const user = response.data.data;
          
          // Set basic user data
          setUserData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            age: user.age || "",
            country: user.country || "",
            role: user.role || "",
            photo: user.photo || "",
          });
          
          // Set profile image if available
          if (user.photo) {
            setPreviewUrl(`http://localhost:3000/${user.photo}`);
          }
          
          // Set role-specific data
          if (user.role === "Admin") {
            setAdminData({
              cin: user.cin || "",
              number: user.number || ""
            });
          } else if (user.role === "Teacher") {
            setTeacherData({
              number: user.number || "",
              bio: user.bio || "",
              cv: user.cv || "",
              diplomas: user.diplomas || [],
              experience: user.experience || "",
              cin: user.cin || ""
            });
          } else if (user.role === "Student") {
            setStudentData({
              identifier: user.identifier || "",
              situation: user.situation || "",
              disease: user.disease || "",
              socialCase: user.socialCase || false
            });
          }
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading user data:", error);
        setError("Error loading user data.");
        setLoading(false);
      });
  }, [token]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Preview the image
    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result;
      setPreviewUrl(imageUrl);
  
      // Load face-api.js models if not loaded
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  
      // Create an image element and check for a face
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        const imageDetection = await faceapi.detectSingleFace(
          img,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptor();
  
        if (!imageDetection) {
          alert("No face detected in the selected image.");
          setPreviewUrl(null); // Reset preview if no face is found
          setImageFile(null);
          return;
        }
  
        setImageFile(file);
        alert("Image loaded successfully! Face detected.");
      };
    };
    reader.readAsDataURL(file);
  };
  

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("profile", imageFile);
      
      const response = await axios.post(
        "http://localhost:3000/api/users/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setImageLoading(false);
      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload profile image.");
      setImageLoading(false);
      return null;
    }
  };
  
  const handleBasicInfoChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAdminDataChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTeacherDataChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleStudentDataChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setStudentData({
      ...studentData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Upload image if present
      let photoPath = userData.photo;
      if (imageFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          photoPath = uploadedPath;
        }
      }
      
      // Split the update into two parts - basic user info first
      const basicUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        age: userData.age,
        country: userData.country,
        photo: photoPath
      };
      
      console.log("Sending basic user data update:", basicUserData);
      
      // First update the basic user data
      const basicResponse = await axios.patch(
        `http://localhost:3000/api/users/${id}`,
        basicUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Basic update response:", basicResponse.data);
      
      // Then handle role-specific data as a separate update
      if (userData.role === "Admin") {
        // Prepare admin-specific data
        const adminSpecificData = {
          cin: adminData.cin,
          number: adminData.number,
        };
        
        console.log("Sending admin-specific update:", adminSpecificData);
        
        await axios.patch(
          `http://localhost:3000/api/users/${id}`,
          adminSpecificData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } 
      else if (userData.role === "Teacher") {
        // Prepare teacher-specific data
        const teacherSpecificData = {
          number: teacherData.number,
          bio: teacherData.bio,
          cv: teacherData.cv,
          diplomas: teacherData.diplomas,
          experience: teacherData.experience,
          cin: teacherData.cin
        };
        
        console.log("Sending teacher-specific update:", teacherSpecificData);
        
        await axios.patch(
          `http://localhost:3000/api/users/${id}`,
          teacherSpecificData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } 
      else if (userData.role === "Student") {
        // Prepare a focused update with ONLY the student-specific fields
        const studentSpecificData = {
          identifier: studentData.identifier,
          situation: studentData.situation,
          disease: studentData.disease,
          socialCase: studentData.socialCase
        };
        
        console.log("Sending student-specific update:", studentSpecificData);
        
        // Use the specialized student fields endpoint
        const studentResponse = await axios.patch(
          `http://localhost:3000/api/users/${id}/student-fields`,
          studentSpecificData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log("Student update response:", studentResponse.data);
      }
      
      // Fetch the latest user data to make sure we have the most up-to-date information
      const refreshResponse = await axios.get(
        `http://localhost:3000/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (refreshResponse.data && refreshResponse.data.data) {
        const refreshedUser = refreshResponse.data.data;
        console.log("Refreshed user data:", refreshedUser);
        
        // Update basic user data
        setUserData({
          firstName: refreshedUser.firstName || "",
          lastName: refreshedUser.lastName || "",
          email: refreshedUser.email || "",
          age: refreshedUser.age || "",
          country: refreshedUser.country || "",
          role: refreshedUser.role || "",
          photo: refreshedUser.photo || "",
        });
        
        // Update role-specific data based on user role
        if (refreshedUser.role === "Admin") {
          setAdminData({
            cin: refreshedUser.cin || "",
            number: refreshedUser.number || ""
          });
        } else if (refreshedUser.role === "Teacher") {
          setTeacherData({
            number: refreshedUser.number || "",
            bio: refreshedUser.bio || "",
            cv: refreshedUser.cv || "",
            diplomas: refreshedUser.diplomas || [],
            experience: refreshedUser.experience || "",
            cin: refreshedUser.cin || ""
          });
        } else if (refreshedUser.role === "Student") {
          setStudentData({
            identifier: refreshedUser.identifier || "",
            situation: refreshedUser.situation || "",
            disease: refreshedUser.disease || "",
            socialCase: refreshedUser.socialCase || false
          });
        }
      }
      
      alert("Profile updated successfully!");
      
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      setError("Error updating the profile. " + (error.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/signup"; // Redirect after deletion
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting the account.");
    }
  };

  // Render role-specific fields
  const renderRoleSpecificFields = () => {
    switch(userData.role) {
      case "Admin":
        return (
          <>
            <SectionTitle variant="h6">Admin Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="CIN"
                  name="cin"
                  value={adminData.cin}
                  onChange={handleAdminDataChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Number"
                  name="number"
                  value={adminData.number}
                  onChange={handleAdminDataChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </>
        );
      case "Teacher":
        return (
          <>
            <SectionTitle variant="h6">Teacher Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Number"
                  name="number"
                  value={teacherData.number}
                  onChange={handleTeacherDataChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="CIN"
                  name="cin"
                  value={teacherData.cin}
                  onChange={handleTeacherDataChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={teacherData.bio}
                  onChange={handleTeacherDataChange}
                  multiline
                  rows={3}
                  variant="outlined"
                />
                <HelperText>Share your professional background and teaching philosophy</HelperText>
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="CV"
                  name="cv"
                  value={teacherData.cv}
                  onChange={handleTeacherDataChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Experience"
                  name="experience"
                  value={teacherData.experience}
                  onChange={handleTeacherDataChange}
                  multiline
                  rows={3}
                  variant="outlined"
                />
                <HelperText>List your relevant teaching and professional experience</HelperText>
              </Grid>
              {/* We're simplifying the diplomas field for now */}
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Diplomas (comma separated)"
                  name="diplomas"
                  value={teacherData.diplomas.join(", ")}
                  onChange={(e) => setTeacherData({
                    ...teacherData,
                    diplomas: e.target.value.split(",").map(d => d.trim())
                  })}
                  variant="outlined"
                />
                <HelperText>List your academic qualifications separated by commas</HelperText>
              </Grid>
            </Grid>
          </>
        );
      case "Student":
        return (
          <>
            <SectionTitle variant="h6">Student Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Identifier"
                  name="identifier"
                  value={studentData.identifier}
                  onChange={handleStudentDataChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Situation"
                  name="situation"
                  value={studentData.situation}
                  onChange={handleStudentDataChange}
                  variant="outlined"
                />
                <HelperText>Current academic situation or status</HelperText>
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Disease (if any)"
                  name="disease"
                  value={studentData.disease}
                  onChange={handleStudentDataChange}
                  variant="outlined"
                />
                <HelperText>This information will remain confidential and is used to provide appropriate accommodations</HelperText>
              </Grid>
              <Grid item xs={12}>
                <StyledFormControl>
                  <label>
                    <input
                      type="checkbox"
                      name="socialCase"
                      checked={studentData.socialCase}
                      onChange={handleStudentDataChange}
                    />
                    Social Case
                  </label>
                </StyledFormControl>
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ProfileCard elevation={10}>
        <GradientHeader>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: '700', 
              position: 'relative', 
              zIndex: 2,
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Your Profile
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)', 
              mt: 1,
              position: 'relative',
              zIndex: 2,
              fontWeight: '500',
            }}
          >
            Manage your personal information and account settings
          </Typography>
        </GradientHeader>
        
        <ContentContainer>
          {loading ? (
            <Box display="flex" justifyContent="center" padding={4} alignItems="center" minHeight="300px" flexDirection="column">
              <CircularProgress size={60} sx={{ color: '#4fa54f' }} />
              <Typography sx={{ mt: 3, color: 'text.secondary', fontWeight: '500' }}>
                Loading your profile...
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Profile Image */}
              <ProfileImageContainer>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <ProfileAvatar 
                    src={previewUrl || "/default-avatar.jpg"} 
                    alt={userData.firstName}
                    onClick={handleImageClick}
                    sx={{ cursor: 'pointer' }}
                  />
                  <EditIconButton 
                    size="medium" 
                    onClick={handleImageClick}
                    aria-label="Change profile photo"
                  >
                    <span style={{ fontSize: '20px' }}>📷</span>
                  </EditIconButton>
                  <UploadInput
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 2, 
                    color: 'text.secondary', 
                    fontStyle: 'italic',
                    backgroundColor: 'rgba(79, 165, 79, 0.08)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}
                >
                  Click on the image to change your profile photo
                </Typography>
                {imageLoading && <CircularProgress size={24} sx={{ mt: 2, color: '#4fa54f' }} />}
              </ProfileImageContainer>
              
              <SectionTitle variant="h6">Basic Information</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleBasicInfoChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleBasicInfoChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleBasicInfoChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={userData.age}
                    onChange={handleBasicInfoChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={userData.country}
                    onChange={handleBasicInfoChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={userData.role}
                    disabled
                    variant="outlined"
                    InputProps={{
                      style: { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        fontWeight: '500',
                        color: '#3d8a3d' 
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <CustomDivider />
              
              {renderRoleSpecificFields()}

              {error && (
                <ErrorMessage color="error">
                  {error}
                </ErrorMessage>
              )}

              <Grid container spacing={3} sx={{ mt: 5 }}>
                <Grid item xs={12} sm={6}>
                  <ActionButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    sx={{ 
                      backgroundColor: "#4fa54f",
                      '&:hover': {
                        backgroundColor: "#3d8a3d"
                      }
                    }}
                    disabled={loading || imageLoading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ActionButton
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                    size="large"
                    disabled={loading}
                  >
                    Delete Account
                  </ActionButton>
                </Grid>
              </Grid>
            </form>
          )}
        </ContentContainer>
      </ProfileCard>
    </Container>
  );
};

export default UserProfile;
