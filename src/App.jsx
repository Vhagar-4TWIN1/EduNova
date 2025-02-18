import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Registration from "./components/registration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        </Routes>
    </Router>
  );
}

export default App;