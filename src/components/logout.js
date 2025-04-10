import { useNavigate } from "react-router-dom";

export const handleLogout = (navigate) => {
    localStorage.clear(); // Clear user data
    navigate("/"); // Redirect to login page
};
