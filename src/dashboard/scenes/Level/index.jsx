import { useState, useEffect } from "react";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";

const LevelManagement = () => {
  const [levels, setLevels] = useState([]); // Default to an empty array
  const [newLevel, setNewLevel] = useState({
    name: "",
    description: "",
  });
  const [editLevel, setEditLevel] = useState(null);

  useEffect(() => {
    // Fetch all levels on component mount
    axios.get("http://localhost:3000/api/level/levels")
      .then(response => {
        // Ensure response is an array
        if (Array.isArray(response.data)) {
          setLevels(response.data);
        } else {
          console.error("Expected an array, but got:", response.data);
        }
      })
      .catch(error => console.error("Error fetching levels", error));
  }, []);

  // Handle creating a new level
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

  // Handle editing an existing level
  const handleUpdateLevel = () => {

    if (editLevel) {

      axios.put(`http://localhost:3000/api/level/levels/${editLevel.id}`, editLevel)
        .then(response => {
          const updatedLevels = levels.map(level =>
            level.id === editLevel.id ? response.data.updatedLevel : level
          );
          setLevels(updatedLevels);
          setEditLevel(null);
        })
        .catch(error => console.error("Error updating level", error));
    }
  };

  // Handle deleting a level
  const handleDeleteLevel = (id) => {

    axios.delete(`http://localhost:3000/api/level/levels/${id}`)
      .then(() => {
        const updatedLevels = levels.filter(level => level.id !== id);
        setLevels(updatedLevels);
      })
      .catch(error => console.error("Error deleting level", error));
  };

  // Handle form changes for both create and update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editLevel) {
      setEditLevel(prevState => ({ ...prevState, [name]: value }));
    } else {
      setNewLevel(prevState => ({ ...prevState, [name]: value }));
    }
  };

  return (
    <div>
      <h1>Level Management</h1>

      {/* Add Level Form */}
      <div>
        <h2>Add New Level</h2>
        <TextField
          label="Name"
          name="name"
          value={newLevel.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={newLevel.description}
          onChange={handleInputChange}
          fullWidth
        />
        
        <Button onClick={handleCreateLevel}>Add Level</Button>
      </div>

      {/* Edit Level Form */}
      {editLevel && (
        <div>
          <h2>Edit Level</h2>
          <TextField
            label="Name"
            name="name"
            value={editLevel.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={editLevel.description}
            onChange={handleInputChange}
            fullWidth
          />
          
          <Button onClick={handleUpdateLevel}>Update Level</Button>
        </div>
      )}

      {/* Levels List */}
      <div>
        <h2>Levels List</h2>
        {/* Check if levels is an array and not empty before calling map */}
        {Array.isArray(levels) && levels.length > 0 ? (
          levels.map(level => (
            <div key={level.id}>
              <h3>{level.name}</h3>
              <p>{level.description}</p>
              <Button onClick={() => setEditLevel(level)}>Edit</Button>
              <Button onClick={() => handleDeleteLevel(level.id)}>Delete</Button>
            </div>
          ))
        ) : (
          <p>No levels available.</p>
        )}
      </div>
    </div>
  );
};

export default LevelManagement;
