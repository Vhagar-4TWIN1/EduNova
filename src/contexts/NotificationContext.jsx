// src/contexts/NotificationContext.jsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect
  } from "react";
  import { setupWebSocket, onMessage } from "@lib/websocket";
  import { toast } from "react-toastify";
  
  const SOUND_URL = "../assets/reminder.mp3";  // <-- make sure this file lives in your public/sounds/
  
  const NotificationContext = createContext({
    notifications: [],
    markAsSeen: () => {}
  });
  
  export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
      // 1) open WS once
      const cleanupWS = setupWebSocket();
  
      // 2) listen for cron‐driven “events:ready”
      const unsub = onMessage("events:ready", (payload) => {
        const notif = {
          id:    payload.id,
          title: payload.title,
          start: payload.start,
          seen:  false
        };
  
        // push into state
        setNotifications((ns) => [notif, ...ns]);
  
        new Audio(SOUND_URL).play().catch(() => {
          /* user may have blocked autoplay */
        });
      });
  
      return () => {
        unsub();
        cleanupWS();
      };
    }, []);
  
    const markAsSeen = async (id) => {
      // optimistically mark local
      setNotifications((ns) =>
        ns.map((n) => (n.id === id ? { ...n, seen: true } : n))
      );
      try {
        await fetch(`/api/events/${id}/read`, {
          method: "PATCH",
          credentials: "include"
        });
      } catch (err) {
        console.error("Failed to mark notification as seen", err);
      }
    };
  
    return (
      <NotificationContext.Provider value={{ notifications, markAsSeen }}>
        {children}
      </NotificationContext.Provider>
    );
  }
  
  export function useNotifications() {
    return useContext(NotificationContext);
  }
  