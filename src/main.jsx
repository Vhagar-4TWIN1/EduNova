import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./responsive.css";
// import './assets/dashboard/css/portal.css';
import ReactGA from "react-ga4";

// Initialisation de Google Analytics
ReactGA.initialize("G-2ZXG67XCYF"); // Remplacez par votre ID GA4
ReactGA.send("pageview");

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
