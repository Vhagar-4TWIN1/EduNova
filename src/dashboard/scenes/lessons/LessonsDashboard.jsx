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

const LessonsDashboard = ({ searchQuery }) => {
  const [lessons, setLessons] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://edunova-back-rqxc.onrender.com/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(res.data || []);
    } catch (error) {
      console.error("❌ Échec du chargement des leçons :", error);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edunova_preset");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dcf7pbfes/auto/upload`,
      formData,
      {
        onUploadProgress: (event) => {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      }
    );
    return response.data;
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr(e) de vouloir supprimer ${selectionModel.length > 1 ? "ces leçons" : "cette leçon"} ?`
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    for (const id of selectionModel) {
      try {
        await axios.delete(`https://edunova-back-rqxc.onrender.com/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(`❌ Échec de la suppression de la leçon ${id} :`, error);
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
      let uploadUrl = editForm.fileUrl;
      let public_id = editForm.public_id;

      if (editForm.file) {
        const { secure_url, public_id: pid } = await uploadToCloudinary(editForm.file);
        uploadUrl = secure_url;
        public_id = pid;
      }

      await axios.patch(
        `https://edunova-back-rqxc.onrender.com/api/lessons/${editingLesson._id}`,
        { ...editForm, fileUrl: uploadUrl, public_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingLesson(null);
      fetchLessons();
    } catch (error) {
      console.error("❌ La mise à jour a échoué :", error);
    }
  };

  const downloadTTS = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://edunova-back-rqxc.onrender.com/api/lessons/${id}/tts`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      const ext = response.headers["content-type"].includes("audio") ? "mp3" : "txt";
      link.setAttribute("download", `${id}_tts.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erreur lors du téléchargement TTS :", err);
      alert("Échec du téléchargement TTS");
    }
  };

  const columns = [
    { field: "title", headerName: "Titre", flex: 1 },
    { field: "content", headerName: "Contenu", flex: 1 },
    {
      field: "typeLesson",
      headerName: "Type",
      flex: 0.5,
      valueGetter: (params) =>
        params.row.typeLesson?.charAt(0).toUpperCase() + params.row.typeLesson?.slice(1),
    },
    {
      field: "fileUrl",
      headerName: "URL du fichier",
      flex: 1,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Modifier">
            <IconButton onClick={() => handleUpdateClick(params.row)}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Télécharger TTS">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                downloadTTS(params.row._id);
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voir les détails">
            <IconButton onClick={() => navigate(`/dashboard/lesson/${params.row._id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // Filtrer les leçons à partir de la propriété "searchQuery" du topbar.
  const filteredLessons = lessons.filter((lesson) => {
    const query = (searchQuery || "").toLowerCase();
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.content.toLowerCase().includes(query) ||
      (lesson.typeLesson && lesson.typeLesson.toLowerCase().includes(query))
    );
  });

  return (
    <Box m="20px">
      <Header
        title="LEÇONS"
        subtitle="Gérez toutes vos leçons et conférences"
      />

      {/* Boutons d'action (inchangés) */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/create-lesson")}
        >
          Créer une nouvelle leçon
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard/select-google-lessons")}
        >
          Importer depuis Google Classroom
        </Button>
        {selectionModel.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Supprimer {selectionModel.length > 1 ? "les leçons" : "la leçon"}
          </Button>
        )}
      </Stack>

      {/* Table modernisée DataGrid */}
      <Box height="70vh" sx={{ mt: 2 }}>
        <DataGrid
          rows={filteredLessons}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectionModel(ids)}
          selectionModel={selectionModel}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #e0e0e0" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#eceff1",
              borderBottom: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row": {
              transition: "background-color 0.2s ease",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#f8f9fa",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f3f5",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
            },
          }}
        />
        {lessons.length === 0 && (
          <Typography mt={2} color="textSecondary" textAlign="center">
            Aucune leçon disponible. Essayez de créer une leçon ou d'importer depuis Google Classroom.
          </Typography>
        )}
      </Box>

      {/* Modal de modification */}
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
          <Typography variant="h5" mb={3}>
            Modifier la leçon
          </Typography>
          <Stack spacing={2}>
            {["title", "content", "typeLesson"].map((field) => (
              <TextField
                key={field}
                name={field}
                label={
                  field === "title"
                    ? "Titre"
                    : field === "content"
                    ? "Contenu"
                    : "Type"
                }
                value={editForm[field] || ""}
                onChange={handleFormChange}
                fullWidth
              />
            ))}
            <Button variant="outlined" component="label">
              Télécharger un fichier
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setEditForm({ ...editForm, file: e.target.files?.[0] })
                }
              />
            </Button>
            {editForm.file?.name && (
              <Typography variant="caption">
                Sélectionné : {editForm.file.name}
              </Typography>
            )}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Box textAlign="right">
            <Button onClick={() => setEditingLesson(null)} sx={{ mr: 2 }}>
              Annuler
            </Button>
            <Button variant="contained" onClick={handleFormSubmit}>
              Enregistrer les modifications
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default LessonsDashboard;
