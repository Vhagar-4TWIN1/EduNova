import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";
import Logo from "./Logo";
import Footerpage from "./Footerpage";
import GoogleSvg from "../assets/icons8-google.svg";
import FacebookSVG from "../assets/icons8-facebook.svg";
import GithubSVG from "../assets/icons8-github.svg";
import LinkedinSvg from "../assets/icon-linkedin.svg";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
    document.body.style.boxSizing = "border-box";
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflowX = "";
      document.body.style.boxSizing = "";
    };
  }, []);

  const [formData, setFormData] = useState(() => ({
    email: localStorage.getItem("rememberedEmail") || "",
    password: localStorage.getItem("rememberedPassword") || "",
  }));

  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);

      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
      };

      const decoded = parseJwt(tokenFromUrl);
      if (!decoded || !decoded.userId) return;

      const userId = decoded.userId;
      axios.get(`http://localhost:3000/api/users/${userId}`)
        .then((userResponse) => {
          const userData = userResponse.data?.data;
          if (userData?.photo) {
            localStorage.setItem("image", `http://localhost:3000/${userData.photo}`);
            navigate("/face");
          } else {
            if (decoded.role === 'Admin') {
              navigate("/dashboard");
            } else {
              navigate("/home");
            }
          }
        })
        .catch(() => {
          navigate("/home");
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and numbers");
      setLoading(false);
      return;
    }

    const response = await axios.post("http://localhost:3000/api/auth/signin", formData, {
      headers: { "Content-Type": "application/json" },
    });

    const token = response.data.token;
    if (response.data.success && token) {
      // Stockage des données utilisateur
      localStorage.setItem("token", token);
      localStorage.setItem("rememberMe", rememberMe.toString());

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedPassword", formData.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const { user } = response.data;
      localStorage.setItem("userId", user.id);
      localStorage.setItem("firstName", user.firstName);
      localStorage.setItem("lastName", user.lastName);
      localStorage.setItem("role", user.role);

      // Intégration GA4 - Partie la plus importante
      if (typeof window.gtag !== 'undefined') {
        // Configuration de l'ID utilisateur
        window.gtag('config', 'G-2ZXG67XCYF', {
          user_id: user.id,
          page_title: 'Login Success',
          page_path: '/login'
        });

        // Envoi d'un événement de connexion
        window.gtag('event', 'login', {
          method: 'email',
          user_id: user.id,
          email_domain: formData.email.split('@')[1] // Domaine de l'email
        });

        // Événement pour le type de connexion
        window.gtag('event', 'authentication', {
          method: 'email_password',
          success: true
        });
      }

      // Redirection en fonction du rôle
      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
      };
      const decoded = parseJwt(token);

      if (!decoded || !decoded.userId) {
        alert("Invalid token.");
        return;
      }

      const userResponse = await axios.get(`http://localhost:3000/api/users/${decoded.userId}`);
      if (userResponse.data.data?.photo) {
        localStorage.setItem("image", `http://localhost:3000/${userResponse.data.data.photo}`);
        navigate("/face");
      } else {
        if (user.role === 'Admin') navigate("/dashboard");
        else navigate("/home");
      }

      startBreakTimer();
    } else {
      setError(response.data.message || "Login failed.");
    }
  } catch (err) {
    // Envoi d'un événement d'échec de connexion à GA4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'login_failure', {
        method: 'email',
        error: err.response?.data?.message || 'Unknown error'
      });
    }

    if (err.response?.status === 401) {
      setError(err.response.data?.message || "Invalid credentials.");
    } else {
      setError(err.response?.data?.message || "Server error. Try again later.");
    }
  } finally {
    setLoading(false);
  }
};

// Pour les connexions via réseaux sociaux
const trackSocialLogin = (provider) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'social_login_attempt', {
      provider: provider
    });
  }
};



  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.wav");
    audio.play();
  };

  const startBreakTimer = () => {
    setInterval(() => {
      toast.warn("⏳ Time for a break! You've been active for an hour.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      playNotificationSound();
    }, 3600000); // 1 hour in milliseconds
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handleLinkedinLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/linkedin";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/oauth";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/facebook";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
          <Logo />
        </div>

        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", justifyContent: "center", gap: "20px", marginTop: "20px", padding: "0 20px", boxSizing: "border-box" }}>
          <motion.div variants={slideIn("left", "tween", 0.7, 1)} style={{
            flex: 1,
            minWidth: "300px",
            maxWidth: "600px",
            backgroundColor: "#f2f2f2",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 4px 8px rgba(45, 161, 92, 0.1)",
            boxSizing: "border-box",
          }}>
            <h3 style={{ fontSize: "36px", marginBottom: "20px" }}>Sign In</h3>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px" }}>
              <label style={{ fontSize: "20px" }}>
                <span>Email</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </label>

              <label style={{ fontSize: "20px" }}>
                <span>Password</span>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required style={{ ...inputStyle, paddingRight: "40px" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "transparent", border: "none", position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", cursor: "pointer" }}>
                    {showPassword ? <FaEyeSlash size={16} color="#555" /> : <FaEye size={16} color="#555" />}
                  </button>
                </div>
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="checkbox" id="remember-checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <label htmlFor="remember-checkbox">Remember me</label>
              </div>

              <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p style={{ fontSize: "18px", textAlign: "center", marginTop: "32px" }}>
              Are you not already one of us? <Link to="/registration" style={{ color: "#ff6b6b" }}>Sign up</Link><br />
              <Link to="/forgot-password">Forgot Password</Link>
            </p>

            <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
              <button onClick={handleGoogleLogin} style={socialLoginButtonStyle}><img src={GoogleSvg} alt="Google" style={{ marginRight: "8px" }} /></button>
              <button onClick={handleLinkedinLogin} style={socialLoginButtonStyle}><img src={LinkedinSvg} alt="Linkedin" style={{ marginRight: "8px" }} /></button>
              <button onClick={handleGitHubLogin} style={socialLoginButtonStyle}><img src={GithubSVG} alt="GitHub" style={{ marginRight: "8px" }} /></button>
              <button onClick={handleFacebookLogin} style={socialLoginButtonStyle}><img src={FacebookSVG} alt="Facebook" style={{ marginRight: "8px" }} /></button>
            </div>
          </motion.div>

          <motion.div variants={slideIn("right", "tween", 0.2, 1)} style={{
            flex: 1,
            minWidth: "300px",
            maxWidth: "600px",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
          }}>
            <EarthCanvas />
          </motion.div>
        </div>
      </div>

      <div style={{ width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
        <Footerpage />
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