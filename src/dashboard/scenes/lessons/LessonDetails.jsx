import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import ImageIcon from "@mui/icons-material/Image";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLesson(res.data);
    } catch (err) {
      console.error("Failed to load lesson:", err);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const generateAIAnnotations = async () => {
    try {
      setLoadingAI(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/api/lessons/${id}/generate-ai-annotations`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("AI annotations response:", res.data);
    } catch (err) {
      console.error("Failed to generate AI annotations:", err);
    } finally {
      setLoadingAI(false);
      // Re-fetch the lesson to get newly created annotations from the DB
      await fetchLesson();
      console.log("Annotation generation process finished and lesson re-fetched.");
    }
  };
  
  
  

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return <PictureAsPdfIcon color="error" />;
    if (type.includes("video")) return <VideoLibraryIcon color="primary" />;
    if (type.includes("image")) return <ImageIcon color="secondary" />;
    if (type.includes("audio")) return <AudiotrackIcon color="success" />;
    return <PictureAsPdfIcon />;
  };

  const renderMediaPreview = () => {
    const url = lesson?.fileUrl;
    if (!url) return null;

    if (lesson.typeLesson === "video") {
      return (
        <video controls width="100%" style={{ borderRadius: 8, marginTop: 16 }}>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (lesson.typeLesson === "audio") {
      return (
        <audio controls style={{ width: "100%", marginTop: 16 }}>
          <source src={url} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    if (lesson.typeLesson === "photo" || lesson.typeLesson === "image") {
      return (
        <img
          src={url}
          alt="Lesson media"
          style={{ maxWidth: "100%", marginTop: 16, borderRadius: 8 }}
        />
      );
    }

    if (lesson.typeLesson === "pdf") {
      const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
      return (
        <iframe
          src={googleDocsUrl}
          title="PDF Viewer"
          width="100%"
          height="600"
          style={{ marginTop: 16, borderRadius: 8, border: "none" }}
        />
      );
    }

    return null;
  };
  const renderAnnotations = () => {
    if (!lesson?.annotations?.length) {
      return <Typography>No annotations yet.</Typography>;
    }
  
    return (
      <Stack spacing={2} mt={2}>
        {lesson.annotations.map((ann, i) => (
          <Paper key={i} sx={{ p: 2, borderLeft: "4px solid #1976d2" }}>
            {ann.userId && (
              <>
                <Typography variant="subtitle2" fontWeight={600}>User ID:</Typography>
                <Typography variant="body2" gutterBottom>{ann.userId}</Typography>
              </>
            )}
            <Typography variant="subtitle2" fontWeight={600}>Highlights:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {ann.highlights.map((h, idx) => (
                <Chip
                  key={idx}
                  label={h.text}
                  sx={{ backgroundColor: h.color || '#e0e0e0', color: '#000' }}
                />
              ))}
            </Stack>
            <Typography variant="subtitle2" mt={1} fontWeight={600}>Notes:</Typography>
            {ann.notes.map((n, j) => (
              <Typography key={j} variant="body2" sx={{ mt: 0.5 }}>
                • {n.content} <em style={{ fontSize: 12, color: '#888' }}>({new Date(n.createdAt).toLocaleString()})</em>
              </Typography>
            ))}
          </Paper>
        ))}
      </Stack>
    );
  };
  
  

  return (
    <Box m={4}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <Card sx={{ mt: 2, p: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h5">{lesson?.title || "Lesson Details"}</Typography>}
          subheader={<Typography variant="subtitle2">Type: {lesson?.typeLesson}</Typography>}
        />

        <CardContent>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>📚 Lesson Content:</Typography>
          <Typography variant="body1" mb={3}>{lesson?.content}</Typography>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>📎 File Information:</Typography>
          <List>
            <ListItem>
              <Tooltip title="File Type">
                <ListItemIcon>{getFileIcon(lesson?.fileUrl || "")}</ListItemIcon>
              </Tooltip>
              <ListItemText
                primary={lesson?.fileUrl?.split("/").pop() || "Unnamed File"}
                secondary={lesson?.fileUrl}
              />
              <Tooltip title="Download File">
                <IconButton onClick={() => window.open(lesson?.fileUrl, "_blank")}> <DownloadIcon /> </IconButton>
              </Tooltip>
            </ListItem>
          </List>

          {renderMediaPreview()}

          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">📝 Annotations:</Typography>
            <Button variant="outlined" size="small" onClick={generateAIAnnotations} disabled={loadingAI}>
              {loadingAI ? "Generating..." : "Generate AI Annotations"}
            </Button>
          </Box>
          {renderAnnotations()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LessonDetails;
