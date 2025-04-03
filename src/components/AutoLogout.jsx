import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { handleLogout } from "./logout"; // Import logout function
//import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AutoLogout = () => {
  const navigate = useNavigate(); // Get navigate function
  //const token = localStorage.getItem("token");

  useEffect(() => {
    //let timeout;
    /* const resetTimer = () => {
      clearTimeout(timeout);
      if (token) {
        timeout = setTimeout(() => {
          toast.warn(
            "⚠️ You've been inactive for too long. Logging you out for security reasons!",
            {
              position: "top-right",
              autoClose: 50000000, // Closes automatically after 5 seconds
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
              icon: "🔒",
            }
          );
          handleLogout(navigate); // Call logout function
        }, 10000);
      } // 1-minute inactivity timeout
    };

    // Attach event listeners
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // Start timer

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };*/
  }, [navigate]); // Only depends on navigate

  return null;
};

export default AutoLogout;
