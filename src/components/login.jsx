import React, { useState  , useEffect} from "react";
import axios from "axios"; 
import Image from "../assets/backkk.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
  
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);
  
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Login button clicked");
  
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signin", {
        email,
        password,
      });
  
      console.log("Server Response:", response.data);
      alert("Login successful!");
  
      localStorage.setItem("token", response.data.token);
  
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
  
      navigate("/home");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Background" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            {error && <p className="error">{error}</p>} {/* Display error messages */}
            
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="remember-div">
  <input
    type="checkbox"
    id="remember-checkbox"
    checked={rememberMe}
    onChange={() => setRememberMe(!rememberMe)}
  />
  <label htmlFor="remember-checkbox">Remember</label>
</div>


              <div className="login-center-buttons">
                <button type="submit">Log In</button>

                <button type="button">
                  <img src={GoogleSvg} alt="Google Login" />
                  Log In with Google
                </button>
              </div>
          <br />
                <button type="button">
                  Log In with Linkedin
                </button>
            </form>
          </div>  

          <p className="login-bottom-p">
            Don't have an account? <a href="/registration">Join now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
