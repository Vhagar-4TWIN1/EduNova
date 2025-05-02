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
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Format de données invalide");
        }
        
        // Ajout de l'URL complète pour les fichiers audio
        const questionsWithFullAudioUrl = result.data.map(question => ({
          ...question,
          audioUrl: question.audioUrl ? `${question.audioUrl}` : null,
          answers: question.answers.map(answer => ({
            ...answer,
            audioUrl: answer.audioUrl ? `${answer.audioUrl}` : null
          }))
        }));
        
        
        setQuestions(questionsWithFullAudioUrl);
      } catch (error) {
        console.error("Erreur:", error);
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
        throw new Error("Erreur lors de la suppression");
      }
      
      setMessage("Question supprimée avec succès");
      setQuestions(questions.filter(q => q._id !== selectedId));
    } catch (error) {
      console.error("Erreur:", error);
      setMessage(`Erreur: ${error.message}`);
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

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) {
  //     setMessage("Veuillez sélectionner un fichier");
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append('file', file);
  
  //   try {
  //     const response = await fetch("http://localhost:3000/api/questions/import", {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Erreur: ${response.status} - ${errorText}`);
  //     }
  
  //     const result = await response.json();
  //     setMessage(result.message);
  //     if (result.addedQuestions && Array.isArray(result.addedQuestions)) {
  //       // Ajout de l'URL complète pour les nouveaux fichiers audio
  //       const newQuestions = result.addedQuestions.map(question => ({
  //         ...question,
  //         audioUrl: question.audioUrl ? `${question.audioUrl}` : null,
  //         answers: question.answers.map(answer => ({
  //           ...answer,
  //           audioUrl: answer.audioUrl ? `${answer.audioUrl}` : null
  //         }))
          
  //       }));
  //       setQuestions([...questions, ...newQuestions]);
  //     }
  //   } catch (error) {
  //     setMessage(error.message);
  //     console.error("Erreur d'upload:", error);
  //   }
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); // Assurez-vous que 'csvFile' correspond au nom du champ de votre backend
  
    try {
      const response = await fetch("http://localhost:3000/api/questions/import", {
        method: "POST",
        body: formData,
      });
  
      // Vérifiez si la réponse est ok (status 200-299)
      if (!response.ok) {
        const errorText = await response.text(); // Lire la réponse sous forme de texte
        throw new Error(`Error: ${response.status} - ${errorText}`); // Afficher l'erreur
      }
  
      const data = await response.json(); // Si la réponse est OK, la traiter comme JSON
      setMessage(data.message);
      fetchQuestions(); // Rafraîchir la liste des questions après l'importation
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
            <audio 
              controls 
              src={params.row.audioUrl}
              style={{ width: '100%', maxWidth: '250px', height: '40px' }}
            >
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
          ) : (
            <Typography variant="body1" sx={{ fontSize: '2rem', lineHeight: 1.4 }}>
              {params.row.questionText}
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: "questionType",
      headerName: "TYPE",
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.row.questionType === 'oral' ? 'Orale' : 'Écrite'} 
          sx={{ 
            fontSize: '2rem',
            fontWeight: 500,
            backgroundColor: params.row.questionType === 'oral' ? colors.blueAccent[600] : colors.greenAccent[600],
            color: 'white',
            width: '80px'
          }}
        />
      )
    },
    {
      field: "level",
      headerName: "NIVEAU",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body1" sx={{ fontSize: '2rem', fontWeight: 500 }}>
          {params.row.level?.name || params.row.level || 'Non spécifié'}
        </Typography>
      )
    },
    {
      field: "answers",
      headerName: "RÉPONSES",
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ width: '100%', py: 1 }}>
          {params.row.answers?.map((answer, index) => (
            <Box 
              key={index}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: '4px',
                backgroundColor: answer.isCorrect ? colors.greenAccent[700] : colors.grey[700],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
              }}
            >
              {answer.audioUrl ? (
                <audio 
                  controls 
                  src={answer.audioUrl}
                  style={{ flexGrow: 1, maxWidth: '200px', height: '40px' }}
                >
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '2rem',
                    color: answer.isCorrect ? 'white' : colors.grey[100],
                    flexGrow: 1,
                    fontWeight: answer.isCorrect ? 500 : 400
                  }}
                >
                  {answer.text}
                </Typography>
              )}
              {answer.audioUrl && (
                <Chip 
                  label="Audio" 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    backgroundColor: colors.blueAccent[500],
                    color: 'white',
                    fontSize: '2rem',
                    height: '24px'
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => handleUpdate(params.row._id)}
            sx={{ 
              '&:hover': { 
                backgroundColor: colors.blueAccent[800],
                color: 'white'
              } 
            }}
          >
            <EditIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <IconButton 
            onClick={() => handleDeleteClick(params.row._id)}
            sx={{ 
              '&:hover': { 
                backgroundColor: colors.redAccent[700],
                color: 'white'
              } 
            }}
          >
            <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      )
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Alert severity="error" sx={{ fontSize: '2rem' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header
        title="GESTION DES QUESTIONS"
        subtitle="Liste complète des questions"
      />
      
      <Box 
        display="flex" 
        justifyContent="space-between" 
        mb={3}
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 2 : 0}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="csv-upload">
            <Button 
              variant="contained" 
              component="span"
              sx={{ 
                fontSize: '2rem',
                py: 1.5,
                px: 3
              }}
            >
              Importer CSV
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              fontSize: '2rem',
              py: 1.5,
              px: 3
            }}
          >
            Nouvelle Question
          </Button>
        </Box>
      </Box>

      {message && (
        <Alert 
          severity={message.includes("Erreur") ? "error" : "success"} 
          sx={{ 
            mb: 3,
            fontSize: '2rem'
          }}
        >
          {message}
        </Alert>
      )}

      <Box
        sx={{
          height: '75vh',
          width: '100%',
          '& .MuiDataGrid-root': {
            border: 'none',
            fontSize: '2rem'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            py: 2, alignItems: "start",
             lineHeight: 1.5,
            fontSize: 'inherit'
          },
          "& .MuiDataGrid-cellContent": {
            whiteSpace: "normal", // éviter que le texte ne soit tronqué
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
            fontSize: '2rem',
            fontWeight: 'bold'
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400]
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
            fontSize: '2rem'
          },
          '& .MuiDataGrid-toolbarContainer': {
            p: 1.5,
            fontSize: '2rem',
            '& button': {
              fontSize: '2rem'
            }
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
            '&:hover': {
              backgroundColor: colors.primary[500]
            }
          },
          '& audio': {
            height: '40px',
            minWidth: '150px'
          }
        }}
      >
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          density="comfortable"
          autoHeight
  getRowHeight={() => 200} // 👈 ici tu ajustes la hauteur (par ex. 130px)
  sx={{
    fontSize: "50px",
    "& .MuiDataGrid-cell": {
      alignItems: "start", // meilleur alignement pour du contenu multiligne
      py: 2,
    },
    "& .MuiDataGrid-row": {
      maxHeight: 'none !important',
    },
    "& .MuiDataGrid-cellContent": {
      whiteSpace: "normal", // éviter que le texte ne soit tronqué
    },
  }}
        />
      </Box>

      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            p: 2,
            minWidth: isMobile ? '90vw' : '400px'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: 600 }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '2rem' }}>
            Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              fontSize: '2rem',
              px: 3,
              py: 1
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus
            variant="contained"
            sx={{
              fontSize: '2rem',
              px: 3,
              py: 1
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionList;