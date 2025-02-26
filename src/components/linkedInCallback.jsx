import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("Authorization code received from LinkedIn:", code);

      // Send the code to the backend for token exchange
      axios
        .post("http://localhost:3000/api/auth/linkedinAuth", {
          code,
          redirect_url: "http://localhost:5173/auth/linkedin/callback", // Replace with your actual redirect URL
        })
        .then((response) => {
          console.log("LinkedIn OAuth response:", response.data);
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            navigate("/registration");
          } else {
            console.error("Error: No token received from LinkedIn.");
          }
        })
        .catch((error) => {
          console.error("Error during LinkedIn OAuth process:", error);
        });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default LinkedInCallback;
