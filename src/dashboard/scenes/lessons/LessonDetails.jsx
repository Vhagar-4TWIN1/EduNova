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

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/api/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLesson(res.data);
    } catch (err) {
      console.error("Failed to load lesson:", err);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [id]);

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
      return (
        <iframe
          src={url}
          title="PDF Viewer"
          width="100%"
          height="600"
          style={{ marginTop: 16, borderRadius: 8 }}
          sandbox="allow-same-origin allow-scripts allow-popups"
        />
      );
    }

    return null;
  };

  return (
    <Box m={4}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <Card sx={{ mt: 2, p: 2, borderRadius: 3 }}>
        <CardHeader
          title={lesson?.title || "Lesson Details"}
          subheader={`Type: ${lesson?.typeLesson}`}
        />
        <CardContent>
          <Typography variant="body1" mb={2}>
            {lesson?.content}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Files & Media:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>{getFileIcon(lesson?.fileUrl || "")}</ListItemIcon>
              <ListItemText
                primary={lesson?.fileUrl?.split("/").pop() || "Unnamed File"}
              />
              <IconButton onClick={() => window.open(lesson?.fileUrl, "_blank")}>
                <DownloadIcon />
              </IconButton>
            </ListItem>
          </List>

          {renderMediaPreview()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LessonDetails;
