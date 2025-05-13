import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Typography, Select, MenuItem, Button, Box
} from '@mui/material';

const riskColors = {
  '🔴 High': '#ffebee',
  '🟡 Medium': '#fff8e1',
  '🟢 Low': '#e8f5e9'
};

const Predict = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:500/predict_all')
      .then(res => {
        const formatted = res.data.map(user => {
          const risk = user.dropout_probability < 30
            ? '🟢 Low'
            : user.dropout_probability < 70
            ? '🟡 Medium'
            : '🔴 High';
          return { ...user, risk };
        });
        setUsers(formatted.sort((a, b) => b.dropout_probability - a.dropout_probability));
      })
      .catch(err => console.error(err));
  }, []);

  const filteredUsers = filter === 'All'
    ? users
    : users.filter(u => u.risk === filter);

  const handleAlert = (email) => {
    alert(`📬 Alert sent to ${email}`);
    // ⬆️ Ici tu peux remplacer par une vraie requête POST vers ton backend
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>📊 User Dropout Risk Dashboard</Typography>

      <Box mb={2}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="🔴 High">🔴 High</MenuItem>
          <MenuItem value="🟡 Medium">🟡 Medium</MenuItem>
          <MenuItem value="🟢 Low">🟢 Low</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Logins</TableCell>
              <TableCell>Lessons</TableCell>
              <TableCell>Risk %</TableCell>
              <TableCell>Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u, index) => (
              <TableRow key={index} style={{ backgroundColor: riskColors[u.risk] }}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{new Date(u.last_activity).toLocaleDateString()}</TableCell>
                <TableCell>{u.total_actions}</TableCell>
                <TableCell>{Math.round(u.total_duration / 60)} min</TableCell>
                <TableCell>{u.nb_login}</TableCell>
                <TableCell>{u.nb_lesson}</TableCell>
                <TableCell><strong>{u.dropout_probability}%</strong></TableCell>
                <TableCell>{u.risk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Predict;