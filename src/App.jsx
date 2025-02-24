import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MaterialTailwindControllerProvider } from "./context"; // Import the context provider
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Logs from "./components/logs";
import Layout from "./components/layout";
import AOS from 'aos';
import 'aos/dist/aos.css';
//import Dashboard from "./layouts/dashboard";
import LinkedInCallback from "./components/linkedInCallback";
import { Dashboard } from "@/layouts";

AOS.init();

function App() {
  return (
    // Wrap the entire app with MaterialTailwindControllerProvider
    <MaterialTailwindControllerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />

          {/* Dashboard route */}
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* Routes with Header and Footer */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/logs" element={<Logs />} />
          </Route>
        </Routes>
      </Router>
    </MaterialTailwindControllerProvider>
  );
}

export default App;
