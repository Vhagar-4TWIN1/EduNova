import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Logs from "./components/logs";
import Layout from "./components/layout";
import AOS from 'aos';
import 'aos/dist/aos.css';
import LinkedInCallback from "./components/linkedInCallback";
import AddModule from "./components/module/addModule";
import ListModules from "./components/module/listModules";
AOS.init();
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/addModule" element={<AddModule />} />
        <Route path="/listModules" element={<ListModules />} />

        {/* Routes avec Header et Footer */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/logs" element={<Logs />} />

        </Route>
        </Routes>
    </Router>
  );
}

export default App;