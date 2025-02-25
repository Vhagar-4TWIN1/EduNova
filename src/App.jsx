import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Logs from "./components/logs";
import Layout from "./components/layout";
import AOS from "aos";
import "aos/dist/aos.css";
import LinkedInCallback from "./components/linkedInCallback";

import DashboardLayout from "./components/dashboard/dashboardLayout";
import Dashboard from "./components/dashboard/dashboard";

// Initialize AOS (once)
AOS.init();

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />

        {/* Routes with Header & Footer (Layout) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
