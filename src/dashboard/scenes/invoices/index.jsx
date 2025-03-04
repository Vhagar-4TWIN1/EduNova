import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './logs.css';

const Invoices = () => {
  //const theme = useTheme();
  //const colors = tokens(theme.palette.mode);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5; // Nombre de logs par page

  useEffect(() => {
    fetchLogs();
  }, []); // Ne pas mettre currentPage pour éviter des recharges inutiles

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant. Veuillez vous reconnecter.');

      const response = await axios.get('http://localhost:3000/api/auth/activity-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs(response.data.logs || []); // Sécuriser les données
    } catch (err) {
      console.error('Erreur lors de la récupération des logs :', err);
      setError(err.response?.data?.message || 'Erreur de récupération des logs');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <li key={index} className={`page-item ${number === currentPage ? 'active' : ''}`}>
        {number === '...' ? (
          <span className="page-link">...</span>
        ) : (
          <button className="page-link" onClick={() => paginate(number)}>
            {number}
          </button>
        )}
      </li>
    ));
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
  
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
  
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  
  return (
    <div className="logs-container">
    <div className="logs-wrapper">
      <h2>Activity logs</h2>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Chargement des logs...</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Action</th>
                  <th>IP Address</th>
                  <th>User Agent</th>
                  <th>Duration (s)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((user) => (
                    user.logs.length > 0 ? (
                      user.logs.map((log) => (
                        <tr key={log._id}>
                          <td>{user.email || 'Inconnu'}</td>
                          <td>{log.action}</td>
                          <td>{log.ipAddress}</td>
                          <td>{log.userAgent}</td>
                          <td>{formatDuration(log.duration)}</td> {/* Afficher la durée formatée */}
                          <td>{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr key={user.userId}>
                        <td colSpan="6">Aucun log trouvé pour {user.email}</td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Aucun log trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="app-pagination">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    Précédent
                  </button>
                </li>

                {renderPagination()}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  </div>

  );
};

export default Invoices;
