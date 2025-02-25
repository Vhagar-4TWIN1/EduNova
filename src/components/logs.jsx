import { useState, useEffect } from 'react';

function ActivityLogs() {
  // Example logs data
  const logs = [
    { id: 1, date: '2025-02-20', action: 'User logged in' },
    { id: 2, date: '2025-02-21', action: 'User updated profile' },
    { id: 3, date: '2025-02-22', action: 'User logged out' },
  ];

  return (
    <div className="container">
      <h2>Activity Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <span>{log.date}:</span> {log.action}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLogs;
