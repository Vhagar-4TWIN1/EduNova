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

      // Inclure l'URL de redirection dans le corps de la requête
      axios
        .post("http://localhost:3000/api/auth/linkedinAuth", {
          code,
          redirect_url: "http://localhost:5173/auth/linkedin/callback", // Remplacez par votre URL de redirection
        })
        .then((response) => {
          console.log("LinkedIn OAuth response:", response.data);
          if (response.data.token) {
            // Stocker le token dans localStorage
            localStorage.setItem("token", response.data.token);
            navigate("/registration"); // Rediriger vers la page d'inscription
          } else {
            console.error("Error: No token received from LinkedIn.");
          }
        })
        .catch((error) => {
          console.error("Error during LinkedIn OAuth process:", error);
        });
    }
  }, [navigate]);

  return <div>Loading...</div>; // Afficher un message de chargement pendant le traitement
};

export default LinkedInCallback;