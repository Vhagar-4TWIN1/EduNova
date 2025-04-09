import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import Header from "../../components/header"; // Import the Header component

const UpdateQuestion = () => {
  const { id } = useParams(); // Récupérer l'ID de la question depuis l'URL
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Charger les détails de la question à mettre à jour
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/questions/questions/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la question");
        }
        const data = await response.json();
        setQuestionText(data.questionText);
        setAnswers(data.answers);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index][field] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/questions/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionText, answers }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la question");
      }
      navigate("/dashboard/contacts"); // Rediriger vers la liste des questions après la mise à jour
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Modifier la question" subtitle="Mettre à jour les détails de la question" /> {/* Add Header here */}
      
      <Box pt="100px"> {/* Padding top to give space for the header */}
        <Typography variant="h4" gutterBottom style={{ color: "black" }}>
          Modifier la question
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ style: { color: "black" } }} // Texte en noir
          />
          {answers.map((answer, index) => (
            <Box key={index} mb={2}>
              <TextField
                label={`Réponse ${index + 1}`}
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{ style: { color: "black" } }} // Texte en noir
              />
              <Button
                variant="contained"
                color={answer.isCorrect ? "success" : "error"}
                onClick={() => handleAnswerChange(index, "isCorrect", !answer.isCorrect)}
              >
                {answer.isCorrect ? "Correcte" : "Incorrecte"}
              </Button>
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Enregistrer les modifications
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UpdateQuestion;
