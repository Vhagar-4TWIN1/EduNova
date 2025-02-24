import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Contact from "./components/Contact";
import Message from "./components/messga";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/message" element={<Message />} />
      </Routes>
    </Router>
  );
}

export default App;
