import axios from 'axios';
import { useState, useEffect } from 'react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token envoyé :", token);

      const response = await axios.get('http://localhost:3000/api/auth/activity-logs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });



      setLogs(response.data.logs);
    } catch (err) {
      console.error('Erreur lors de la récupération des logs :', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Activity Logs</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>IP Address</th>
            <th>User Agent</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.userId}</td>              
              <td>{log.action}</td>
              <td>{log.ipAddress}</td>
              <td>{log.userAgent}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogs;
