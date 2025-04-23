import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchData();
  }, []);

  if (loading) return <div>Chargement des données...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!data) return <div>Aucune donnée disponible</div>;

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <h2>Tableau de bord Analytics</h2>
      
      <div className="charts" style={{ display: 'grid', gap: '20px' }}>
        <div className="chart-container" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
          <h3>Sessions et Utilisateurs</h3>
          <ResponsiveContainer width="100%" height={400}>
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
        
        <div className="chart-container" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
          <h3>Pages les plus vues</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.pages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pageTitle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pageViews" fill="#ffc658" name="Vues" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;