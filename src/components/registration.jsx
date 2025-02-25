import { useEffect, useState } from "react";
import Video from "../assets/video.mp4";
import axios from "axios";

const CLIENT_ID = "78ugv1m0uyomhw"; // LinkedIn Client ID
const REDIRECT_URI = "http://localhost:5173/auth/linkedin/callback";

const Registration = () => {
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleLinkedInSignUp = () => {
        setLoading(true);
        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email`;
        window.location.href = linkedInAuthUrl;
    };

    useEffect(() => {
        const linkedInCode = sessionStorage.getItem("linkedInCode");
        if (linkedInCode) {
            axios.post("http://localhost:3000/api/auth/linkedinAuth", { code: linkedInCode, redirect_uri: REDIRECT_URI })
                .then((response) => {
                    if (response.data.token) {
                        localStorage.setItem("token", response.data.token);
                        axios.get("http://localhost:3000/api/auth/linkedinProfile", { params: { access_token: response.data.token } })
                            .then((res) => {
                                setUserInfo({
                                    firstName: res.data.given_name,
                                    lastName: res.data.family_name,
                                    email: res.data.email,
                                    password: "",
                                    confirmPassword: "",
                                });
                            })
                            .catch((err) => console.error("Error fetching profile:", err));
                    }
                })
                .catch((err) => console.error("LinkedIn OAuth error:", err))
                .finally(() => setLoading(false));
        }
    }, []);

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
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
                        <form>
                            <input type="text" placeholder="First Name" name="firstName" value={userInfo.firstName} onChange={handleChange} />
                            <input type="text" placeholder="Last Name" name="lastName" value={userInfo.lastName} onChange={handleChange} />
                            <input type="email" placeholder="Email" name="email" value={userInfo.email} onChange={handleChange} />
                            <input type="password" placeholder="Password" name="password" value={userInfo.password} onChange={handleChange} />
                            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={userInfo.confirmPassword} onChange={handleChange} />
                            <div className="login-center-buttons">
                                <button type="submit">Sign Up</button>
                                <button type="button" onClick={handleLinkedInSignUp} disabled={loading}>
                                    {loading ? "Redirecting..." : "Sign Up with LinkedIn"}
                                </button>
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
