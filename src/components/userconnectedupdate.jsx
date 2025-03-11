import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
  Snackbar,
  Alert,
  Slide,
  Grow,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { Slider } from "@mui/material";

// Styled components for image upload
const ProfileImageContainer = styled(motion.div)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(5),
  position: "relative",
  marginTop: "-85px",
  zIndex: 10,
}));

const ProfileAvatar = styled(motion(Avatar))(({ theme }) => ({
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
    borderRadius: "12px",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(249, 250, 251, 0.8)",
    "&:hover": {
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
      backgroundColor: "rgba(249, 250, 251, 1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 5px 15px rgba(79, 165, 79, 0.2)",
      backgroundColor: "white",
      "& fieldset": {
        borderColor: "#4fa54f",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4fa54f",
  },
  "& .MuiInputLabel-root": {
    fontWeight: "500",
    "&.Mui-focused": {
      color: "#3d8a3d",
    },
  },
  "& .MuiInputBase-input": {
    padding: "16px 14px",
    fontSize: "0.95rem",
  },
  marginBottom: "8px",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  paddingBottom: "15px",
  marginBottom: "24px",
  fontWeight: "700",
  color: "#333",
  fontSize: "1.25rem",
  letterSpacing: "0.5px",
  display: "flex",
  alignItems: "center",
  "&:before": {
    content: '""',
    display: "inline-block",
    width: "12px",
    height: "12px",
    backgroundColor: "#4fa54f",
    borderRadius: "50%",
    marginRight: "10px",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    left: "0",
    bottom: "0",
    height: "3px",
    width: "60px",
    backgroundColor: "#4fa54f",
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
  padding: "16px",
  backgroundColor: "rgba(79, 165, 79, 0.05)",
  borderRadius: "12px",
  border: "1px solid rgba(79, 165, 79, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(79, 165, 79, 0.08)",
    border: "1px solid rgba(79, 165, 79, 0.2)",
    boxShadow: "0 3px 10px rgba(79, 165, 79, 0.1)",
  },
  "& label": {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    fontWeight: "500",
    fontSize: "1rem",
    "& input": {
      marginRight: "12px",
      width: "20px",
      height: "20px",
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

// Add a success animation component
const SuccessAnimation = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9999,
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
  "&.show": {
    opacity: 1,
    pointerEvents: "auto",
  },
}));

const SuccessContent = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "40px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  maxWidth: "400px",
  width: "90%",
  transform: "scale(0.8)",
  transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "& svg": {
    width: "80px",
    height: "80px",
    color: "#4fa54f",
    marginBottom: "20px",
  },
  "&.show": {
    transform: "scale(1)",
  },
}));

// Add a new component for form sections
const FormSection = styled(Box)(({ theme }) => ({
  padding: "24px",
  backgroundColor: "rgba(249, 250, 251, 0.5)",
  borderRadius: "16px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
  marginBottom: "32px",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    backgroundColor: "rgba(249, 250, 251, 0.8)",
  },
}));

// Add a styled component for the camera options
const CameraOptionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "16px",
  width: "100%",
  maxWidth: "300px",
}));

const CameraOptionButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "12px 16px",
  fontWeight: "600",
  textTransform: "none",
  fontSize: "0.95rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: "white",
  color: "#333",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(79, 165, 79, 0.08)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    transform: "translateY(-2px)",
  },
  "& .icon": {
    fontSize: "1.5rem",
    marginRight: "12px",
    color: "#4fa54f",
  },
}));

const VideoPreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto 24px',
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
  aspectRatio: '4/3',
  backgroundColor: '#000',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40px',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
    zIndex: 2,
    pointerEvents: 'none',
  }
}));

const CaptureButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#4fa54f',
  color: 'white',
  width: '70px',
  height: '70px',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.2s ease',
  zIndex: 10,
  '&:hover': {
    backgroundColor: '#3d8a3d',
    transform: 'translateX(-50%) scale(1.1)',
  },
  '&:active': {
    transform: 'translateX(-50%) scale(0.95)',
  }
}));

const CameraControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  marginTop: '16px',
}));

const CameraFeedback = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  fontSize: '24px',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  pointerEvents: 'none',
  zIndex: 20,
  '&.visible': {
    opacity: 1,
  }
}));

const CameraInstructions = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '16px',
  left: 0,
  right: 0,
  textAlign: 'center',
  color: 'white',
  fontSize: '14px',
  fontWeight: '500',
  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  zIndex: 5,
  padding: '0 16px',
}));

// Add new styled components for filters and controls
const FilterControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '16px',
  padding: '0 16px',
}));

const FilterOption = styled(Box)(({ theme, selected }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  border: selected ? '3px solid #4fa54f' : '3px solid transparent',
  transition: 'all 0.2s ease',
  boxShadow: selected ? '0 0 15px rgba(79, 165, 79, 0.6)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  position: 'relative',
}));

const FilterPreview = styled('div')(({ filter }) => ({
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: filter,
}));

const FilterLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: '-20px',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: '10px',
  fontWeight: '500',
  color: '#555',
}));

const AdjustmentSlider = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '8px 16px',
  marginTop: '8px',
  '& .MuiSlider-root': {
    color: '#4fa54f',
  },
  '& .MuiSlider-thumb': {
    width: '16px',
    height: '16px',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(79, 165, 79, 0.16)',
    },
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#4fa54f',
  },
}));

const FrameOption = styled(Box)(({ theme, selected }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  border: selected ? '3px solid #4fa54f' : '3px solid transparent',
  transition: 'all 0.2s ease',
  boxShadow: selected ? '0 0 15px rgba(79, 165, 79, 0.6)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f0f0',
}));

// Add a new component for live frame previews
const LiveFramePreview = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
}));

// Update the frame preview component
const FramePreviewImage = styled('div')(({ frame }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundImage: frame ? `url(${frame})` : 'none',
  zIndex: 2,
}));

// Add a background image component for frame previews
const FramePreviewBackground = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 1,
});

const FrameOverlay = styled('div')(({ frame }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundImage: frame ? `url(${frame})` : 'none',
  zIndex: 15,
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  marginBottom: '16px',
}));

const Tab = styled(Button)(({ theme, active }) => ({
  flex: 1,
  padding: '12px',
  borderBottom: active ? '3px solid #4fa54f' : '3px solid transparent',
  borderRadius: 0,
  color: active ? '#4fa54f' : '#555',
  fontWeight: active ? '600' : '400',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(79, 165, 79, 0.05)',
  },
}));

const ZoomControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '8px',
}));

const ZoomButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  color: '#333',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

// Add a new styled component for real-time filter preview
const VideoWithFilters = styled('video')(({ 
  filter, 
  brightness, 
  contrast, 
  transform,
  objectFit
}) => ({
  width: '100%',
  height: '100%',
  objectFit: objectFit || 'cover',
  transform: transform || 'none',
  filter: `${filter || ''} brightness(${brightness}%) contrast(${contrast}%)`,
  transition: 'transform 0.3s ease, filter 0.3s ease',
}));

const LiveFilterPreview = styled('div')(({ filter }) => ({
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: filter,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  }
}));

const ActiveFilterIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#4fa54f',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  zIndex: 2,
}));

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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [captureEffect, setCaptureEffect] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState("user"); // "user" for front camera, "environment" for back camera
  
  // Add new state variables for filters and adjustments
  const [activeFilter, setActiveFilter] = useState('none');
  const [activeFrame, setActiveFrame] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('filters');
  
  // Define available filters
  const filters = [
    { id: 'none', name: 'Normal', filter: '' },
    { id: 'grayscale', name: 'B&W', filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
    { id: 'warm', name: 'Warm', filter: 'sepia(50%) saturate(1.5) hue-rotate(-10deg)' },
    { id: 'cool', name: 'Cool', filter: 'saturate(1.5) hue-rotate(15deg)' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(30%) contrast(110%) brightness(110%) saturate(85%)' },
  ];
  
  // Define available frames
  const frames = [
    { id: 'none', name: 'None', src: null },
    { id: 'circle', name: 'Circle', src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyMCIvPjwvc3ZnPg==' },
    { id: 'square', name: 'Square', src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI0MjAiIGhlaWdodD0iNDIwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIwIiByeD0iMjAiIHJ5PSIyMCIvPjwvc3ZnPg==' },
    { id: 'heart', name: 'Heart', src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjUwIDQwMCBMMTA1IDE1NUMzNSA4NSAxMDAgLTI1IDIwMCA1MCBMMjUwIDEwMCBMMzAwIDUwIEM0MDAgLTI1IDQ2NSA4NSAzOTUgMTU1IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMjAiLz48L3N2Zz4=' },
    { id: 'star', name: 'Star', src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjUwIDQwIEwzMDYgMTYwIEw0NDAgMTYwIEwzMzAgMjQwIEwzNzAgMzgwIEwyNTAgMzAwIEwxMzAgMzgwIEwxNzAgMjQwIEw2MCAxNjAgTDE5NCAxNjAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyMCIvPjwvc3ZnPg==' },
  ];
  
  // In the UserProfile component, add a state for the filter preview image
  const [filterPreviewImage, setFilterPreviewImage] = useState(null);

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

  // Function to handle camera dialog open with improved error handling
  const handleOpenCameraDialog = async () => {
    setCameraReady(false);
    setCameraError("");
    try {
      const constraints = { 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraDialogOpen(true);
      
      // Set a small delay to ensure video is ready
      setTimeout(() => {
        setCameraReady(true);
      }, 1000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = "Could not access camera. Please check permissions.";
      
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera permissions in your browser settings.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found on your device.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application.";
      }
      
      setCameraError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Function to toggle between front and back cameras
  const toggleCamera = async () => {
    // First stop the current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    // Toggle the facing mode
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
    // Restart the camera with the new facing mode
    try {
      const constraints = { 
        video: { 
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      // Set a small delay to ensure video is ready
      setTimeout(() => {
        setCameraReady(true);
      }, 1000);
    } catch (error) {
      console.error("Error switching camera:", error);
      setSnackbarMessage("Could not switch camera. Your device may only have one camera.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Function to handle camera dialog close
  const handleCloseCameraDialog = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraDialogOpen(false);
  };

  // Function to handle upload dialog open
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  // Function to handle upload dialog close
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  // Function to handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // Function to handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1));
  };

  // Enhanced function to capture image with filters and adjustments
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      // Show capture effect
      setCaptureEffect(true);
      
      // Play camera shutter sound if available
      try {
        const shutterSound = new Audio('/camera-shutter.mp3');
        shutterSound.play().catch(e => console.log('Could not play shutter sound'));
      } catch (e) {
        // Ignore if audio can't be played
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Calculate zoom and center
      const scaleFactor = zoom;
      const sx = (video.videoWidth - video.videoWidth / scaleFactor) / 2;
      const sy = (video.videoHeight - video.videoHeight / scaleFactor) / 2;
      const sWidth = video.videoWidth / scaleFactor;
      const sHeight = video.videoHeight / scaleFactor;
      
      // Draw the current video frame on the canvas with zoom
      context.drawImage(
        video, 
        sx, sy, sWidth, sHeight,
        0, 0, canvas.width, canvas.height
      );
      
      // Apply filters and adjustments
      if (activeFilter !== 'none' || brightness !== 100 || contrast !== 100) {
        // Get the image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply brightness and contrast
        const brightnessRatio = brightness / 100;
        const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        
        for (let i = 0; i < data.length; i += 4) {
          // Apply brightness
          data[i] = data[i] * brightnessRatio;
          data[i + 1] = data[i + 1] * brightnessRatio;
          data[i + 2] = data[i + 2] * brightnessRatio;
          
          // Apply contrast
          data[i] = contrastFactor * (data[i] - 128) + 128;
          data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128;
          data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128;
          
          // Apply filter effects
          if (activeFilter === 'grayscale') {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          } else if (activeFilter === 'sepia') {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          } else if (activeFilter === 'warm') {
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 0.9);
          } else if (activeFilter === 'cool') {
            data[i] = Math.min(255, data[i] * 0.9);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1);
          } else if (activeFilter === 'vintage') {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = Math.min(255, (r * 0.9) + (g * 0.1) + (b * 0.1));
            data[i + 1] = Math.min(255, (r * 0.05) + (g * 0.9) + (b * 0.05));
            data[i + 2] = Math.min(255, (r * 0.05) + (g * 0.05) + (b * 0.9));
          }
        }
        
        // Put the modified image data back on the canvas
        context.putImageData(imageData, 0, 0);
      }
      
      // Draw frame overlay if selected
      if (activeFrame && activeFrame !== 'none') {
        const frameImg = new Image();
        frameImg.src = frames.find(f => f.id === activeFrame)?.src;
        
        if (frameImg.complete) {
          context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
          finishCapture();
        } else {
          frameImg.onload = () => {
            context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
            finishCapture();
          };
          frameImg.onerror = () => {
            console.error("Error loading frame");
            finishCapture();
          };
        }
      } else {
        finishCapture();
      }
      
      function finishCapture() {
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], "camera-capture.png", { type: "image/png" });
            
            // Set the image file and preview URL
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(blob));
            
            // Reset capture effect after a short delay
            setTimeout(() => {
              setCaptureEffect(false);
              
              // Close the camera dialog after a short delay to show the effect
              setTimeout(() => {
                handleCloseCameraDialog();
                
                // Show success message
                setSnackbarMessage("Photo captured successfully!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                
                // Reset filters and adjustments
                setActiveFilter('none');
                setActiveFrame(null);
                setBrightness(100);
                setContrast(100);
                setZoom(1);
              }, 300);
            }, 300);
          }
        }, 'image/png', 0.9); // Higher quality image
      }
    }
  };

  // Effect to set up video stream when camera dialog is opened
  useEffect(() => {
    if (cameraDialogOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      
      // Add event listener to know when video is ready
      const videoElement = videoRef.current;
      videoElement.onloadeddata = () => {
        setCameraReady(true);
        // Capture a frame for filter previews after a short delay
        setTimeout(() => {
          captureFilterPreviewFrame();
        }, 500);
      };
      
      return () => {
        videoElement.onloadeddata = null;
      };
    }
  }, [cameraDialogOpen, stream]);

  const handleImageClick = () => {
    // Instead of directly opening the file input, show the options dialog
    handleOpenUploadDialog();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
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
        
        // Use the specialized admin fields endpoint
        const adminResponse = await axios.patch(
          `http://localhost:3000/api/users/${id}/admin-fields`,
          adminSpecificData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log("Admin update response:", adminResponse.data);
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
        
        // Use the specialized teacher fields endpoint
        const teacherResponse = await axios.patch(
          `http://localhost:3000/api/users/${id}/teacher-fields`,
          teacherSpecificData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log("Teacher update response:", teacherResponse.data);
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
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      
      // Show success snackbar
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      setError("Error updating the profile. " + (error.response?.data?.message || ""));
      
      // Show error snackbar
      setSnackbarMessage("Error updating profile: " + (error.response?.data?.message || "Something went wrong"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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

  // Update the renderRoleSpecificFields function to use the new FormSection component
  const renderRoleSpecificFields = () => {
    switch(userData.role) {
      case "Admin":
  return (
          <FormSection component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        🆔
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        📞
                      </Box>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </FormSection>
        );
      case "Teacher":
        return (
          <FormSection component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        📞
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        🆔
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, mt: 1, fontSize: "1.2rem" }}>
                        📝
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        📄
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, mt: 1, fontSize: "1.2rem" }}>
                        🏆
                      </Box>
                    ),
                  }}
                />
                <HelperText>List your relevant teaching and professional experience</HelperText>
              </Grid>
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        🎓
                      </Box>
                    ),
                  }}
                />
                <HelperText>List your academic qualifications separated by commas</HelperText>
              </Grid>
            </Grid>
          </FormSection>
        );
      case "Student":
        return (
          <FormSection component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        🆔
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        📊
                      </Box>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                        🏥
                      </Box>
                    ),
                  }}
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
          </FormSection>
        );
      default:
        return null;
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Add a function to capture a frame for filter previews
  const captureFilterPreviewFrame = () => {
    if (videoRef.current && cameraReady) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');
      
      // Draw the current video frame on the canvas
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 70, 70);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setFilterPreviewImage(dataUrl);
    }
  };

  // Add a useEffect hook to periodically update the filter preview image
  useEffect(() => {
    let previewInterval;
    
    if (cameraDialogOpen && cameraReady && activeTab !== 'adjustments') {
      // Capture initial preview
      captureFilterPreviewFrame();
      
      // Set up interval to refresh preview every 2 seconds
      previewInterval = setInterval(() => {
        captureFilterPreviewFrame();
      }, 2000);
    }
    
    return () => {
      if (previewInterval) {
        clearInterval(previewInterval);
      }
    };
  }, [cameraDialogOpen, cameraReady, activeTab]);

  // Also update the tab click handlers to capture a new preview when switching tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab !== 'adjustments' && cameraReady) {
      // Capture a new preview when switching to filters or frames tab
      setTimeout(() => {
        captureFilterPreviewFrame();
      }, 100);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ProfileCard elevation={10} component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GradientHeader>
          <Typography 
            variant="h4" 
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
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
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
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
              <ProfileImageContainer
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              >
                <Box sx={{ position: "relative", mb: 2 }}>
                  <ProfileAvatar 
                    src={previewUrl || "/default-avatar.jpg"} 
                    alt={userData.firstName}
                    onClick={handleImageClick}
                    sx={{ cursor: 'pointer' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <EditIconButton 
                    size="medium" 
                    onClick={handleImageClick}
                    aria-label="Change profile photo"
                    component={motion.button}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
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
                  component={motion.p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
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
                  Click on the image to update your profile photo
                </Typography>
                {imageLoading && <CircularProgress size={24} sx={{ mt: 2, color: '#4fa54f' }} />}
              </ProfileImageContainer>
              
              <FormSection component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <SectionTitle 
                  variant="h6"
                  component={motion.h2}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Basic Information
                </SectionTitle>
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
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                            👤
                          </Box>
                        ),
                      }}
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
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                            👤
                          </Box>
                        ),
                      }}
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
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                            ✉️
                          </Box>
                        ),
                      }}
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
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                            🔢
                          </Box>
                        ),
                      }}
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
                      InputProps={{
                        startAdornment: (
                          <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                            🌍
                          </Box>
                        ),
                      }}
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
                        startAdornment: (
                          <Box component="span" sx={{ color: "#4fa54f", mr: 1, fontSize: "1.2rem" }}>
                            {userData.role === "Admin" ? "👑" : userData.role === "Teacher" ? "👨‍🏫" : "👨‍🎓"}
                          </Box>
                        ),
                        style: { 
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          fontWeight: '500',
                          color: '#3d8a3d' 
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </FormSection>
              
              {renderRoleSpecificFields()}

            {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ErrorMessage color="error">
                {error}
                  </ErrorMessage>
                </motion.div>
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
                    component={motion.button}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    startIcon={loading ? null : <span style={{ fontSize: "1.2rem" }}>💾</span>}
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
                    component={motion.button}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    startIcon={<span style={{ fontSize: "1.2rem" }}>🗑️</span>}
            >
              Delete Account
                  </ActionButton>
                </Grid>
              </Grid>
          </form>
        )}
        </ContentContainer>
      </ProfileCard>
      
      {/* Success Animation */}
      <SuccessAnimation className={showSuccessAnimation ? "show" : ""}>
        <SuccessContent className={showSuccessAnimation ? "show" : ""}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Profile Updated!</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Your profile has been successfully updated.
          </Typography>
        </SuccessContent>
      </SuccessAnimation>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ 
            width: '100%', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '10px',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Camera Dialog with enhanced UI and filters */}
      <Dialog 
        open={cameraDialogOpen} 
        onClose={handleCloseCameraDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '20px',
            padding: '24px',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#333',
          mb: 2,
          position: 'relative',
        }}>
          Take a Profile Picture
          {!cameraReady && !cameraError && (
            <CircularProgress 
              size={24} 
              sx={{ 
                position: 'absolute', 
                right: 0, 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#4fa54f'
              }} 
            />
          )}
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {cameraError ? (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: 'rgba(239, 83, 80, 0.1)',
              borderRadius: '12px',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2 }}>
                Camera Error
              </Typography>
              <Typography variant="body1">
                {cameraError}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 3 }}
                onClick={handleCloseCameraDialog}
              >
                Close
              </Button>
      </Box>
          ) : (
            <>
              <VideoPreviewContainer>
                <VideoWithFilters
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  filter={filters.find(f => f.id === activeFilter)?.filter || ''}
                  brightness={brightness}
                  contrast={contrast}
                  transform={`${facingMode === "user" ? "scaleX(-1)" : "none"} scale(${zoom})`}
                />
                
                <CameraInstructions>
                  Position your face in the center and smile!
                </CameraInstructions>
                
                {/* Zoom controls */}
                <ZoomControls>
                  <ZoomButton onClick={handleZoomOut} disabled={zoom <= 1}>
                    <span style={{ fontSize: '18px' }}>➖</span>
                  </ZoomButton>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    {Math.round(zoom * 100)}%
                  </Typography>
                  <ZoomButton onClick={handleZoomIn} disabled={zoom >= 2}>
                    <span style={{ fontSize: '18px' }}>➕</span>
                  </ZoomButton>
                </ZoomControls>
                
                <CaptureButton 
                  onClick={captureImage}
                  disabled={!cameraReady}
                >
                  <span style={{ fontSize: '28px' }}>📸</span>
                </CaptureButton>
                
                <CameraFeedback className={captureEffect ? 'visible' : ''}>
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'white', 
                    opacity: 0.8 
                  }} />
                </CameraFeedback>
                
                {/* Frame overlay */}
                {activeFrame && activeFrame !== 'none' && (
                  <FrameOverlay frame={frames.find(f => f.id === activeFrame)?.src} />
                )}
              </VideoPreviewContainer>
              
              {/* Tabs for filters, frames, and adjustments */}
              <TabsContainer>
                <Tab 
                  active={activeTab === 'filters'} 
                  onClick={() => handleTabClick('filters')}
                >
                  Filters
                </Tab>
                <Tab 
                  active={activeTab === 'frames'} 
                  onClick={() => handleTabClick('frames')}
                >
                  Frames
                </Tab>
                <Tab 
                  active={activeTab === 'adjustments'} 
                  onClick={() => handleTabClick('adjustments')}
                >
                  Adjustments
                </Tab>
              </TabsContainer>
              
              {/* Filter options */}
              {activeTab === 'filters' && (
                <FilterControlsContainer>
                  {filters.map((filter) => (
                    <FilterOption 
                      key={filter.id} 
                      selected={activeFilter === filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      <LiveFilterPreview 
                        filter={filter.filter}
                        style={{
                          backgroundImage: filterPreviewImage ? `url(${filterPreviewImage})` : `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzRmYTU0ZiIvPjwvc3ZnPg==')`
                        }}
                      />
                      {activeFilter === filter.id && (
                        <ActiveFilterIndicator>
                          ✓
                        </ActiveFilterIndicator>
                      )}
                      <FilterLabel>{filter.name}</FilterLabel>
                    </FilterOption>
                  ))}
                </FilterControlsContainer>
              )}
              
              {/* Frame options */}
              {activeTab === 'frames' && (
                <FilterControlsContainer>
                  {frames.map((frame) => (
                    <FrameOption 
                      key={frame.id} 
                      selected={activeFrame === frame.id}
                      onClick={() => setActiveFrame(frame.id)}
                    >
                      <LiveFramePreview>
                        <FramePreviewBackground 
                          style={{
                            backgroundImage: filterPreviewImage ? `url(${filterPreviewImage})` : `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzRmYTU0ZiIvPjwvc3ZnPg==')`
                          }}
                        />
                        <FramePreviewImage frame={frame.src} />
                      </LiveFramePreview>
                      {activeFrame === frame.id && (
                        <ActiveFilterIndicator>
                          ✓
                        </ActiveFilterIndicator>
                      )}
                      <FilterLabel>{frame.name}</FilterLabel>
                    </FrameOption>
                  ))}
                </FilterControlsContainer>
              )}
              
              {/* Adjustment controls */}
              {activeTab === 'adjustments' && (
                <Box sx={{ padding: '0 16px' }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px' }}>☀️</span> Brightness: {brightness}%
                    </Typography>
                    <AdjustmentSlider>
                      <Slider
                        value={brightness}
                        onChange={(e, newValue) => setBrightness(newValue)}
                        min={50}
                        max={150}
                        step={5}
                        valueLabelDisplay="auto"
                      />
                    </AdjustmentSlider>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px' }}>🔆</span> Contrast: {contrast}%
                    </Typography>
                    <AdjustmentSlider>
                      <Slider
                        value={contrast}
                        onChange={(e, newValue) => setContrast(newValue)}
                        min={50}
                        max={150}
                        step={5}
                        valueLabelDisplay="auto"
                      />
                    </AdjustmentSlider>
                  </Box>
                </Box>
              )}
              
              <CameraControlsContainer>
                <Button
                  variant="contained"
                  onClick={toggleCamera}
                  disabled={!cameraReady}
                  startIcon={<span style={{ fontSize: '20px' }}>🔄</span>}
                  sx={{
                    borderRadius: '30px',
                    padding: '10px 20px',
                    backgroundColor: '#4fa54f',
                    '&:hover': {
                      backgroundColor: '#3d8a3d',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  Switch Camera
                </Button>
              </CameraControlsContainer>
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pt: 3 }}>
          <Button 
            onClick={handleCloseCameraDialog} 
            variant="outlined"
            color="primary"
            sx={{ 
              borderRadius: '30px', 
              textTransform: 'none',
              fontWeight: '600',
              padding: '10px 24px',
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Upload Options Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={handleCloseUploadDialog}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '16px',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Update Profile Picture
        </DialogTitle>
        <DialogContent>
          <CameraOptionsContainer>
            <CameraOptionButton 
              onClick={() => {
                fileInputRef.current.click();
                handleCloseUploadDialog();
              }}
            >
              <span className="icon">🖼️</span>
              Upload from device
            </CameraOptionButton>
            <CameraOptionButton 
              onClick={() => {
                handleCloseCameraDialog();
                handleOpenCameraDialog();
                handleCloseUploadDialog();
              }}
            >
              <span className="icon">📷</span>
              Take a photo
            </CameraOptionButton>
          </CameraOptionsContainer>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseUploadDialog} 
            color="primary"
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none',
              fontWeight: '600'
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
