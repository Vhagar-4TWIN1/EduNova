import axios from 'axios';
import ReactGA from 'react-ga4';

// Initialisation de Google Analytics
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('VOTRE_ID_GA4');
}

export const trackStudentPerformance = async (eventCategory, eventAction, eventData) => {
  // Envoi à Google Analytics
  ReactGA.event({
    category: eventCategory,
    action: eventAction,
    label: eventData.lessonTitle,
    value: 1
  });

  // Envoi à votre backend
  try {
    await axios.post("/api/performance-track", {
      category: eventCategory,
      action: eventAction,
      ...eventData,
    });
  } catch (error) {
    console.error("Error tracking performance:", error);
  }
};