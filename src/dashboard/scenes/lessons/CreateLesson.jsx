// CreateLesson.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Typography,
  LinearProgress,
  Divider,
  Stack,
  IconButton,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Upload, Delete, Add } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";

const CreateLesson = () => {
  const theme = useTheme();

  const initialLecture = {
    title: "",
    file: null,
    fileUrl: "",
    public_id: "",
  };

  // Lesson data now includes "module"
  const [lessonData, setLessonData] = useState({
    content: "",
    typeLesson: "",
    module: "",
  });

  const [lectures, setLectures] = useState([{ ...initialLecture }]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modules, setModules] = useState([]);

  // Fetch modules from /api/module when the component mounts.
  useEffect(() => {
    const fetchModules = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3000/module", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });        // Adjust according to your API response structure:
        setModules(response.data.modules || response.data);
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData({ ...lessonData, [name]: value });
  };

  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dcf7pbfes/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edunova_preset");

    const response = await axios.post(url, formData, {
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percent);
      },
    });

    return response.data;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You are not logged in.");

    try {
      setUploading(true);

      for (const lecture of lectures) {
        const uploadResult = await uploadToCloudinary(lecture.file);

        await axios.post(
          "http://localhost:3000/api/lessons",
          {
            title: lecture.title,
            content: lessonData.content,
            typeLesson: lessonData.typeLesson,
            module: lessonData.module, // Include selected module
            fileUrl: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert("Lectures uploaded successfully ✅");
      setLectures([{ ...initialLecture }]);
      setLessonData({ content: "", typeLesson: "", module: "" });
      setUploadProgress(0);
    } catch (err) {
      console.error(
        "❌ Error creating lessons:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.error || "Error while creating lessons");
    } finally {
      setUploading(false);
    }
  };

  // Validate that every required field is filled
  const isValid =
    lessonData.content.trim() &&
    lessonData.typeLesson.trim() &&
    lessonData.module &&
    lectures.every((l) => l.title.trim() && l.file);

  const renderFilePreview = (file) => {
    const url = URL.createObjectURL(file);
    if (file.type.includes("video")) {
      return (
        <video controls src={url} width="100%" style={{ borderRadius: 8 }} />
      );
    } else if (file.type.includes("image")) {
      return (
        <img src={url} alt="preview" width="100%" style={{ borderRadius: 8 }} />
      );
    } else if (file.type.includes("audio")) {
      return <audio controls src={url} style={{ width: "100%" }} />;
    } else if (file.type.includes("pdf")) {
      return (
        <iframe
          src={url}
          title="PDF Preview"
          width="100%"
          height="400px"
          style={{ borderRadius: 8, border: "1px solid #ccc" }}
        />
      );
    }
    return <Typography variant="body2">Unsupported file type</Typography>;
  };

  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 4,
        boxShadow: theme.shadows[6],
        background: theme.palette.background.paper,
      }}
    >
      <CardHeader
        title="🎓 Create Course Curriculum"
        titleTypographyProps={{
          fontSize: 26,
          fontWeight: 700,
        }}
        sx={{ pb: 0 }}
      />

      <CardContent>
        <Stack spacing={4}>
          <TextField
            label="Lesson Content"
            name="content"
            value={lessonData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />

          {/* Module select dropdown */}
          <TextField
            select
            label="Select Module"
            name="module"
            value={lessonData.module}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          >
           {modules.length === 0 ? (
            <MenuItem disabled>Loading modules...</MenuItem>
          ) : (
            modules.map((moduleItem) => (
              <MenuItem key={moduleItem._id} value={moduleItem._id}>
                {moduleItem.title}
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
          >
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
            <MenuItem value="photo">Photo</MenuItem>
          </TextField>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {lectures.map((lecture, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              mb: 4,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[50],
            }}
          >
            <Typography fontWeight={600} variant="h6" gutterBottom>
              📘 Lecture {index + 1}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Lecture Title"
                value={lecture.title}
                onChange={(e) => {
                  const updated = [...lectures];
                  updated[index].title = e.target.value;
                  setLectures(updated);
                }}
                fullWidth
              />

              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
              >
                {lecture.file ? "Replace File" : "Upload File"}
                <input
                  type="file"
                  accept="video/*,image/*,application/pdf,audio/*"
                  hidden
                  onChange={(e) => {
                    const updated = [...lectures];
                    updated[index].file = e.target.files[0];
                    setLectures(updated);
                  }}
                />
              </Button>

              {lecture.file && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontStyle: "italic" }}
                  >
                    🎞️ Selected: {lecture.file.name}
                  </Typography>
                  {renderFilePreview(lecture.file)}
                </Box>
              )}

              <Box display="flex" justifyContent="flex-end">
                <IconButton
                  color="error"
                  onClick={() => {
                    const updated = lectures.filter((_, i) => i !== index);
                    setLectures(updated.length ? updated : [{ ...initialLecture }]);
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Stack>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setLectures([...lectures, { ...initialLecture }])}
          sx={{
            borderRadius: 2,
            borderColor: theme.palette.grey[300],
            px: 4,
            fontWeight: 500,
            color: theme.palette.primary.main,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              background: theme.palette.action.hover,
            },
          }}
        >
          Add Another Lecture
        </Button>

        {uploading && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" mt={1}>
              Uploading: {uploadProgress}%
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", p: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!isValid || uploading}
          onClick={handleSubmit}
          sx={{
            borderRadius: 3,
            px: 5,
            py: 1.2,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          🚀 Submit All Lectures
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreateLesson;
