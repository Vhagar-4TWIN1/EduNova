import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  FormHelperText
} from '@mui/material';
import { 
  Mic as MicIcon, 
  Stop as StopIcon, 
  Delete as DeleteIcon, 
  Check as CheckIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import axios from 'axios';

const QuestionForm = ({ editMode = false }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'written',
    level: '',
    answers: [
      { text: '', isCorrect: false, audioUrl: '' },
      { text: '', isCorrect: false, audioUrl: '' }
    ]
  });
  
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordings, setRecordings] = useState({
    question: null,
    answers: {}
  });
  
  const [isRecording, setIsRecording] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Charger les niveaux disponibles
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/level');
        setLevels(response.data.data);
        
        if (!editMode && response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, level: response.data.data[0]._id }));
        }
      } catch (err) {
        setError('Erreur lors du chargement des niveaux');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLevels();
  }, [editMode]);

  // Charger la question en mode édition
  useEffect(() => {
    if (editMode && id && levels.length > 0) {
      const fetchQuestion = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/questions/${id}`);
          const question = response.data;
          
          setFormData({
            questionText: question.questionText || '',
            questionType: question.questionType,
            level: question.level._id || question.level,
            answers: question.answers.map(a => ({
              text: a.text || '',
              isCorrect: a.isCorrect || false,
              audioUrl: a.audioUrl || ''
            }))
          });
          
          const answerRecordings = {};
          question.answers.forEach((answer, index) => {
            if (answer.audioUrl) {
              answerRecordings[index] = answer.audioUrl;
            }
          });
          
          setRecordings({
            question: question.audioUrl || null,
            answers: answerRecordings
          });
        } catch (err) {
          setError(err.response?.data?.message || err.message);
        }
      };
      fetchQuestion();
    }
  }, [editMode, id, levels]);

  // Gestion de l'enregistrement audio
  const startRecording = async (type, index = null) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (type === 'question') {
          setRecordings(prev => ({ ...prev, question: audioBlob }));
        } else {
          setRecordings(prev => ({
            ...prev,
            answers: { ...prev.answers, [index]: audioBlob }
          }));
        }
      };

      mediaRecorder.start();
      setIsRecording(type === 'question' ? 'question' : index);
    } catch (err) {
      setError("Permission microphone refusée");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording !== null) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(null);
    }
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answers];
    newAnswers[index].text = value;
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const markCorrectAnswer = (index) => {
    const newAnswers = formData.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index
    }));
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const addAnswer = () => {
    if (formData.answers.length < 4) {
      setFormData(prev => ({
        ...prev,
        answers: [...prev.answers, { text: '', isCorrect: false, audioUrl: '' }]
      }));
    }
  };

  const removeAnswer = (index) => {
    if (formData.answers.length > 2) {
      const newAnswers = [...formData.answers];
      newAnswers.splice(index, 1);
      setFormData(prev => ({ ...prev, answers: newAnswers }));

      const newRecordings = { ...recordings.answers };
      delete newRecordings[index];
      setRecordings(prev => ({ ...prev, answers: newRecordings }));
    }
  };

  const removeRecording = (type, index = null) => {
    if (type === 'question') {
      setRecordings(prev => ({ ...prev, question: null }));
    } else {
      const newRecordings = { ...recordings.answers };
      delete newRecordings[index];
      setRecordings(prev => ({ ...prev, answers: newRecordings }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.questionType || !formData.level) {
        throw new Error('Type et niveau sont requis');
      }

      if (formData.questionType === 'written' && !formData.questionText.trim()) {
        throw new Error('Texte de question requis pour les questions écrites');
      }

      if (formData.questionType === 'oral' && !recordings.question) {
        throw new Error('Enregistrement audio requis pour les questions orales');
      }

      const correctAnswers = formData.answers.filter(a => a.isCorrect).length;
      if (correctAnswers !== 1) {
        throw new Error('Sélectionnez exactement une réponse correcte');
      }

      // Préparation des données
      const formDataToSend = new FormData();
      formDataToSend.append('questionText', formData.questionText);
      formDataToSend.append('questionType', formData.questionType);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('answers', JSON.stringify(formData.answers));

      // Ajout des fichiers audio
      if (formData.questionType === 'oral') {
        if (recordings.question instanceof Blob) {
          formDataToSend.append('questionAudio', recordings.question, 'question.wav');
        }

        Object.entries(recordings.answers).forEach(([index, audio]) => {
          if (audio instanceof Blob) {
            formDataToSend.append('answerAudios', audio, `answer-${index}.wav`);
          }
        });
      }

      // Envoi au backend
      let response;
      if (editMode && id) {
        response = await axios.put(`http://localhost:3000/api/questions/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://localhost:3000/api/questions', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setSuccess(editMode ? 'Question mise à jour avec succès!' : 'Question créée avec succès!');
      setTimeout(() => navigate('/dashboard/contacts'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        {editMode ? 'Modifier la Question' : 'Créer une Nouvelle Question'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Type de question */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de question</InputLabel>
                  <Select
                    name="questionType"
                    value={formData.questionType}
                    onChange={handleInputChange}
                    label="Type de question"
                    required
                  >
                    <MenuItem value="written">Écrite</MenuItem>
                    <MenuItem value="oral">Orale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Niveau */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Niveau</InputLabel>
                  <Select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    label="Niveau"
                    required
                    disabled={levels.length === 0}
                  >
                    {levels.map(level => (
                      <MenuItem key={level._id} value={level._id}>
                        {level.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {levels.length === 0 && (
                    <FormHelperText error>Aucun niveau disponible</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Question écrite */}
              {formData.questionType === 'written' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Texte de la question"
                    name="questionText"
                    value={formData.questionText}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              )}

              {/* Enregistrement question orale */}
              {formData.questionType === 'oral' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Enregistrement de la question
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    {isRecording === 'question' ? (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<StopIcon />}
                        onClick={stopRecording}
                      >
                        Arrêter
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<MicIcon />}
                        onClick={() => startRecording('question')}
                      >
                        {recordings.question ? 'Réenregistrer' : 'Enregistrer'}
                      </Button>
                    )}

                    {recordings.question && (
                      <>
                        <audio controls src={
                          recordings.question instanceof Blob 
                            ? URL.createObjectURL(recordings.question) 
                            : recordings.question
                        } />
                        <IconButton 
                          color="error"
                          onClick={() => removeRecording('question')}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Réponses */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Réponses (sélectionnez la réponse correcte)
                </Typography>
                
                {formData.answers.map((answer, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => markCorrectAnswer(index)}
                          color={answer.isCorrect ? 'success' : 'default'}
                        >
                          <CheckIcon />
                        </IconButton>
                        <Typography>
                          {answer.isCorrect ? 'Réponse correcte' : 'Marquer comme correcte'}
                        </Typography>
                      </Box>
                      
                      {formData.answers.length > 2 && (
                        <IconButton
                          color="error"
                          onClick={() => removeAnswer(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    {/* Réponse écrite */}
                    {formData.questionType === 'written' && (
                      <TextField
                        fullWidth
                        value={answer.text}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Réponse ${index + 1}`}
                        required
                      />
                    )}

                    {/* Enregistrement réponse orale */}
                    {formData.questionType === 'oral' && (
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        {isRecording === index ? (
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<StopIcon />}
                            onClick={stopRecording}
                          >
                            Arrêter
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<MicIcon />}
                            onClick={() => startRecording('answer', index)}
                          >
                            {recordings.answers[index] ? 'Réenregistrer' : 'Enregistrer'}
                          </Button>
                        )}

                        {recordings.answers[index] && (
                          <>
                            <audio controls src={
                              recordings.answers[index] instanceof Blob
                                ? URL.createObjectURL(recordings.answers[index])
                                : recordings.answers[index]
                            } />
                            <IconButton
                              color="error"
                              onClick={() => removeRecording('answer', index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                ))}

                {formData.answers.length < 4 && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addAnswer}
                  >
                    Ajouter une réponse
                  </Button>
                )}
              </Grid>

              {/* Bouton de soumission */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Envoi en cours...' : (editMode ? 'Mettre à jour' : 'Créer')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuestionForm;