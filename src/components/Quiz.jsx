import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const [quizType, setQuizType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  const loadQuestions = async (type) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/quiz/${type}`);
      if (!response.data?.questions) throw new Error('Aucune question reçue');
      setQuestions(response.data.questions);
      setQuizType(type);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError("Accès au micro refusé");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = {
      questionId: questions[currentIndex]._id,
      answer,
      audioBlob: quizType === 'oral' ? audioBlob : null,
    };
    setAnswers(updatedAnswers);
    setAudioBlob(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const formData = new FormData();
      finalAnswers.forEach((ans, i) => {
        formData.append(`answers[${i}][questionId]`, ans.questionId);
        formData.append(`answers[${i}][answer]`, ans.answer);
        if (ans.audioBlob) {
          formData.append(`answers[${i}][audio]`, ans.audioBlob, `answer-${i}.wav`);
        }
      });

      await axios.post(`http://localhost:3000/api/quiz/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/quiz-result');
    } catch (err) {
      setError('Erreur lors de la soumission');
    }
  };

  const renderInitialSelection = () => (
    <div className="quiz-type-selection">
      <h2>Choisissez un test</h2>
      <button onClick={() => loadQuestions('oral')}>Test Oral</button>
      <button onClick={() => loadQuestions('written')}>Test Écrit</button>
    </div>
  );

  const renderQuiz = () => {
    const question = questions[currentIndex];

    return (
      <div className="quiz">
        <h3>Question {currentIndex + 1} sur {questions.length}</h3>

        {quizType === 'oral' ? (
          <div>
            {question.audioUrl && (
              <audio src={question.audioUrl} controls />
            )}
            <div>
              {isRecording ? (
                <>
                  <p>🎙️ Enregistrement en cours...</p>
                  <button onClick={stopRecording}>Arrêter</button>
                </>
              ) : (
                <>
                  <button onClick={startRecording}>Démarrer l'enregistrement</button>
                  {audioBlob && (
                    <>
                      <audio controls src={URL.createObjectURL(audioBlob)} />
                      <button onClick={() => handleAnswer('audio_response')}>Suivant</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p>{question.text}</p>
            <div>
              {question.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>Chargement en cours...</p>}
      {!quizType ? renderInitialSelection() : renderQuiz()}
    </div>
  );
};

export default Quiz;
