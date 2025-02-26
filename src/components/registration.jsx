import { useEffect, useState } from "react";
import Video from "../assets/video.mp4";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const CLIENT_ID = "78ugv1m0uyomhw"; // LinkedIn Client ID
const REDIRECT_URI = "http://localhost:5173/auth/linkedin/callback";
const SITE_KEY = "your-site-key"; // Replace with your Google reCAPTCHA site key

const Registration = () => {
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleRecaptcha = (token) => {
        setRecaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recaptchaToken) {
            alert("Please complete the reCAPTCHA verification.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/auth/signup", {
                ...userInfo,
                recaptchaToken, // Send the reCAPTCHA token to the backend
            });

            console.log("Sign-up successful:", response.data);
        } catch (error) {
            console.error("Error during sign-up:", error.response?.data || error.message);
        }
    };

    return (
        <div className="login-main">
            <div className="login-left">
                <video autoPlay loop muted className="background-video">
                    <source src={Video} type="video/mp4" />
                </video>
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-center">
                        <h2>Welcome back!</h2>
                        <p>Please enter your details</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="First Name" name="firstName" value={userInfo.firstName} onChange={handleChange} />
                            <input type="text" placeholder="Last Name" name="lastName" value={userInfo.lastName} onChange={handleChange} />
                            <input type="email" placeholder="Email" name="email" value={userInfo.email} onChange={handleChange} />
                            <input type="password" placeholder="Password" name="password" value={userInfo.password} onChange={handleChange} />
                            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={userInfo.confirmPassword} onChange={handleChange} />
                            
                            {/* reCAPTCHA Component */}
                            <ReCAPTCHA sitekey={SITE_KEY} onChange={handleRecaptcha} />

                            <div className="login-center-buttons">
                                <button type="submit">Sign Up</button>
                            </div>
                        </form>
                    </div>
                    <p className="login-bottom-p">Already have an account? <a href="#">Log in</a></p>
                </div>
            </div>
        </div>
    );
};

export default Registration;
