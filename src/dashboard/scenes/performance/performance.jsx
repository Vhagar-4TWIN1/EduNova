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
      ReactGA.event({
        category: 'Student_Performance',
        action: action,
        label: label,
        value: value
      });
    };
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/performance/performance?range=${timeRange}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPerformanceData(res.data);
        setLoading(false);
        
        // Track the dashboard view in GA
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

  // Process data for charts
  const getLessonViewsData = () => {
    const lessonMap = {};
    
    performanceData.forEach((entry) => {
      if (entry.action === "view_file") {
        if (!lessonMap[entry.lessonId]) {
          lessonMap[entry.lessonId] = {
            name: entry.lessonTitle,
            views: 0,
          };
        }
        lessonMap[entry.lessonId].views++;
      }
    });

    return Object.values(lessonMap)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const getUserActivityData = () => {
    const userMap = {};
    
    performanceData.forEach((entry) => {
      if (!userMap[entry.userId]) {
        userMap[entry.userId] = {
          name: `User ${entry.userId.slice(0, 6)}`,
          actions: 0,
        };
      }
      userMap[entry.userId].actions++;
    });

    return Object.values(userMap)
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 5);
  };

  const getActionDistributionData = () => {
    const actionMap = {};
    
    performanceData.forEach((entry) => {
      if (!actionMap[entry.action]) {
        actionMap[entry.action] = 0;
      }
      actionMap[entry.action]++;
    });

    return Object.entries(actionMap).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#111827",
        }}
      >
        Student Performance Analytics
      </h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => setTimeRange("24hours")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: timeRange === "24hours" ? "#2563eb" : "#e5e7eb",
            color: timeRange === "24hours" ? "white" : "#4b5563",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Last 24 Hours
        </button>
        <button
          onClick={() => setTimeRange("7days")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: timeRange === "7days" ? "#2563eb" : "#e5e7eb",
            color: timeRange === "7days" ? "white" : "#4b5563",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setTimeRange("30days")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: timeRange === "30days" ? "#2563eb" : "#e5e7eb",
            color: timeRange === "30days" ? "white" : "#4b5563",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Last 30 Days
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "overview" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "overview" ? "white" : "#4b5563",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("lessons")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "lessons" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "lessons" ? "white" : "#4b5563",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Lessons
        </button>
        {/* <button
          onClick={() => setActiveTab("students")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "students" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "students" ? "white" : "#4b5563",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Students
        </button> */}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      )}

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

      {!loading && !error && activeTab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            marginBottom: "2rem",
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
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Most Viewed Lessons
            </h3>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getLessonViewsData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
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
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
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
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {getActionDistributionData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && activeTab === "lessons" && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Lesson Performance
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f3f4f6",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "0.75rem" }}>Lesson Title</th>
                  <th style={{ padding: "0.75rem" }}>Views</th>
                  <th style={{ padding: "0.75rem" }}>Unique Students</th>
                  <th style={{ padding: "0.75rem" }}>Last Viewed</th>
                </tr>
              </thead>
              <tbody>
                {getLessonViewsData().map((lesson) => (
                  <tr
                    key={lesson.name}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>{lesson.name}</td>
                    <td style={{ padding: "0.75rem" }}>{lesson.views}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {performanceData
                        .filter(
                          (entry) =>
                            entry.lessonTitle === lesson.name &&
                            entry.action === "view_file"
                        )
                        .reduce((acc, entry) => {
                          if (!acc.includes(entry.userId)) {
                            acc.push(entry.userId);
                          }
                          return acc;
                        }, []).length}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(
                        Math.max(
                          ...performanceData
                            .filter(
                              (entry) =>
                                entry.lessonTitle === lesson.name &&
                                entry.action === "view_file"
                            )
                            .map((entry) => new Date(entry.timestamp))
                        )
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && activeTab === "students" && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Student Activity
          </h3>
          <div style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getUserActivityData()}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="actions" fill="#00C49F" name="Actions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;