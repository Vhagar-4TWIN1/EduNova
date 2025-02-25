import { useEffect, useState } from "react";
import Video from "../assets/video.mp4";
import axios from "axios";

const CLIENT_ID = "78ugv1m0uyomhw"; // Remplacez par votre Client ID LinkedIn
const REDIRECT_URI = "http://localhost:5173/auth/linkedin/callback"; // Assurez-vous que cette URL est enregistrée dans le portail LinkedIn

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Fonction pour rediriger l'utilisateur vers LinkedIn OAuth
  const handleLinkedInSignUp = () => {
    console.log("Redirecting user to LinkedIn for authentication...");
    setLoading(true); // Afficher le loading
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email`;
    console.log("LinkedIn Authorization URL:", linkedInAuthUrl);
    window.location.href = linkedInAuthUrl;
  };

  useEffect(() => {
    //const urlParams = new URLSearchParams(window.location.search);
    //const linkedInCode = urlParams.get("code");
    const linkedInCode =sessionStorage.getItem("linkedInCode");
    console.log(linkedInCode)
    if (linkedInCode) {
      console.log("Authorization code received from LinkedIn:", linkedInCode);

      // Envoyer le code au back avec le redirect_uri
      axios
        .post("http://localhost:3000/api/auth/linkedinAuth", {
          code: linkedInCode,
          redirect_uri: REDIRECT_URI, // ✅ Ajouter le redirect_uri
        })
        .then((response) => {
          console.log("LinkedIn OAuth response:", response.data);

          if (response.data.token) {
            console.log("User authenticated successfully.");
            localStorage.setItem("token", response.data.token); // Stocker le JWT en localStorage

            const accessToken = response.data.token;
            console.log("Access token received:", accessToken);

            // Récupérer les infos du profil
            axios
            .get("http://localhost:3000/api/auth/linkedinProfile", {
              params: { access_token: accessToken },
            })
            .then((response) => {
              console.log("LinkedIn Profile:", response.data);
              const firstName = response.data.given_name;
              const lastName = response.data.family_name;
              const email = response.data.email;
              
              setUserInfo({
                firstName,
                lastName,
                email,
                password: "",
                confirmPassword: "",
              });
            })
            .catch((error) => {
              console.error("Error fetching user profile:", error);
            });
          } else {
            console.log("Error: No token received from LinkedIn.");
          }
        
        })
        .catch((error) => {
          console.error("Error during LinkedIn OAuth process:", error);
        })
        .finally(() => {
          setLoading(false); // Masquer le loading une fois la requête terminée
          console.log("LinkedIn OAuth process finished.");
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userInfo.password !== userInfo.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    console.log("Form submitted:", userInfo);
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
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={userInfo.confirmPassword}
                onChange={handleChange}
              />
              <div className="login-center-buttons">
                <button type="submit">Sign Up</button>
                <button
                  type="button"
                  onClick={handleLinkedInSignUp}
                  disabled={loading}
                >
                  {loading ? "Redirection..." : "Sign Up with LinkedIn"}
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            Already have an account? <a href="#">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
