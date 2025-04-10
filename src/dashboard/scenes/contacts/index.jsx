import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fonction pour récupérer les questions depuis l'API
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/questions/questions", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des questions");
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Fonction pour supprimer une question
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/questions/questions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la question");
      }
      fetchQuestions(); // Rafraîchir la liste des questions après la suppression
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Fonction pour rediriger vers la page de mise à jour
  const handleUpdate = (id) => {
    navigate(`/dashboard/update-question/${id}`);
  };

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
  

  // Colonnes pour la DataGrid
  const columns = [
    { field: "questionText", headerName: "Question", flex: 1, minWidth: 300 },
    {
      field: "answers",
      headerName: "Réponses",
      flex: 2,
      minWidth: 500,
      renderCell: (params) => {
        return (
          <ul style={{ color: "black", padding: 0, margin: 0, listStyleType: "none" }}>
            {params.value.map((answer, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                {answer.text} {answer.isCorrect ? "(Correcte)" : ""}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={() => handleUpdate(params.row._id)}>
              <EditIcon style={{ color: colors.greenAccent[500] }} />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon style={{ color: colors.redAccent[500] }} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="QUESTIONS"
        subtitle="Liste des questions et leurs réponses"
      />
      {/* Bouton pour uploader un fichier CSV */}
      <Box mb="20px">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <Button variant="contained" color="secondary" component="span">
            Importer un fichier CSV
          </Button>
        </label>
        {message && (
          <Typography variant="body1" style={{ marginTop: "10px", color: "green" }}>
            {message}
          </Typography>
        )}
      </Box>
      {/* Tableau des questions */}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: "black",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            color: "black",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          getRowHeight={() => "auto"}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default Contacts;

