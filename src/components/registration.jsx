import { useEffect, useState } from "react";
import Video from "../assets/video.mp4";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CLIENT_ID = "78ugv1m0uyomhw"; // LinkedIn Client ID
const REDIRECT_URI = "http://localhost:5173/auth/linkedin/callback"; // LinkedIn redirect URI

const Registration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        country: "",
        role: "Student", // Default role
        idUser: Math.floor(100000 + Math.random() * 900000).toString(), // Generate random ID
    });

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/"); // Redirect to home if already logged in
        }
    }, [navigate]);

    // Handle LinkedIn authentication
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            console.log("Authorization code received from LinkedIn:", code);
            setLoading(true);

            axios.post("http://localhost:3000/api/auth/linkedinAuth", { code })
                .then((response) => {
                    console.log("LinkedIn OAuth response:", response.data);
                    if (response.data.token) {
                        console.log("User authenticated successfully.");
                        localStorage.setItem("token", response.data.token);

                        // Pre-fill fields with LinkedIn data
                        setUserInfo({
                            ...userInfo,
                            firstName: response.data.firstName || "",
                            lastName: response.data.lastName || "",
                            email: response.data.email || "",
                        });

                        // Optional: redirect to dashboard after authentication
                        // navigate("/"); 
                    } else {
                        setError("No token received from LinkedIn");
                    }
                })
                .catch((error) => {
                    console.error("Error during LinkedIn OAuth process:", error);
                    setError("LinkedIn authentication failed");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    // LinkedIn signup handler
    const handleLinkedInSignUp = () => {
        console.log("Redirecting to LinkedIn for authentication...");
        setLoading(true);
        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=profile%20email`;
        window.location.href = linkedInAuthUrl;
    };

    // Form input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        
        // Clear error when user types
        if (error) setError("");
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate password match
        if (userInfo.password !== userInfo.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        
        // Validate age (must be a number)
        if (isNaN(userInfo.age) || userInfo.age <= 0) {
            setError("Please enter a valid age");
            setLoading(false);
            return;
        }

        try {
            // Prepare data for API
            const signupData = {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                password: userInfo.password,
                age: Number(userInfo.age),
                country: userInfo.country,
                role: userInfo.role,
                idUser: userInfo.idUser
            };

            console.log("Signing up with data:", signupData);
            
            const response = await axios.post("http://localhost:3000/api/auth/signup", signupData);
            
            if (response.data.success) {
                console.log("Registration successful:", response.data);
                // Redirect to login page
                navigate("/");
            } else {
                setError(response.data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(
                error.response?.data?.message || 
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-main">
            <div className="login-left">
                <video autoPlay loop muted className="background-video">
                    <source src={Video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-center">
                        <h2>Create your account</h2>
                        <p>Please enter your details</p>
                        
                        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
                        
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={userInfo.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                value={userInfo.lastName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                required
                            />
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    name="password"
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    value={userInfo.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <input
                                type="number"
                                placeholder="Age"
                                name="age"
                                value={userInfo.age}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                name="country"
                                value={userInfo.country}
                                onChange={handleChange}
                                required
                            />
                            <select 
                                name="role" 
                                value={userInfo.role} 
                                onChange={handleChange}
                                required
                                style={{ 
                                    padding: "10px",
                                    marginBottom: "15px",
                                    width: "100%",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd"
                                }}
                            >
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Admin">Admin</option>
                            </select>
                            
                            <div className="login-center-buttons">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Sign Up"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLinkedInSignUp}
                                    disabled={loading}
                                >
                                    {loading ? "Redirecting..." : "Sign Up with LinkedIn"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <p className="login-bottom-p">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;
