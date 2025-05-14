import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroSection from './landing_home/HeroSection';
import AboutSection from '../components/landing_home/AboutSection';
import CoursesSection from '../components/landing_home/CoursesSection';
import EduNovaFAQ from '../components/landing_home/FAQ';
import MetricsSection from './landing_home/MetricsSection';
import NewsletterSection from './landing_home/NewsletterSection';
import MentorsSection from './landing_home/MentorsSection';
import VideoSection from './landing_home/VideoSection';
import { SectionWrapper } from "../hoc";

function Home() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  // ✅ Improved: Token Handling Function
  const handleTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('token', token);

      // Store payload values in localStorage
      Object.entries(payload).forEach(([key, value]) =>
        localStorage.setItem(key, value)
      );

      navigate('/home', { replace: true });
    } catch (error) {
      console.error('JWT decode error:', error);
    }
  };

  // ✅ Improved: Fetch Data Function
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get('/api/lessons', {
        headers: authHeader,
      });

      setLessons(data);
      console.log("Fetched Lessons:", data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    document.title = "Home";
    handleTokenFromURL();
    fetchData();
  }, []);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MetricsSection />
      <div style={{ maxHeight: '100vh', overflow: 'hidden' }}>
        <VideoSection />
      </div>
      <MentorsSection />
      <CoursesSection lessons={lessons} />
      <NewsletterSection />
      <EduNovaFAQ />
    </main>
  );
}

export default SectionWrapper(Home, "home");
