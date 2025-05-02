import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Button, Typography, TextField, Select, MenuItem, 
  FormControl, InputLabel, IconButton, CircularProgress, 
  Alert, Card, CardContent, Grid, FormHelperText 
} from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon, Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material';
import axios from 'axios';

const UpdateQuestionForm = () => {
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
  const [recordings, setRecordings] = useState({ question: null, answers: {} });
  const [isRecording, setIsRecording] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/level');
        setLevels(res.data.data);
      } catch {
        setError('Erreur lors du chargement des niveaux');
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/questions/${id}`);
        console.log("Résultat API :", res.data);
        const q = res.data;

        setFormData({
          questionText: q.questionText || '',
          questionType: q.questionType,
          level: typeof q.level === 'object' ? q.level._id : q.level || '',
          answers: q.answers.map(a => ({
            text: a.text || '',
            isCorrect: a.isCorrect || false,
            audioUrl: a.audioUrl || ''
          }))
        });

        const answerRecordings = {};
        q.answers.forEach((a, i) => {
          if (a.audioUrl) answerRecordings[i] = a.audioUrl;
        });

        setRecordings({
          question: q.audioUrl || null,
          answers: answerRecordings
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    if (id) fetchQuestion();
  }, [id]);

  const startRecording = async (type, index = null) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
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

      recorder.start();
      setIsRecording(type === 'question' ? 'question' : index);
    } catch {
      setError("Permission microphone refusée");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording !== null) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(null);
    }
  };

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
    const updated = formData.answers.map((a, i) => ({ ...a, isCorrect: i === index }));
    setFormData(prev => ({ ...prev, answers: updated }));
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
      const updatedAnswers = [...formData.answers];
      updatedAnswers.splice(index, 1);
      const updatedRecordings = { ...recordings.answers };
      delete updatedRecordings[index];
      setFormData(prev => ({ ...prev, answers: updatedAnswers }));
      setRecordings(prev => ({ ...prev, answers: updatedRecordings }));
    }
  };

  const removeRecording = (type, index = null) => {
    if (type === 'question') {
      setRecordings(prev => ({ ...prev, question: null }));
    } else {
      const updated = { ...recordings.answers };
      delete updated[index];
      setRecordings(prev => ({ ...prev, answers: updated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.questionType || !formData.level) {
        throw new Error('Type et niveau requis');
      }

      if (formData.questionType === 'written' && !formData.questionText.trim()) {
        throw new Error('Texte requis pour les questions écrites');
      }

      if (formData.questionType === 'oral' && !recordings.question) {
        throw new Error('Audio requis pour les questions orales');
      }

      const correctCount = formData.answers.filter(a => a.isCorrect).length;
      if (correctCount !== 1) {
        throw new Error('Exactement une réponse correcte doit être sélectionnée');
      }

      const formToSend = new FormData();
      formToSend.append('questionText', formData.questionText);
      formToSend.append('questionType', formData.questionType);
      formToSend.append('level', formData.level);
      formToSend.append('answers', JSON.stringify(formData.answers));

      if (formData.questionType === 'oral') {
        if (recordings.question instanceof Blob) {
          formToSend.append('questionAudio', recordings.question, 'question.wav');
        }
        Object.entries(recordings.answers).forEach(([i, audio]) => {
          if (audio instanceof Blob) {
            formToSend.append('answerAudios', audio, `answer-${i}.wav`);
          }
        });
      }

      await axios.put(`http://localhost:3000/api/questions/${id}`, formToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Question mise à jour avec succès!');
      setTimeout(() => navigate('/dashboard/questions'), 2000);
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
    <Box m={3}>
      <Typography variant="h4" gutterBottom>Modifier la Question</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField fullWidth label="Texte de la question" name="questionText" value={formData.questionText} onChange={handleInputChange} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="level-label">Niveau</InputLabel>
              <Select labelId="level-label" name="level" value={formData.level} onChange={handleInputChange}>
                {levels.map(l => <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select labelId="type-label" name="questionType" value={formData.questionType} onChange={handleInputChange}>
                <MenuItem value="written">Écrite</MenuItem>
                <MenuItem value="oral">Orale</MenuItem>
              </Select>
            </FormControl>

            {formData.questionType === 'oral' && (
              <Box sx={{ mb: 2 }}>
                <Button onClick={() => isRecording === 'question' ? stopRecording() : startRecording('question')} variant="contained">
                  {isRecording === 'question' ? <StopIcon /> : <MicIcon />} {isRecording === 'question' ? 'Stop' : 'Enregistrer'}
                </Button>
                {recordings.question && (
                  <Box mt={1}>
                    <audio controls src={recordings.question instanceof Blob ? URL.createObjectURL(recordings.question) : recordings.question} />
                    <IconButton onClick={() => removeRecording('question')}><DeleteIcon /></IconButton>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>Réponses</Typography>
        {formData.answers.map((a, i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={`Réponse ${i + 1}`} value={a.text} onChange={(e) => handleAnswerChange(i, e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button onClick={() => markCorrectAnswer(i)} color={a.isCorrect ? 'success' : 'primary'} startIcon={<CheckIcon />} variant="outlined">
                    Correcte
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                  {formData.questionType === 'oral' && (
                    <Button onClick={() => isRecording === i ? stopRecording() : startRecording('answer', i)} variant="contained">
                      {isRecording === i ? <StopIcon /> : <MicIcon />}
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton onClick={() => removeAnswer(i)}><DeleteIcon /></IconButton>
                </Grid>
                {formData.questionType === 'oral' && recordings.answers[i] && (
                  <Grid item xs={12}>
                    <audio controls src={recordings.answers[i] instanceof Blob ? URL.createObjectURL(recordings.answers[i]) : recordings.answers[i]} />
                    <IconButton onClick={() => removeRecording('answer', i)}><DeleteIcon /></IconButton>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
        <Box mb={2}>
          <Button variant="outlined" onClick={addAnswer} disabled={formData.answers.length >= 4}>
            Ajouter une réponse
          </Button>
        </Box>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
        </Button>
      </form>
    </Box>
  );
};

export default UpdateQuestionForm;
