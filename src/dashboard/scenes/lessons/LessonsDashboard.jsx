import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Modal,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LessonsDashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(res.data || []);
    } catch (error) {
      console.error("\u274C Failed to fetch lessons:", error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${selectionModel.length > 1 ? "these lessons" : "this lesson"}?`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");

    for (const id of selectionModel) {
      try {
        await axios.delete(`http://localhost:3000/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(`\u274C Failed to delete lesson ${id}:`, error);
      }
    }

    setSelectionModel([]);
    fetchLessons();
  };

  const handleUpdateClick = (lesson) => {
    setEditingLesson(lesson);
    setEditForm({ ...lesson });
  };

  const handleFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/lessons/${editingLesson._id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingLesson(null);
      fetchLessons();
    } catch (error) {
      console.error("\u274C Update failed:", error);
    }
  };

  const downloadTTS = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/lessons/${id}/tts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
  
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${id}_tts.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading TTS:", err);
      alert("Failed to download TTS");
    }
  };
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "content", headerName: "Content", flex: 1 },
    { field: "typeLesson", headerName: "Type", flex: 0.5 },
    { field: "fileUrl", headerName: "File URL", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleUpdateClick(params.row)}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download TTS">
            <IconButton onClick={() => downloadTTS(params.row._id)}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Details">
            <IconButton onClick={() => navigate(`/dashboard/lesson/${params.row._id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="LESSONS" subtitle="Manage all your lessons and lectures" />

      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/create-lesson")}
        >
          Create New Lesson
        </Button>

        {selectionModel.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete {selectionModel.length > 1 ? "Lessons" : "Lesson"}
          </Button>
        )}
      </Stack>

      <Box height="70vh">
        <DataGrid
          rows={lessons}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectionModel(ids)}
          selectionModel={selectionModel}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
      </Box>

      <Modal open={!!editingLesson} onClose={() => setEditingLesson(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" mb={3}>Edit Lesson</Typography>
          <Stack spacing={2}>
            {["title", "content", "typeLesson"].map((field) => (
              <TextField
                key={field}
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={editForm[field] || ""}
                onChange={handleFormChange}
                fullWidth
              />
            ))}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Box textAlign="right">
            <Button onClick={() => setEditingLesson(null)} sx={{ mr: 2 }}>Cancel</Button>
            <Button variant="contained" onClick={handleFormSubmit}>Save Changes</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default LessonsDashboard;
