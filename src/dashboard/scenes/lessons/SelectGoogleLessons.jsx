import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  Paper,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import LessonIcon from '@mui/icons-material/MenuBook';
import GoogleIcon from '@mui/icons-material/Google';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SelectGoogleLessons() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const authRes = await axios.get("/api/google/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (!authRes.data.authenticated) {
          setNeedsAuth(true);
          return;
        }
        const res = await axios.get("/api/google/lessons-temp", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setLessons(res.data);
      } catch (err) {
        console.error(err);
        setNeedsAuth(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/google/import-lessons",
        { lessonIds: selectedIds },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      navigate("/dashboard/lessons");
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  };

  const startGoogleAuth = () => {
    window.location.href = "/api/google/auth";
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <CircularProgress size={48} />
        <Typography variant="h6" mt={2} color="textSecondary">
          Vérification de l'authentification Google...
        </Typography>
      </Box>
    );
  }

  if (needsAuth) {
    return (
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 400, mx: "auto", textAlign: "center", mt: 6 }}
      >
        <Avatar sx={{ bgcolor: theme.palette.error.main, mx: "auto", mb: 2 }}>
          <GoogleIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Authentification requise
        </Typography>
        <Typography variant="body2" mb={3}>
          Connectez votre compte Google Classroom pour continuer.
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          color="error"
          onClick={startGoogleAuth}
        >
          sign in with Google
        </Button>
      </Paper>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" alignItems="center" mb={3}>
        <ImportContactsIcon sx={{ fontSize: 32, color: theme.palette.success.main, mr: 1 }} />
        <Typography variant="h4">
          Import from Google Classroom
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {lessons.length === 0 ? (
        <Typography variant="body1">Aucune leçon trouvée.</Typography>
      ) : (
        <Stack spacing={2}>
          {lessons.map((lesson) => (
            <Paper
              key={lesson._id}
              elevation={1}
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <LessonIcon
                sx={{ fontSize: 40, color: theme.palette.grey[500], mr: 2 }}
              />
              <Box flexGrow={1}>
                <Typography variant="subtitle1" noWrap>
                  {lesson.title || "Sans titre"}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {lesson.content || "Sans description"}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedIds.includes(lesson._id)}
                    onChange={() => handleToggle(lesson._id)}
                    color="success"
                  />
                }
                label=""
              />
            </Paper>
          ))}
        </Stack>
      )}

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 4 }}
        disabled={selectedIds.length === 0}
        onClick={handleImport}
      >
        Import selection ({selectedIds.length})
      </Button>
    </Box>
  );
}
