import { BrowserRouter   as Router, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense, useEffect } from "react"; // Import lazy, Suspense, et useEffect
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./dashboard/theme";
import "./App.css";
import AOS from "aos";

import "aos/dist/aos.css";
import Layout from "./components/layout";
import PrivateRoute from "./PrivateRoute";
import FaceRecognition from "./components/FaceRecognition";
import AutoLogout from "./components/AutoLogout";
import ReactGA from "react-ga4"; // Utilisation de react-ga4 pour GA4
/*import VideoChat from "./components/VideChat.jsx";*/
import { useLocation } from "react-router-dom";
import { trackPageView } from "./GoogleAnalyticsTracker";
import ModuleDetails from "./components/module/moduleDetails.jsx";
import ListModulesBack from "./components/module/listModulesBack.jsx";
import ModuleDetailsBack from "./components/module/moduleDetailsBack.jsx";

import DyslexiaAssessmentCard from "./components/DyslexiaAssessmentCard.jsx";
import ExamPage from "./components/ExamPage.jsx";
import ChangePassword from "./components/changePassword.jsx";
import ChangePasswordBack from "./components/changePasswordBack.jsx";
import ForumMain from "./components/forum/ForumMain.jsx";
import PostDetail from "./components/forum/PostDetail.jsx";
import MusicPlayer from './components/MusicPlayer';

