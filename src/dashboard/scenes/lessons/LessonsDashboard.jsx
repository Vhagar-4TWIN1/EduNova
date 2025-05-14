import React, { useEffect, useState } from "react";
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
  Paper,
  LinearProgress,
  Chip,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LessonsDashboard({ searchQuery }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edunova_preset");
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dcf7pbfes/auto/upload",
      formData,
      { onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)) }
    );
    return data;
  };

  const handleDelete = async () => {
    if (!selectionModel.length) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces leçons ?")) return;
    const token = localStorage.getItem("token");
    await Promise.all(
      selectionModel.map((id) =>
        axios.delete(`/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );
    setSelectionModel([]);
    const { data } = await axios.get("/api/lessons", { headers: { Authorization: `Bearer ${token}` } });
    setLessons(data);
  };

  const handleUpdateClick = (lesson) => {
    setEditingLesson(lesson);
    setEditForm({ ...lesson });
  };

  const handleFormChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleFormSubmit = async () => {
    try {
      let uploadUrl = editForm.fileUrl;
      let public_id = editForm.public_id;
      if (editForm.file) {
        const upload = await uploadToCloudinary(editForm.file);
        uploadUrl = upload.secure_url;
        public_id = upload.public_id;
      }
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/lessons/${editingLesson._id}`,
        { ...editForm, fileUrl: uploadUrl, public_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingLesson(null);
      setUploadProgress(0);
      const { data } = await axios.get("/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadTTS = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/lessons/${id}/tts`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const ext = response.headers["content-type"].includes("audio") ? "mp3" : "txt";
      link.setAttribute("download", `${id}_tts.${ext}`);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const getRowClassName = (params) =>
    params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row';

  const columns = [
    {
      field: 'title',
      headerName: 'Titre',
      flex: 1,
      renderCell: (params) => <Typography noWrap>{params.value}</Typography>,
    },
    {
      field: 'content',
      headerName: 'Contenu',
      flex: 1,
      renderCell: (params) => (
        <Typography noWrap color="textSecondary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'typeLesson',
      headerName: 'Type',
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          size="small"
          color={params.value === 'video' ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'fileUrl',
      headerName: 'Fichier',
      flex: 0.8,
      renderCell: (params) => (
        <Button
          size="small"
          sx={{ color: theme.palette.grey[800] }}
          startIcon={<PlayArrowIcon />}
          onClick={() => window.open(params.value, '_blank')}
        >
          Open
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Modifier">
            <IconButton color="success" onClick={() => handleUpdateClick(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="TTS">
            <IconButton color="success" onClick={() => downloadTTS(params.row._id)}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voir">
            <IconButton sx={{ color: theme.palette.grey[600] }} onClick={() => navigate(`/dashboard/lesson/${params.row._id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const filteredLessons = lessons.filter((l) =>
    [l.title, l.content, l.typeLesson]
      .join(' ')
      .toLowerCase()
      .includes((searchQuery || '').toLowerCase())
  );

  return (
    <Box m={2}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <SchoolIcon sx={{ color: theme.palette.success.main, fontSize: 32, mr: 1 }} />
        <Header title="LEÇONS" subtitle="Une vue claire et stylée" />
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          color="success"
          startIcon={<SchoolIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/dashboard/create-lesson')}
        >
          New Lesson
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.grey[600],
            color: '#fff',
            '&:hover': { backgroundColor: theme.palette.grey[800] },
            borderRadius: 2,
          }}
          startIcon={<PlayArrowIcon />}
          onClick={() => navigate('/dashboard/select-google-lessons')}
        >
          Import from GoogleClassroom
        </Button>
        {selectionModel.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2 }}
            onClick={handleDelete}
          >
            Delete ({selectionModel.length})
          </Button>
        )}
      </Stack>

      {/* DataGrid */}
      <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
        <DataGrid
          rows={filteredLessons}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          selectionModel={selectionModel}
          onSelectionModelChange={(ids) => setSelectionModel(ids)}
          getRowClassName={getRowClassName}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.grey[400]} 100%)`,
              color: '#fff',
              fontSize: '1rem',
            },
            '& .even-row': { backgroundColor: theme.palette.background.paper },
            '& .odd-row': { backgroundColor: theme.palette.action.hover },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.success.light,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
            },
            '& .MuiDataGrid-cell': { borderBottom: `1px solid ${theme.palette.divider}` },
            '& .MuiChip-root': { fontWeight: 600 },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.background.default,
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          }}
        />
      </Paper>

      {/* Edit Modal */}
      <Modal open={!!editingLesson} onClose={() => setEditingLesson(null)}>
        <Paper
          elevation={4}
          sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 3, borderRadius: 2 }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <EditIcon sx={{ mr: 1, color: theme.palette.success.main }} />
            <Typography variant="h6">Update Lesson</Typography>
          </Box>
          <Stack spacing={2}>
            {['title', 'content', 'typeLesson'].map((field) => (
              <TextField
                key={field}
                name={field}
                label={field === 'title' ? 'Titre' : field === 'content' ? 'Contenu' : 'Type'}
                value={editForm[field] || ''}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            ))}
            <Button variant="outlined" color="success" component="label">
              + Fichier
              <input type="file" hidden onChange={(e) => setEditForm({ ...editForm, file: e.target.files?.[0] })} />
            </Button>
            {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
            <Divider />
            <Box textAlign="right">
              <Button color="inherit" onClick={() => setEditingLesson(null)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handleFormSubmit}>
                Save
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
}
