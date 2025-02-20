import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Layout from "./components/layout";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Routes avec Header et Footer */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
        </Routes>
    </Router>
  );
}

export default App;