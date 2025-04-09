import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react"; // Import lazy and Suspense
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./dashboard/theme";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Layout from "./components/layout";
import PrivateRoute from "./PrivateRoute";
import FaceRecognition from "./components/FaceRecognition";
import { ToastContainer } from "react-toastify";
import AutoLogout from "./components/AutoLogout";
import ModuleDetails from "./components/module/moduleDetails.jsx";
import ListModulesBack from "./components/module/listModulesBack.jsx";
import ModuleDetailsBack from "./components/module/moduleDetailsBack.jsx";

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
const Lesson = lazy(() => import("./components/Courses"));
const LessonAdd = lazy(() => import("./components/AddLesson"));
const LessonDetailsFront = lazy(() => import("./components/CoursesDetails"));
const UsersBack = lazy(() => import("./components/usersBack"));
const Contact = lazy(() => import("./components/Contact"));
const ListModule = lazy(() => import("./components/module/listModules"));
const Message = lazy(() => import("./components/messga"));
const Dashboard = lazy(() => import("./dashboard/scenes/dashboard")); // Corrigé
const Team = lazy(() => import("./dashboard/scenes/team"));
const Invoices = lazy(() => import("./dashboard/scenes/invoices"));
const Contacts = lazy(() => import("./dashboard/scenes/contacts")); // Corrigé
const UpdateQuestion = lazy(() =>
  import("./dashboard/scenes/contacts/UpdateQuestion")
);
const Bar = lazy(() => import("./dashboard/scenes/bar"));
const Form = lazy(() => import("./dashboard/scenes/form"));
const Line = lazy(() => import("./dashboard/scenes/line"));
const Pie = lazy(() => import("./dashboard/scenes/pie"));
const FAQ = lazy(() => import("./dashboard/scenes/faq"));
const Geography = lazy(() => import("./dashboard/scenes/geography"));
const Topbar = lazy(() => import("./dashboard/scenes/global/Topbar"));
const Sidebar = lazy(() => import("./dashboard/scenes/global/Sidebar"));
const Level = lazy(() => import("./dashboard/scenes/Level"));
const LessonsDashboard = lazy(() =>
  import("./dashboard/scenes/lessons/LessonsDashboard")
);
const CreateLessonBack = lazy(() =>
  import("./dashboard/scenes/lessons/CreateLesson")
);

const CreateLesson = lazy(() => import("./components/AddLesson"));
const LessonDetails = lazy(() =>
  import("./dashboard/scenes/lessons/LessonDetails.jsx")
);

const BadgeForm = lazy(() => import("./dashboard/scenes/form/badgeForm"));
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // <-- add this line

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <AutoLogout />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/registration" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/face" element={<FaceRecognition />} />
              {/* Protected Routes with Layout */}
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/addModule" element={<AddModule />} />
                <Route path="/listModules" element={<ListModules />} />
                <Route path="/update" element={<UserProfile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/moduleDetails/:id" element={<ModuleDetails />} />
                <Route
                  path="/update-question/:id"
                  element={<UpdateQuestion />}
                />
                <Route path="/message" element={<Message />} />
                <Route path="/lesson" element={<Lesson />} />
                <Route
                  path="/create-lesson/:id"
                  element={<CreateLesson />}
                />
                <Route
                  path="/lesson-details"
                  element={<LessonDetailsFront />}
                />
              </Route>

              {/* Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <div className="app">
                    <Sidebar isSidebar={isSidebar} className="sidebar" />
                    <div className="content">
                      <div className="main-header">
                        <Topbar
                          setIsSidebar={setIsSidebar}
                          onSearchChange={setSearchQuery}
                        />
                      </div>
                      <Routes>
                        {/* PrivateRoute is applied for each dashboard route */}
                        <Route
                          path="/"
                          element={
                            <PrivateRoute>
                              <Dashboard />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/lessons"
                          element={
                            <PrivateRoute>
                              <LessonsDashboard />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="create-lesson"
                          element={
                            <PrivateRoute>
                              <CreateLessonBack />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="lesson/:id"
                          element={
                            <PrivateRoute>
                              <LessonDetails />
                            </PrivateRoute>
                          }
                        />

                        <Route
                          path="/team"
                          element={
                            <PrivateRoute>
                              <Team searchQuery={searchQuery} />
                            </PrivateRoute>
                          }
                        />

                        <Route
                          path="/contacts"
                          element={
                            <PrivateRoute>
                              <Contacts />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/invoices"
                          element={
                            <PrivateRoute>
                              <Invoices />
                            </PrivateRoute>
                          }
                        />

                        <Route
                          path="/form"
                          element={
                            <PrivateRoute>
                              <Form />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/Level"
                          element={
                            <PrivateRoute>
                              <Level />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/bar"
                          element={
                            <PrivateRoute>
                              <Bar />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/pie"
                          element={
                            <PrivateRoute>
                              <Pie />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/line"
                          element={
                            <PrivateRoute>
                              <Line />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/faq"
                          element={
                            <PrivateRoute>
                              <FAQ />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/geography"
                          element={
                            <PrivateRoute>
                              <Geography />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/users"
                          element={
                            <PrivateRoute>
                              <UsersBack />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/listModulesBack"
                          element={<ListModulesBack />}
                        />
                        <Route
                          path="/moduleDetailsBack/:id"
                          element={<ModuleDetailsBack />}
                        />
                      </Routes>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
      <ToastContainer />
    </ColorModeContext.Provider>
  );
}

export default App;
