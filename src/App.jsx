import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./dashboard/theme";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

import Login from "./components/login";
import Home from "./components/home";
import Dashboard from "./dashboard/scenes/dashboard";
import ForgotPassword from "./components/forgotPassword";
import Contact from "./components/Contact";
import AddModule from "./components/module/addModule";
import Logs from "./components/logs";
import Layout from "./components/layout";
import UsersBack from "./components/usersBack";
import ListModules from "./components/module/listModules";
import UserProfile from "./components/userconnectedupdate";

import Topbar from "./dashboard/scenes/global/Topbar";
import Sidebar from "./dashboard/scenes/global/Sidebar";
import Team from "./dashboard/scenes/team";
import Invoices from "./dashboard/scenes/invoices";
import Contacts from "./dashboard/scenes/contacts";
import Bar from "./dashboard/scenes/bar";
import Form from "./dashboard/scenes/form";
import Line from "./dashboard/scenes/line";
import Pie from "./dashboard/scenes/pie";
import FAQ from "./dashboard/scenes/faq";
import Geography from "./dashboard/scenes/geography";

AOS.init();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/registration" element={<Contact />} />
            <Route path="/users" element={<UsersBack />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/addModule" element={<AddModule />} />
              <Route path="/listModules" element={<ListModules />} />
              <Route path="/update" element={<UserProfile />} />
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
                      <Route path="/logs" element={<Invoices />} />
                      <Route path="/form" element={<Form />} />
                      <Route path="/bar" element={<Bar />} />
                      <Route path="/pie" element={<Pie />} />
                      <Route path="/line" element={<Line />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/geography" element={<Geography />} />
                      <Route path="/users" element={<UsersBack />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;