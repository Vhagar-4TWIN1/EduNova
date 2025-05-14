import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Stack,
  Chip,
  Paper,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Grid,
  useTheme,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import ImageIcon from "@mui/icons-material/Image";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function LessonDetails() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLesson(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const generateAIAnnotations = async () => {
    setLoadingAI(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/lessons/${id}/generate-ai-annotations`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = await axios.get(`/api/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLesson(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return <PictureAsPdfIcon color="error" />;
    if (type.includes("video")) return <VideoLibraryIcon color="success" />;
    if (type.includes("image")) return <ImageIcon color="info" />;
    if (type.includes("audio")) return <AudiotrackIcon color="primary" />;
    return <PictureAsPdfIcon />;
  };

  const renderPreview = () => {
    if (!lesson?.fileUrl) return <Typography color="textSecondary">No preview available.</Typography>;
    const url = lesson.fileUrl;
    switch (lesson.typeLesson) {
      case "video":
        return (
          <video controls width="100%" style={{ borderRadius: 8, boxShadow: theme.shadows[1] }}>
            <source src={url} type="video/mp4" />
          </video>
        );
      case "audio":
        return (
          <Paper variant="outlined" sx={{ p: 2, boxShadow: theme.shadows[1] }}>
            <audio controls style={{ width: '100%' }}>
              <source src={url} type="audio/mpeg" />
            </audio>
          </Paper>
        );
      case "image":
      case "photo":
        return (
          <Box component="img" src={url} alt="media" sx={{ width: '100%', borderRadius: 2, boxShadow: theme.shadows[1] }} />
        );
      case "pdf": {
        const gUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
        return (
          <iframe
            src={gUrl}
            title="PDF Preview"
            width="100%"
            height={500}
            style={{ border: 0, borderRadius: 8, boxShadow: theme.shadows[1] }}
          />
        );
      }
      default:
        return <Typography>No preview for this type.</Typography>;
    }
  };

  const renderAnnotations = () => {
    if (!lesson?.annotations?.length) {
      return <Typography color="textSecondary">No annotations yet.</Typography>;
    }
    return (
      <Stack spacing={2} mt={2}>
        {lesson.annotations.map((ann, idx) => (
          <Paper key={idx} sx={{ p: 2, borderLeft: `4px solid ${theme.palette.success.main}`, boxShadow: theme.shadows[1] }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Highlights</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
              {ann.highlights.map((h, i) => (
                <Chip key={i} label={h.text} sx={{ backgroundColor: h.color || theme.palette.grey[300] }} />
              ))}
            </Stack>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Notes</Typography>
            {ann.notes.map((note, j) => (
              <Typography key={j} variant="body2" sx={{ ml: 1 }}>
                • {note.content} <em style={{ fontSize:12, color: theme.palette.text.secondary }}>({new Date(note.createdAt).toLocaleTimeString()})</em>
              </Typography>
            ))}
          </Paper>
        ))}
      </Stack>
    );
  };

  if (loading) {
    return (
      <Box m={4} textAlign="center">
        <CircularProgress />
        <Typography variant="body1" mt={2}>Loading lesson details...</Typography>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <Typography variant="h5" fontWeight={600}>Lesson Details</Typography>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[3] }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: theme.palette.success.main }}><ImportContactsIcon /></Avatar>}
          title={<Typography variant="h6">{lesson.title}</Typography>}
          subheader={<Chip label={lesson.typeLesson.toUpperCase()} size="small" color="success" />}
          action={
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={generateAIAnnotations}
              disabled={loadingAI}
            >
              {loadingAI ? 'Generating...' : 'AI Annotations'}
            </Button>
          }
          sx={{ backgroundColor: theme.palette.grey[100], pb: 0 }}
        />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
          <Tab label="Info" />
          <Tab label="Preview" />
          <Tab label="Annotations" />
        </Tabs>

        <Divider />

        <CardContent>
          {tab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Content</Typography>
                <Typography variant="body1">{lesson.content}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>File</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar variant="rounded" sx={{ bgcolor: theme.palette.grey[200] }}>
                    {getFileIcon(lesson.fileUrl)}
                  </Avatar>
                  <Typography noWrap sx={{ flex: 1 }}>{lesson.fileUrl.split('/').pop()}</Typography>
                  <Tooltip title="Download File">
                    <IconButton onClick={() => window.open(lesson.fileUrl, '_blank')}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          )}
          {tab === 1 && renderPreview()}
          {tab === 2 && renderAnnotations()}
        </CardContent>
      </Card>
    </Box>
  );
}