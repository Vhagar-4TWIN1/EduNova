import { useState, useEffect, useContext } from "react";
import { Button, TextField, Card, CardContent, Typography, Stack, Container } from "@mui/material";
import axios from "axios";
import { ColorModeContext } from "../../theme"; // Assuming the theme context is in the same directory

const LevelManagement = () => {
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({ name: "", description: "" });
  const [editLevel, setEditLevel] = useState(null);

  const { toggleColorMode } = useContext(ColorModeContext); // Access color mode toggle

  useEffect(() => {
    axios.get("http://localhost:3000/api/level/levels")
      .then(response => {
        if (Array.isArray(response.data)) {
          console.log("Levels data:", response.data); // Log the data
          setLevels(response.data);
        } else {
          console.error("Expected an array, but got:", response.data);
        }
      })
      .catch(error => console.error("Error fetching levels", error));
  }, []);

  const handleCreateLevel = () => {
    axios.post("http://localhost:3000/api/level/levels", newLevel)
      .then(response => {
        if (response.data.newLevel) {
          setLevels([...levels, response.data.newLevel]);
          setNewLevel({ name: "", description: "" });
        }
      })
      .catch(error => console.error("Error creating level", error));
  };

  const handleUpdateLevel = () => {
    if (editLevel) {
      axios.put(`http://localhost:3000/api/level/levels/${editLevel._id}`, editLevel) // Use _id here
        .then(response => {
          const updatedLevels = levels.map(level =>
            level._id === editLevel._id ? response.data.updatedLevel : level // Use _id here
          );
          setLevels(updatedLevels);
          setEditLevel(null);
        })
        .catch(error => console.error("Error updating level", error));
    }
  };

  const handleDeleteLevel = (id) => {
    console.log("Deleting level with ID:", id); // Log the ID
    if (!id) {
      console.error("ID is undefined or null");
      return;
    }
    axios.delete(`http://localhost:3000/api/level/levels/${id}`)
      .then(() => {
        const updatedLevels = levels.filter(level => level._id !== id); // Use _id here
        setLevels(updatedLevels);
      })
      .catch(error => console.error("Error deleting level", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editLevel) {
      setEditLevel(prevState => ({ ...prevState, [name]: value }));
    } else {
      setNewLevel(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleEditClick = (level) => {
    setEditLevel({ ...level }); // Ensure the id is included when setting editLevel
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Level Management
      </Typography>

      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Add New Level</Typography>
          <Stack spacing={2}>
            <TextField label="Name" name="name" value={newLevel.name} onChange={handleInputChange} fullWidth />
            <TextField label="Description" name="description" value={newLevel.description} onChange={handleInputChange} fullWidth />
            <Button 
               variant="contained" 
               sx={{
                backgroundColor: "#3da58a",
                color: "#fff",
                "&:hover": { backgroundColor: "#2e846f" } 
              }}
                 onClick={handleCreateLevel}
            >
              Add Level
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {editLevel && (
        <Card sx={{ mb: 3, p: 2, bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Edit Level</Typography>
            <Stack spacing={2}>
              <TextField label="Name" name="name" value={editLevel.name} onChange={handleInputChange} fullWidth />
              <TextField label="Description" name="description" value={editLevel.description} onChange={handleInputChange} fullWidth />
              <Button 
  variant="contained" 
  sx={{
    backgroundColor: "#3da58a",
    color: "#fff",
    "&:hover": { backgroundColor: "#2e846f" } 
  }} 
  onClick={handleUpdateLevel}
>
  Update Level
</Button>

            </Stack>
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>Levels List</Typography>
      {Array.isArray(levels) && levels.length > 0 ? (
        levels.map(level => (
          <Card key={level._id} sx={{ mb: 2, p: 2 }}> {/* Use _id here */}
            <CardContent>
              <Typography variant="h6">{level.name}</Typography>
              <Typography variant="body2" color="text.secondary">{level.description}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" sx={{
    backgroundColor: "#3da58a",
    color: "#fff",
    "&:hover": { backgroundColor: "#2e846f" } 
  }} onClick={() => handleEditClick(level)}>Edit</Button>
                <Button variant="contained" color="error" onClick={() => handleDeleteLevel(level._id)}>Delete</Button> {/* Use _id here */}
              </Stack>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No levels available.</Typography>
      )}
    </Container>
  );
};

export default LevelManagement;