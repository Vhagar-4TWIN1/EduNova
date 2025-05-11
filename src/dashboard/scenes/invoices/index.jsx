import { 
  Box, 
  Typography, 
  useTheme, 
  Card, 
  CardContent, 
  Chip, 
  Pagination, 
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/header";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

const ActivityLogs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allLogs, setAllLogs] = useState([]);
  const [displayLogs, setDisplayLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const logsPerPage = 10;

  // Unique users list for filter
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token. Please log in again.');

      const response = await axios.get('http://localhost:3000/api/auth/activity-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const logsData = response.data.logs || [];
      setAllLogs(logsData);
      
      // Extract unique users
      const uniqueUsers = Array.from(new Set(
        logsData.map(userLog => userLog.email || 'Unknown user')
      ));
      setUsers(['all', ...uniqueUsers]);

    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.response?.data?.message || 'Error loading activity logs');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters, search and sorting
  useEffect(() => {
    let result = [...allLogs];
    
    // Filter by user
    if (selectedUser !== 'all') {
      result = result.filter(userLog => userLog.email === selectedUser);
    }
    
    // Global search (action, IP, userAgent)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.map(userLog => ({
        ...userLog,
        logs: userLog.logs?.filter(log => 
          (log.action?.toLowerCase() || '').includes(term) ||
          (log.ipAddress?.toLowerCase() || '').includes(term) ||
          (log.userAgent?.toLowerCase() || '').includes(term)
        ) || []
      })).filter(userLog => userLog.logs.length > 0);
    }
    
    // Sort results
    result = [...result].sort((a, b) => {
      // Sort by user
      if (sortConfig.key === 'email') {
        const emailA = a.email || '';
        const emailB = b.email || '';
        return sortConfig.direction === 'asc' 
          ? emailA.localeCompare(emailB) 
          : emailB.localeCompare(emailA);
      }
      
      // Sort by last log date
      if (sortConfig.key === 'createdAt') {
        const dateA = a.logs?.length > 0 ? new Date(a.logs[0]?.createdAt) : 0;
        const dateB = b.logs?.length > 0 ? new Date(b.logs[0]?.createdAt) : 0;
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      return 0;
    });
    
    setDisplayLogs(result);
    setCurrentPage(1); // Reset pagination after filtering
  }, [allLogs, searchTerm, selectedUser, sortConfig]);

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getActionColor = (action) => {
    if (!action) return 'default';
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'success';
    if (actionLower.includes('logout')) return 'error';
    if (actionLower.includes('create')) return 'info';
    if (actionLower.includes('FORUM')) return 'warning';
    return 'primary';
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  
  // Calculate total items for pagination
  const totalLogsCount = displayLogs.reduce((sum, user) => sum + (user.logs?.length || 0), 0);
  const totalPages = Math.ceil(totalLogsCount / logsPerPage);

  // Get logs to display for current page
  const getPaginatedLogs = () => {
    let logsToDisplay = [];
    let count = 0;
    
    for (const user of displayLogs) {
      if (!user.logs) continue;
      for (const log of user.logs) {
        if (count >= indexOfFirstLog && count < indexOfLastLog) {
          logsToDisplay.push({ user, log });
        }
        count++;
        if (count >= indexOfLastLog) break;
      }
      if (count >= indexOfLastLog) break;
    }
    
    return logsToDisplay;
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box m="20px">
      <Header title="Activity Logs" subtitle="User actions history" />
      
      {/* Search and filters bar */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', md: 'row' }} 
        gap={2} 
        mb={3}
        alignItems="center"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by action, IP or browser..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: colors.primary[400],
              borderRadius: '8px',
            }
          }}
        />
        
        <Box display="flex" gap={2} width={{ xs: '100%', md: 'auto' }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="user-filter-label">User</InputLabel>
            <Select
              labelId="user-filter-label"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="User"
              sx={{
                backgroundColor: colors.primary[400],
                borderRadius: '8px',
              }}
            >
              {users.map((user, index) => (
                <MenuItem key={index} value={user}>
                  {user === 'all' ? 'All users' : user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip title="Sort by date">
            <IconButton 
              onClick={() => handleSort('createdAt')}
              sx={{ 
                backgroundColor: colors.primary[400],
                borderRadius: '8px',
              }}
            >
              <SortIcon 
                color={sortConfig.key === 'createdAt' ? 'secondary' : 'inherit'}
                sx={{ 
                  transform: sortConfig.direction === 'asc' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s'
                }}
              />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Sort by user">
            <IconButton 
              onClick={() => handleSort('email')}
              sx={{ 
                backgroundColor: colors.primary[400],
                borderRadius: '8px',
              }}
            >
              <FilterListIcon 
                color={sortConfig.key === 'email' ? 'secondary' : 'inherit'}
                sx={{ 
                  transform: sortConfig.direction === 'asc' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s'
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Box sx={{ backgroundColor: colors.redAccent[700], p: 2, mb: 3, borderRadius: 1 }}>
          <Typography color="white">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap="15px">
            {getPaginatedLogs().length > 0 ? (
              getPaginatedLogs().map(({ user, log }) => (
                <Card key={log._id} sx={{ 
                  backgroundColor: colors.primary[400],
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h5" fontWeight="600" color={colors.greenAccent[400]}>
                        {user.email || 'Unknown user'}
                      </Typography>
                      <Chip 
                        label={log.action} 
                        color={getActionColor(log.action)} 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1} mt={2}>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="body2" color={colors.grey[100]}>
                          <strong>IP Address:</strong> {log.ipAddress || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color={colors.grey[100]}>
                          • <strong>Duration:</strong> {formatDuration(log.duration)}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color={colors.grey[100]}>
                        <strong>Browser:</strong> {log.userAgent || 'N/A'}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Typography variant="caption" color={colors.grey[300]}>
                          {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { 
                            addSuffix: true
                          }) : 'N/A'}
                        </Typography>
                        <Typography variant="caption" color={colors.grey[300]}>
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent>
                  <Typography>No activity logs found with these criteria</Typography>
                </CardContent>
              </Card>
            )}
          </Box>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4} mb={4}>
              <Stack spacing={2}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  color="secondary"
                  shape="rounded"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: colors.grey[100],
                    },
                    '& .Mui-selected': {
                      backgroundColor: `${colors.greenAccent[600]} !important`,
                      color: 'white !important',
                    },
                  }}
                />
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ActivityLogs;