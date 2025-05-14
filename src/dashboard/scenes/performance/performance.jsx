import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactGA from "react-ga4";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("overview");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const trackGAEvent = (action, label, value = 1) => {
      ReactGA.event({ category: 'Student_Performance', action, label, value });
    };

    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://edunova-back-rqxc.onrender.com/api/performance/performance?range=${timeRange}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPerformanceData(res.data || []);
        setLoading(false);
        trackGAEvent('View_Dashboard', `Range: ${timeRange}`);
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
        setError("Failed to load performance data");
        setLoading(false);
        trackGAEvent('Error', `Fetch_Performance_Data: ${err.message}`);
      }
    };

    fetchPerformanceData();
  }, [timeRange, token, navigate]);

  const getLessonViewsData = () => {
    const lessonMap = new Map();

    performanceData.forEach((entry) => {
      if (entry.action === "view_file" && entry.lessonId && entry.userId) {
        const key = `${entry.lessonId}_${entry.lessonTitle}`;
        if (!lessonMap.has(key)) {
          lessonMap.set(key, {
            name: entry.lessonTitle || `Lesson ${entry.lessonId}`,
            views: 0,
            users: new Set(),
            userList: new Set()
          });
        }

        const lesson = lessonMap.get(key);
        lesson.views++;
        lesson.users.add(entry.userId);

        const displayName =
          typeof entry.userName === "string"
            ? entry.userName
            : typeof entry.firstName === "string" && typeof entry.lastName === "string"
            ? `${entry.firstName} ${entry.lastName}`
            : `User ${String(entry.userId).slice(0, 6)}`;

        lesson.userList.add(displayName);
      }
    });

    return Array.from(lessonMap.values())
      .map((l) => ({
        ...l,
        userCount: l.users.size,
        userList: Array.from(l.userList),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const getActionDistributionData = () => {
    const actionMap = {};
    performanceData.forEach((entry) => {
      actionMap[entry.action] = (actionMap[entry.action] || 0) + 1;
    });
    return Object.entries(actionMap).map(([name, value]) => ({ name, value }));
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#111827" }}>
        Student Performance Analytics
      </h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        {["24hours", "7days", "30days"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: timeRange === range ? "#2563eb" : "#e5e7eb",
              color: timeRange === range ? "white" : "#4b5563",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            {range === "24hours"
              ? "Last 24 Hours"
              : range === "7days"
              ? "Last 7 Days"
              : "Last 30 Days"}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>}

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && getLessonViewsData().length === 0 && (
        <div style={{ textAlign: "center", color: "#6b7280", marginTop: "2rem" }}>
          No data available for the selected time range.
        </div>
      )}

      {!loading && !error && getLessonViewsData().length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
              Top 5 Viewed Lessons
            </h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getLessonViewsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} angle={-15} textAnchor="end" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, name === "views" ? "Views" : name]} />
                  <Legend />
                  <Bar dataKey="views" fill="#2563eb" name="Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
              Action Distribution
            </h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getActionDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getActionDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
