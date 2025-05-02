import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHoursData, setActiveHoursData] = useState([]);
  const [abandonEvolution, setAbandonEvolution] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/analytics');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("La réponse n'est pas du JSON");
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/performance/stats/usage');
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
        console.error('Erreur chargement stats:', err);
      }
    };

    fetchStats();
    fetchData();
  }, []);

  if (loading) return <div>Chargement des données...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!data) return <div>Aucune donnée disponible</div>;

  return (
    <div className="dashboard p-4 space-y-10">
      <h2 className="text-2xl font-bold mb-6"> Tableau de bord Analytics</h2>

      <div className="charts grid gap-10">
        <div className="chart-container bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4"> Sessions et Utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.sessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sessions"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="users"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4"> Pages les plus vues</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.pages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pagePath" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pageViews" fill="#ffc658" name="Vues" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4"> Heures les plus actives</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4"> Évolution du taux d’abandon</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={abandonEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#ff6b6b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
