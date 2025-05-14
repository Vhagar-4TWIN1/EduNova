import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Toggle this to true for testing a specific IP
const USE_TEST_IP = false; // ⬅️ Set to true to use TEST_IP
const TEST_IP = "103.177.132.18"; // ⬅️ Put any IP you want to test here

const SecurityGate = () => {
  const location = useLocation();

  useEffect(() => {
    const checkIP = async () => {
      try {
        // Decide which IP to use
        const ip = USE_TEST_IP
          ? TEST_IP
          : (await axios.get("https://api.ipify.org?format=json")).data.ip;

        const res = await axios.get("https://edunova-back-rqxc.onrender.com/api/ip/check-ip", {
          params: { ip },
        });

        const score = res.data.abuseConfidenceScore;

        if (score > 50) {
          console.warn("🚫 Access blocked for suspicious IP:", ip);
          document.body.innerHTML = `<h1 style="color:red; text-align:center; margin-top: 20vh;">
            🚫 Access Denied<br/><br/>Your IP (${ip}) has been flagged as malicious.
          </h1>`;
        } else {
          console.log("✅ IP passed security check:", ip);
        }
      } catch (err) {
        console.error("❌ IP Check failed:", err);
      }
    };

    checkIP();
  }, [location]);

  return null;
};

export default SecurityGate;
