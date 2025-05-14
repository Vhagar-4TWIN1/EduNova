import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

const formatReadableDate = (rawDate) => {
  const year = rawDate.slice(0, 4);
  const month = rawDate.slice(4, 6);
  const day = rawDate.slice(6, 8);
  return `${day}/${month}/${year}`;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHoursData, setActiveHoursData] = useState([]);
  const [abandonEvolution, setAbandonEvolution] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://edunova-back-rqxc.onrender.com/api/analytics');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contentType = response.headers.get('content-type');
        if (!contentType.includes('application/json')) {
          throw new TypeError("Response is not JSON");
        }
        const jsonData = await response.json();
        jsonData.sessions = jsonData.sessions.map(item => ({
          ...item,
          date: formatReadableDate(item.date),
        }));
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get('https://edunova-back-rqxc.onrender.com/api/performance/stats/usage');
        const { activeHours, abandonEvolution } = res.data;
        const hourMap = {};
        activeHours.forEach(item => {
          const hour = item._id.hour;
          hourMap[hour] = (hourMap[hour] || 0) + item.count;
        });
        const formattedHours = Object.entries(hourMap).map(([hour, count]) => ({
          hour: `${hour}:00`,
          count
        }));
        setActiveHoursData(formattedHours);
        setAbandonEvolution(abandonEvolution || []);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };

    fetchStats();
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-4">No data available</div>;

  const totalUsers = data.sessions.reduce((sum, d) => sum + Number(d.users), 0);
  const totalSessions = data.sessions.reduce((sum, d) => sum + Number(d.sessions), 0);
  const totalViews = data.pages.reduce((sum, d) => sum + Number(d.pageViews), 0);

  return (
    <div className="dashboard p-6 space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">📊 Analytics Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/performance'}>🎓 Student Performance</Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/invoices'}>🧾 Activity Logs</Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/predict'}>🤖 Abandon Prediction</Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/quizResult'}>📋 Quiz Results</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h4 className="text-sm text-gray-500">👥 Active Users</h4>
          <p className="text-xl font-bold">{totalUsers}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h4 className="text-sm text-gray-500">📈 Sessions</h4>
          <p className="text-xl font-bold">{totalSessions}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h4 className="text-sm text-gray-500">👁️ Page Views</h4>
          <p className="text-xl font-bold">{totalViews}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <h4 className="text-sm text-gray-500">⏱️ Abandon Rate</h4>
          <p className="text-xl font-bold">
            {abandonEvolution.length > 0 ? `${abandonEvolution.at(-1).rate.toFixed(2)}%` : "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">📆 Daily Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.sessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#8884d8" name="Sessions" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="users" stroke="#82ca9d" name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">⏰ Most Active Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">📉 Abandon Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={abandonEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#ff6b6b" strokeWidth={2} name="Abandon Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;
