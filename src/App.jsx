import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Logs from "./components/logs";
import Layout from "./components/layout";
import LinkedInCallback from "./components/linkedInCallback";
import DashboardLayout from "./components/dashboard/dashboardLayout"; // Importez le DashboardLayout
import Dashboard from "./components/dashboard/dashboard";
import AOS from 'aos';
import 'aos/dist/aos.css';
import UsersBack from "./components/usersBack";
import AddModule from "./components/module/addModule";
import ListModules from "./components/module/listModules";
AOS.init();

function App() {
  return (
    <Router>
      <Routes>
       {/* Routes publiques */}
       <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        
        
        {/* Routes protégées avec Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/addModule" element={<AddModule />} />
        <Route path="/listModules" element={<ListModules />} />
          <Route path="/logs" element={<Logs />} />
        </Route>

        {/* Routes du tableau de bord */}
        <Route element={<DashboardLayout />}>
          <Route path="/users" element={<UsersBack />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>
         

      </Routes>
    </Router>
  );
}

export default App;