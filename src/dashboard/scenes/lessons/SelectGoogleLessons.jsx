import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Button, CircularProgress, Typography, Checkbox,
  FormControlLabel, Stack, Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SelectGoogleLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = localStorage.getItem("token");

        const authRes = await axios.get("http://localhost:3000/api/google/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (!authRes.data.authenticated) {
          setNeedsAuth(true);
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:3000/api/google/lessons-temp", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setLessons(res.data);
      } catch (err) {
        console.error("Error during check/fetch:", err);
        setNeedsAuth(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  const handleToggle = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleImport = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:3000/api/google/import-lessons", {
        lessonIds: selectedIds,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("✅ Selected lessons imported!");
      navigate("/dashboard/lessons");
    } catch (err) {
      console.error("❌ Import error:", err);
      alert("Import failed");
    }
  };

  const startGoogleAuth = () => {
    window.location.href = "http://localhost:3000/api/google/auth";
  };

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h5">Checking Google Authentication...</Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (needsAuth) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h5" gutterBottom>Google Authentication Required</Typography>
        <Typography paragraph>You need to authenticate to fetch lessons.</Typography>
        <Button variant="contained" onClick={startGoogleAuth}>Connect Google Classroom</Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Select Lessons to Import from Google Classroom
      </Typography>

      {lessons.length === 0 ? (
        <Typography>No lessons found.</Typography>
      ) : (
        <Stack spacing={2}>
          {lessons.map((lesson) => (
            <Paper key={lesson._id} sx={{ p: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedIds.includes(lesson._id)}
                    onChange={() => handleToggle(lesson._id)}
                  />
                }
                label={
                  <Box>
                    <Typography fontWeight="bold">{lesson.title || "Untitled"}</Typography>
                    <Typography variant="body2">
                      {lesson.content || "No content"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Type: {lesson.typeLesson || "unknown"}
                    </Typography>
                  </Box>
                }
                
              />
            </Paper>
          ))}
        </Stack>
      )}

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        disabled={selectedIds.length === 0}
        onClick={handleImport}
      >
        Import Selected Lessons ({selectedIds.length})
      </Button>
    </Box>
  );
};

export default SelectGoogleLessons;
