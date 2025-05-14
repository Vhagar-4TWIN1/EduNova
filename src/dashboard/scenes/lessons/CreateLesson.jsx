import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  CardContent,
  CardActions,
  TextField,
  Typography,
  LinearProgress,
  Divider,
  Stack,
  IconButton,
  MenuItem,
  useTheme,
  Paper,
} from "@mui/material";
import {
  Upload,
  Delete,
  Add,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateLesson = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const initialLecture = { title: "", file: null };

  const [lessonData, setLessonData] = useState({
    content: "",
    typeLesson: "",
    module: "",
  });
  const [lectures, setLectures] = useState([{ ...initialLecture }]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get("http://localhost:3000/module", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModules(data.modules || data);
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dcf7pbfes/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edunova_preset");

    const res = await axios.post(url, formData, {
      onUploadProgress: (e) =>
        setUploadProgress(Math.round((e.loaded * 100) / e.total)),
    });
    return res.data;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You are not logged in.");

    try {
      setUploading(true);
      for (const lec of lectures) {
        const uploadResult = await uploadToCloudinary(lec.file);
        await axios.post(
          "http://localhost:3000/api/lessons",
          {
            title: lec.title,
            content: lessonData.content,
            typeLesson: lessonData.typeLesson,
            module: lessonData.module,
            fileUrl: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert("Lectures uploaded successfully ✅");
      setLectures([{ ...initialLecture }]);
      setLessonData({ content: "", typeLesson: "", module: "" });
      setUploadProgress(0);
    } catch (err) {
      console.error("Error creating lessons:", err);
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const isValid =
    lessonData.content.trim() &&
    lessonData.typeLesson &&
    lessonData.module &&
    lectures.every((l) => l.title.trim() && l.file);

  const renderPreview = (file) => {
    const url = URL.createObjectURL(file);
    if (file.type.includes("video"))
      return (
        <video
          controls
          src={url}
          style={{
            borderRadius: 8,
            width: "100%",
            boxShadow: theme.shadows[2],
          }}
        />
      );
    if (file.type.includes("image"))
      return (
        <img
          src={url}
          alt=""
          style={{
            borderRadius: 8,
            width: "100%",
            boxShadow: theme.shadows[2],
          }}
        />
      );
    if (file.type.includes("audio"))
      return <audio controls src={url} style={{ width: "100%" }} />;
    if (file.type.includes("pdf"))
      return (
        <iframe
          src={url}
          title="PDF"
          width="100%"
          height="300px"
          style={{
            borderRadius: 8,
            border: `1px solid ${theme.palette.divider}`,
          }}
        />
      );
    return <Typography>Unsupported file type</Typography>;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          textTransform: "none",
          color: theme.palette.success.main,
        }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Header with success gradient */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
            p: 3,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            color="common.white"
            sx={{ fontWeight: 700 }}
          >
            🎓 Create Course Curriculum
          </Typography>
        </Box>

        {/* Lesson Basics */}
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.success.dark, fontWeight: 600 }}
          >
            Lesson Details
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Lesson Content"
              name="content"
              value={lessonData.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                "& fieldset": {
                  borderColor: theme.palette.success.light,
                },
              }}
            />

            <TextField
              select
              label="Select Module"
              name="module"
              value={lessonData.module}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                "& fieldset": {
                  borderColor: theme.palette.success.light,
                },
              }}
            >
              {modules.length === 0 ? (
                <MenuItem disabled>Loading modules...</MenuItem>
              ) : (
                modules.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.title}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              select
              label="Type of Lesson"
              name="typeLesson"
              value={lessonData.typeLesson}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                "& fieldset": {
                  borderColor: theme.palette.success.light,
                },
              }}
            >
              {["video", "pdf", "audio", "photo"].map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>

        <Divider />

        {/* Lectures List */}
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: theme.palette.success.main }}
          >
            Lectures
          </Typography>
          <Stack spacing={4}>
            {lectures.map((lec, i) => (
              <Paper
                key={i}
                elevation={1}
                sx={{
                  p: 3,
                  borderLeft: `6px solid ${theme.palette.success.main}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: theme.palette.success.dark }}
                >
                  📘 Lecture {i + 1}
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Lecture Title"
                    value={lec.title}
                    onChange={(e) => {
                      const updated = [...lectures];
                      updated[i].title = e.target.value;
                      setLectures(updated);
                    }}
                    fullWidth
                    variant="outlined"
                  />

                  <Button
                    variant="contained"
                    color="success"
                    component="label"
                    startIcon={<Upload />}
                    sx={{ textTransform: "none" }}
                  >
                    {lec.file ? "Change File" : "Upload File"}
                    <input
                      type="file"
                      accept="video/*,image/*,application/pdf,audio/*"
                      hidden
                      onChange={(e) => {
                        const updated = [...lectures];
                        updated[i].file = e.target.files[0];
                        setLectures(updated);
                      }}
                    />
                  </Button>

                  {lec.file && renderPreview(lec.file)}

                  <Box textAlign="right">
                    <IconButton
                      color="error"
                      onClick={() => {
                        const filtered = lectures.filter((_, idx) => idx !== i);
                        setLectures(
                          filtered.length ? filtered : [{ ...initialLecture }]
                        );
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Box textAlign="center" mt={3}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Add />}
              onClick={() => setLectures([...lectures, { ...initialLecture }])}
              sx={{
                borderRadius: 2,
                px: 4,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  background: theme.palette.success.light,
                },
              }}
            >
              Add Another Lecture
            </Button>
          </Box>

          {uploading && (
            <Box mt={3}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  [`& .MuiLinearProgress-bar`]: {
                    backgroundColor: theme.palette.success.main,
                  },
                }}
              />
              <Typography variant="body2" mt={1}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Submit */}
        <CardActions
          sx={{
            justifyContent: "flex-end",
            background: theme.palette.grey[100],
            p: 3,
          }}
        >
          <Button
            variant="contained"
            size="large"
            disabled={!isValid || uploading}
            onClick={handleSubmit}
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.2,
              fontSize: "1rem",
              fontWeight: 600,
              backgroundColor: theme.palette.success.main,
              "&:hover": {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            🚀 Submit All Lectures
          </Button>
        </CardActions>
      </Paper>
    </Container>
  );
};

export default CreateLesson;
