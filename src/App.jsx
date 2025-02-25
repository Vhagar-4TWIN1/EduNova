import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Layout from "./components/layout";
import AOS from "aos";
import "aos/dist/aos.css";
import LinkedInCallback from "./components/linkedInCallback";
import ActivityLogs from "./components/logs";
import DashboardLayout from "./components/dashboard/dashboardLayout";
import Dashboard from "./components/dashboard/dashboard";


AOS.init();

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />

        {/* Routes with Header & Footer (Layout) */}
        {/* Routes protégées avec Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Routes du tableau de bord */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;