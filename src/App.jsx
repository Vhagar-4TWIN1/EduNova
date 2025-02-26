import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";
import Home from "./components/home";
import Contact from "./components/Contact";
import Message from "./components/messga";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  console.log("App is rendering...");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/message" element={<Message />} />
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
