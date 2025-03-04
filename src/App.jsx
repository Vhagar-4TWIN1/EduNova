import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"; // Importez lazy et Suspense
import Layout from "./components/layout";
import AOS from "aos";
import "aos/dist/aos.css";
import DashboardLayout from "./components/dashboard/dashboardLayout";

AOS.init();

// Utilisez React.lazy pour charger les composants dynamiquement
const Login = lazy(() => import("./components/login"));
const Registration = lazy(() => import("./components/registration"));
const Home = lazy(() => import("./components/home"));
const LinkedInCallback = lazy(() => import("./components/linkedInCallback"));
const ActivityLogs = lazy(() => import("./components/logs"));
const Dashboard = lazy(() => import("./components/dashboard/dashboard"));
const Contact = lazy(() => import("./components/Contact"));
const Message = lazy(() => import("./components/messga"));

function App() {
  return (
    <Router>
      {/* Utilisez Suspense pour afficher un composant de secours pendant le chargement */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />

          {/* Routes with Header & Footer (Layout) */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Autres routes */}
          <Route path="/registration" element={<Contact />} />
          <Route path="/message" element={<Message />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;