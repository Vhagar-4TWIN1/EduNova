import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      sessionStorage.setItem("linkedInCode", code);
      navigate("/registration");
    }
  });
 

  return <div>Loading...</div>;
};

export default LinkedInCallback;
