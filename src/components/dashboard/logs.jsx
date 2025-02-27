import axios from 'axios';
import { useState, useEffect } from 'react';
import "./logs.css";
import "../../assets/dashboard/css/portal.css";

const ActivityLogs = () => {
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
      if (!token) throw new Error("Token manquant. Veuillez vous reconnecter.");

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

  // Gestion de la pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  // Changer de page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="logs-container">
      <div className="logs-wrapper">
        <h2>Activity logs</h2>

        {/* Affichage des erreurs */}
        {error && <p className="error-message">{error}</p>}

        {/* Affichage du chargement */}
        {loading ? (
          <p>Chargement des logs...</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>IP Address</th>
                    <th>User Agent</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.length > 0 ? (
                    currentLogs.map((log) => (
                      <tr key={log._id}>
                        <td>{log.action}</td>
                        <td>{log.ipAddress}</td>
                        <td>{log.userAgent}</td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Aucun log trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="app-pagination">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>Précédent</button>
                  </li>

                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>Suivant</button>
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

export default ActivityLogs;