// Initialisation de AOS pour les animations
AOS.init();
// Chargement paresseux (lazy loading) de tous les composants
// Cela améliore les performances en chargeant les composants seulement quand nécessaire
const Login = lazy(() => import("./components/login"));
const Registration = lazy(() => import("./components/registration"));
const Home = lazy(() => import("./components/home"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const AddModule = lazy(() => import("./components/module/addModule"));
const ListModules = lazy(() => import("./components/module/listModules"));
const UserProfile = lazy(() => import("./components/userconnectedupdate"));
const Lesson = lazy(() => import("./components/Courses"));
const UsersBack = lazy(() => import("./components/usersBack"));
const Contact = lazy(() => import("./components/Contact"));
const Message = lazy(() => import("./components/messga"));
const Dashboard = lazy(() => import("./dashboard/scenes/dashboard"));
const Team = lazy(() => import("./dashboard/scenes/team"));
const Invoices = lazy(() => import("./dashboard/scenes/invoices"));
const Predict = lazy(() => import("./dashboard/scenes/invoices/predict"));
const Contacts = lazy(() => import("./dashboard/scenes/contacts"));
const Badge = lazy(() => import("./components/badges"));
const About = lazy(() => import("./components/AboutUS"));
const VideoRoom = lazy(() => import("./components/VideoRoom"));
const AddSupplementaryLesson = lazy(() => import("./components/AddSupplementaryLesson"));

const AddSupplementaryLesson = lazy(() => import("./components/AddSupplementaryLesson"));

const UpdateQuestion = lazy(() =>
  import("./dashboard/scenes/contacts/UpdateQuestion")
);
const QuestionForm = lazy(() =>
  import("./dashboard/scenes/contacts/new")
);
const Bar = lazy(() => import("./dashboard/scenes/bar"));
const Form = lazy(() => import("./dashboard/scenes/form"));
const Line = lazy(() => import("./dashboard/scenes/line"));
const Pie = lazy(() => import("./dashboard/scenes/pie"));
const FAQ = lazy(() => import("./dashboard/scenes/faq"));
const Geography = lazy(() => import("./dashboard/scenes/geography"));
const Sidebar = lazy(() => import("./dashboard/scenes/global/Sidebar"));
const Level = lazy(() => import("./dashboard/scenes/Level"));
const Performance = lazy(() => import("./dashboard/scenes/performance/performance.jsx"));
const QuizResult = lazy(() => import("./dashboard/scenes/performance/quizResult.jsx"));
const BadgeDetail = lazy(() => import("./components/BadgeDetail"));
const LessonsDashboard = lazy(() =>
  import("./dashboard/scenes/lessons/LessonsDashboard")
);
const CreateLessonBack = lazy(() =>
  import("./dashboard/scenes/lessons/CreateLesson")
);
const SelectGoogleLessons = lazy(() =>
  import("./dashboard/scenes/lessons/SelectGoogleLessons.jsx"));
const CalendarPage = lazy(() => import("./components/calendar/CalendarPage.jsx"));const Topbar = lazy(() => import("./dashboard/scenes/global/Topbar"));
const CreateLesson = lazy(() => import("./components/AddLesson"));
const LessonDetails = lazy(() =>
  import("./dashboard/scenes/lessons/LessonDetails.jsx")
);
import SecurityGate from "./components/SecurityGate";
import TeacherList from "./components/TeacherList.jsx";

const BadgeForm = lazy(() => import("./dashboard/scenes/form/badgeForm"));
const LessonDetailsFront = lazy(() => import("./components/CoursesDetails"));

const ClassicWordGame = lazy(() => import("./components/quiz/games/ClassicWordGame.jsx"));
const Quizz = lazy(() => import("./components/quiz/quiz.jsx"));
const Quiz = lazy(() => import("./components/quiz/quizPage.jsx"));
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <SecurityGate />
          <AppWithRouter
            isSidebar={isSidebar}
            setIsSidebar={setIsSidebar}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} // Passage en prop
          />
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function AppWithRouter({
  isSidebar,
  setIsSidebar,
  searchQuery,
  setSearchQuery,
}) {
  const location = useLocation();

  useEffect(() => {
    trackPageView(document.title);
  }, [location]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutoLogout />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/face" element={<FaceRecognition />} />
        <Route path="/exam" element={<ExamPage />} />
        {/* Routes protégées avec layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/forum" element={<ForumMain />} />
          <Route path="/forum/posts/:id" element={<PostDetail />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/addModule" element={<AddModule />} />
          <Route path="/listModules" element={<ListModules />} />
          <Route path="/update" element={<UserProfile />} />
          <Route path="/badges" element={<Badge />} />
          {/*<Route path="/videoChat" element={<VideoChat />} />*/}
          <Route path="/badge/:id" element={<BadgeDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calendar" element={<CalendarPage /> } />
          <Route path="/videochat" element={<VideoRoom />} /> 
          <Route path="/add-supplementary-lesson/:id" element={<AddSupplementaryLesson />} />
          <Route path="/add-supplementary-lesson/:id" element={<AddSupplementaryLesson />} />
          <Route path="/moduleDetails/:type/:id" element={<ModuleDetails />} />

          <Route path="/quizz" element={<Quizz />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/ClassicWordGame" element={<ClassicWordGame />} />

          <Route path="/message" element={<Message />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/create-lesson/:id" element={<CreateLesson />} />
          <Route path="/lesson-details" element={<LessonDetailsFront />} />
          <Route path="/dys" element={<DyslexiaAssessmentCard />} />
          <Route path="/Trainers" element={<TeacherList />} />
          <Route path="/moduleDetails/:id" element={<ModuleDetails />} />
          <Route path="/music-player" element={<MusicPlayer />} />
             <Route path="/About" element={<About />} />
        </Route>

        {/* Routes du tableau de bord */}
        <Route
          path="/dashboard/*"
          element={
            <div className="app">
              <Sidebar isSidebar={isSidebar} className="sidebar" />
              <div className="content">
                
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/update-question/:id"
                    element={<UpdateQuestion />}
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
                    path="changePassword"
                    element={
                      <PrivateRoute>
                        <ChangePasswordBack />
                      </PrivateRoute>
                    }
                  />
                  <Route path="select-google-lessons" element={<PrivateRoute><SelectGoogleLessons /></PrivateRoute>} />

                  <Route
                    path="/badgeForm"
                    element={
                      <PrivateRoute>
                        <BadgeForm />
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

                  <Route path="contacts/new" element={<QuestionForm />} />

                  <Route
                    path="/invoices"
                    element={
                      <PrivateRoute>
                        <Invoices />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/predict"
                    element={
                        <Predict />
                      
                    }
                  />

                  <Route
                    path="/performance"
                    element={
                      <PrivateRoute>
                        <Performance />
                      </PrivateRoute>
                    }
                  />

                   <Route
                    path="/quizResult"
                    element={
                      <PrivateRoute>
                        <QuizResult />
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
  );
}

export default App;