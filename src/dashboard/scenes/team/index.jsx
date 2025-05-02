import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  useTheme,
  IconButton,
  Button,
  Tooltip,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { tokens } from "../../theme";
import Header from "../../components/header";

const Team = ({ searchQuery }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    country: "",
    role: "Student",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users?page=1&limit=100"
      );
      if (res.data && Array.isArray(res.data.users)) {
        const filteredUsers = res.data.users.filter(
          (user) =>
            user.role === "Teacher" ||
            user.role === "Student" ||
            user.role === "Admin"
        );
        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      const confirm = window.confirm(
        `Are you sure you want to delete ${
          selectionModel.length > 1 ? "these users" : "this user"
        }?`
      );
      if (!confirm) return;

      for (const id of selectionModel) {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
      }

      setSelectionModel([]);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  };

  const handleAddUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUserSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/signup", newUser);
      setAddUserModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleUpdateClick = (user) => {
    setEditingUser(user);
    setEditForm({ ...user });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/users/${editingUser._id}`,
        editForm
      );
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const promoteToAdmin = async (user) => {
    const confirm = window.confirm(
      "Are you sure you want to promote this user to Admin?"
    );
    if (!confirm) return;

    try {
      await axios.patch(`http://localhost:3000/api/users/${user._id}/promote`);
      fetchUsers();
    } catch (error) {
      console.error("Promote to admin failed:", error);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!editingUser) return null;

    switch (editingUser.role) {
      case "Admin":
        return (
          <>
            <TextField
              label="CIN"
              fullWidth
              name="cin"
              value={editForm.cin || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone Number"
              fullWidth
              name="number"
              value={editForm.number || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </>
        );
      case "Teacher":
        return (
          <>
            <TextField
              label="Phone Number"
              fullWidth
              name="number"
              value={editForm.number || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Bio"
              fullWidth
              name="bio"
              value={editForm.bio || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="CV"
              fullWidth
              name="cv"
              value={editForm.cv || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Experience"
              fullWidth
              name="experience"
              value={editForm.experience || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="CIN"
              fullWidth
              name="cin"
              value={editForm.cin || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </>
        );
      case "Student":
        return (
          <>
            <TextField
              label="Identifier"
              fullWidth
              name="identifier"
              value={editForm.identifier || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Situation"
              fullWidth
              name="situation"
              value={editForm.situation || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Disease"
              fullWidth
              name="disease"
              value={editForm.disease || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editForm.socialCase || false}
                  onChange={handleFormChange}
                  name="socialCase"
                />
              }
              label="Social Case"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Learning Preference</InputLabel>
              <Select
                name="learningPreference"
                value={editForm.learningPreference || "video"}
                onChange={handleFormChange}
                label="Learning Preference"
              >
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "age", headerName: "Age", type: "number", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Update User">
            <IconButton onClick={() => handleUpdateClick(params.row)}>
              <EditIcon style={{ color: colors.greenAccent[500] }} />
            </IconButton>
          </Tooltip>
          {params.row.role !== "Admin" && (
            <Tooltip title="Promote to Admin">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  promoteToAdmin(params.row);
                }}
                color="primary"
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="List of Users" />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2 }}
        onClick={() => setAddUserModalOpen(true)}
      >
        Add User
      </Button>

      {selectionModel.length > 0 && (
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{ mb: 2 }}
        >
          Delete {selectionModel.length > 1 ? "Users" : "User"}
        </Button>
      )}

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          onSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
          selectionModel={selectionModel}
        />
      </Box>

      {/* Edit User Modal */}
      <Modal open={!!editingUser} onClose={() => setEditingUser(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            Update {editingUser?.role} Profile
          </Typography>
          {["firstName", "lastName", "age", "email", "country"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              name={field}
              value={editForm[field] || ""}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          ))}
          
          {/* Role-specific fields */}
          {renderRoleSpecificFields()}
          
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              onClick={() => setEditingUser(null)}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add User Modal */}
      <Modal open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New User
          </Typography>

          {["firstName", "lastName", "age", "email", "country"].map(
            (field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                name={field}
                value={newUser[field] || ""}
                onChange={handleAddUserChange}
                sx={{ mb: 2 }}
              />
            )
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={newUser.role}
              onChange={handleAddUserChange}
              label="Role"
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={newUser.password || ""}
            onChange={handleAddUserChange}
            sx={{ mb: 2 }}
          />
          
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={handleAddUserSubmit}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;