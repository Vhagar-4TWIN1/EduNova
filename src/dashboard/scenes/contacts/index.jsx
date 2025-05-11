import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Chip,
  useMediaQuery
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/questions");

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid data format");
        }

        const questionsWithFullAudioUrl = result.data.map(question => ({
          ...question,
          audioUrl: question.audioUrl || null,
          answers: question.answers.map(answer => ({
            ...answer,
            audioUrl: answer.audioUrl || null
          }))
        }));

        setQuestions(questionsWithFullAudioUrl);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/questions/${selectedId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error during deletion");
      }

      setMessage("Question deleted successfully");
      setQuestions(questions.filter(q => q._id !== selectedId));
    } catch (error) {
      console.error("Error:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/dashboard/update-question/${id}`);
  };

  const handleAddNew = () => {
    navigate("/dashboard/contacts/new");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://localhost:3000/api/questions/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setMessage(data.message);
      window.location.reload();
    } catch (error) {
      setMessage(error.message);
      console.error("Upload error:", error);
    }
  };

  const columns = [
    {
      field: "questionText",
      headerName: "QUESTION",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          {params.row.questionType === 'oral' && params.row.audioUrl ? (
            <audio controls src={params.row.audioUrl} style={{ width: '100%', maxWidth: '200px', height: '30px' }} />
          ) : (
            <Typography variant="body2">{params.row.questionText}</Typography>
          )}
        </Box>
      )
    },
    {
      field: "questionType",
      headerName: "TYPE",
      width: 100,
      renderCell: (params) => (
        <Chip label={params.row.questionType === 'oral' ? 'Oral' : 'Written'} sx={{ fontSize: '0.8rem' }} />
      )
    },
    {
      field: "level",
      headerName: "LEVEL",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.row.level?.name || params.row.level || 'Not specified'}</Typography>
      )
    },
    {
      field: "answers",
      headerName: "ANSWERS",
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          {params.row.answers?.map((answer, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, borderRadius: '4px', backgroundColor: answer.isCorrect ? '#198754' : '#ccc' }}>
              {answer.audioUrl ? (
                <audio controls src={answer.audioUrl} style={{ height: '30px', minWidth: '100px' }} />
              ) : (
                <Typography variant="body2" color={answer.isCorrect ? 'white' : 'black'}>
                  {answer.text}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleUpdate(params.row._id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row._id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><CircularProgress size={40} /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ fontSize: '1rem' }}>{error}</Alert>;
  }

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="QUESTIONS" subtitle="Question list" />

      <Box display="flex" justifyContent="space-between" mb={2} flexDirection={isMobile ? "column" : "row"} gap={2}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <input accept=".csv" style={{ display: 'none' }} id="csv-upload" type="file" onChange={handleFileUpload} />
          <label htmlFor="csv-upload">
            <Button variant="contained" component="span" sx={{ fontSize: '0.9rem', py: 1, px: 2 }}>Import CSV</Button>
          </label>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew} sx={{ fontSize: '0.9rem', py: 1, px: 2 }}>New Question</Button>
        </Box>
      </Box>

      {message && <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mb: 2, fontSize: '1rem' }}>{message}</Alert>}

      <Box sx={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          density="compact"
          getRowHeight={() => 100}
          sx={{ fontSize: '0.9rem' }}
        />
      </Box>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ fontSize: '1rem' }}>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.9rem' }}>
            Delete this question? This action is permanent.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ fontSize: '0.9rem' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ fontSize: '0.9rem' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionList;