import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import axios from "axios";

const LevelManagement = () => {
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({ name: "", description: "" });
  const [editLevel, setEditLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const levelOptions = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://edunova-back-rqxc.onrender.com/api/level");
      setLevels(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching levels");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLevel = async () => {
    try {
      const response = await axios.post("https://edunova-back-rqxc.onrender.com/api/level", newLevel);
      setLevels([...levels, response.data.data]);
      setNewLevel({ name: "", description: "" });
      setSuccess("Level created successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Error creating level");
    }
  };

  const handleUpdateLevel = async () => {
    try {
      const response = await axios.put(
        `https://edunova-back-rqxc.onrender.com/api/level/${editLevel._id}`,
        editLevel
      );
      setLevels(levels.map(l => l._id === editLevel._id ? response.data.data : l));
      setEditLevel(null);
      setSuccess("Level updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Error updating level");
    }
  };

  const handleDeleteLevel = async (id) => {
    try {
      await axios.delete(`https://edunova-back-rqxc.onrender.com/api/level/${id}`);
      setLevels(levels.filter(l => l._id !== id));
      setSuccess("Level deleted successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting level");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editLevel) {
      setEditLevel(prev => ({ ...prev, [name]: value }));
    } else {
      setNewLevel(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const green = "#198754";

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: green }}>
        Level Management
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {success}
        </Alert>
      </Snackbar>

      <Card sx={{ mb: 3, p: 2, borderColor: green, borderWidth: 1, borderStyle: "solid" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: green }}>
            {editLevel ? "Edit Level" : "Add New Level"}
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="level-name-label">Name *</InputLabel>
              <Select
                labelId="level-name-label"
                label="Name *"
                name="name"
                value={editLevel ? editLevel.name : newLevel.name}
                onChange={handleInputChange}
                required
              >
                {levelOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              name="description"
              value={editLevel ? editLevel.description : newLevel.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              size="small"
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                sx={{ backgroundColor: green, '&:hover': { backgroundColor: '#157347' } }}
                onClick={editLevel ? handleUpdateLevel : handleCreateLevel}
                disabled={loading}
              >
                {editLevel ? "Update" : "Add"}
              </Button>
              {editLevel && (
                <Button variant="outlined" onClick={() => setEditLevel(null)}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: "bold", color: green }}>
        Levels List
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : levels.length === 0 ? (
        <Typography variant="body2">No levels available.</Typography>
      ) : (
        levels.map(level => (
          <Card key={level._id} sx={{ mb: 2, p: 2, backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color={green}>
                {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {level.description || "No description"}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  sx={{ color: green, borderColor: green }}
                  onClick={() => setEditLevel(level)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "#dc3545", borderColor: "#dc3545" }}
                  onClick={() => handleDeleteLevel(level._id)}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default LevelManagement;
