import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react"; // Import lazy and Suspense
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./dashboard/theme";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Layout from "./components/layout";

// Initialize AOS
AOS.init();

// Lazy load all components
const Login = lazy(() => import("./components/login"));
const Registration = lazy(() => import("./components/registration"));
const Home = lazy(() => import("./components/home"));
const ForgotPassword = lazy(() => import("./components/forgotPassword"));
const AddModule = lazy(() => import("./components/module/addModule"));
const ListModules = lazy(() => import("./components/module/listModules"));
const UserProfile = lazy(() => import("./components/userconnectedupdate"));
const UsersBack = lazy(() => import("./components/usersBack"));
const Contact = lazy(() => import("./components/Contact"));
const Message = lazy(() => import("./components/messga"));
const Dashboard = lazy(() => import("./dashboard/scenes/dashboard"));
const Team = lazy(() => import("./dashboard/scenes/team"));
const Invoices = lazy(() => import("./dashboard/scenes/invoices"));
const Contacts = lazy(() => import("./dashboard/scenes/contacts"));
const Bar = lazy(() => import("./dashboard/scenes/bar"));
const Form = lazy(() => import("./dashboard/scenes/form"));
const Line = lazy(() => import("./dashboard/scenes/line"));
const Pie = lazy(() => import("./dashboard/scenes/pie"));
const FAQ = lazy(() => import("./dashboard/scenes/faq"));
const Geography = lazy(() => import("./dashboard/scenes/geography"));
const Topbar = lazy(() => import("./dashboard/scenes/global/Topbar"));
const Sidebar = lazy(() => import("./dashboard/scenes/global/Sidebar"));

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/registration" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes with Layout */}
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/addModule" element={<AddModule />} />
                <Route path="/listModules" element={<ListModules />} />
                <Route path="/update" element={<UserProfile />} />
                <Route path="/users" element={<UsersBack />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/message" element={<Message />} />
              </Route>

              {/* Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <div className="app">
                    <Sidebar isSidebar={isSidebar} className="sidebar" />
                    <div className="content">
                      <div className="main-header">
                        <Topbar setIsSidebar={setIsSidebar} />
                      </div>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/form" element={<Form />} />
                        <Route path="/bar" element={<Bar />} />
                        <Route path="/pie" element={<Pie />} />
                        <Route path="/line" element={<Line />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/geography" element={<Geography />} />
                      </Routes>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;