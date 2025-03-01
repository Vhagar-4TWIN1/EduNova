import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import AOS from "aos";
import "aos/dist/aos.css";
import DashboardLayout from "./components/dashboard/dashboardLayout";
import Dashboard from "./components/dashboard/dashboard";


AOS.init();
import Contact from "./components/Contact";
import Message from "./components/messga";





import AddModule from "./components/module/addModule";
import Logs from "./components/logs";
import Layout from "./components/layout";
import LinkedInCallback from "./components/linkedInCallback";

import UsersBack from "./components/usersBack";
import ListModules from "./components/module/listModules";
import UserProfile from "./components/userconnectedupdate";
AOS.init();

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/addModule" element={<AddModule />} />
        <Route path="/listModules" element={<ListModules />} />

        {/* Routes protégées avec Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/update" element={<UserProfile />} />
          <Route path="/logs" element={<Logs />} />
        </Route>

        {/* Routes du tableau de bord */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
  

        <Route path="/registration" element={<Contact />} />
        <Route path="/message" element={<Message />} />
        <Route path="/users" element={<UsersBack />} />

        
      </Routes>
    </Router>
  );
}

export default App;
