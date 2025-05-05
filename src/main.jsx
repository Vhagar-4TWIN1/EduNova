import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-datepicker/dist/react-datepicker.css';

import './index.css'
import './responsive.css'
// Initialize i18n (must come before any components render)
import './lib/i18n/i18n'
import ReactGA from 'react-ga4'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { NotificationProvider } from "@/contexts/NotificationContext";
// Initialisation de Google Analytics
ReactGA.initialize('G-2ZXG67XCYF') // Remplacez par votre ID GA4
ReactGA.send('pageview')
import "./responsive.css";
// import './assets/dashboard/css/portal.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
    <App />
    <ToastContainer position="top-right" />
    </NotificationProvider>

  </QueryClientProvider>
)
