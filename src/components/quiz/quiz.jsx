import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quizz = () => {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const API_KEY = 'OeewoAURpKKYNiQdh5E9WMzaypg0aIf0PbqNY4se';

  useEffect(() => {
    axios
      .get('https://quizapi.io/api/v1/questions?limit=5&category=Linux', {
        headers: {
          'X-Api-Key': API_KEY,
        },
      })
      .then((res) => {
        console.log('Questions:', res.data); // Vérifie si les questions arrivent bien
        setQuestions(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAnswer = (key) => {
    const current = questions[step];
    const isCorrect = current.correct_answers[`${key}_correct`] === 'true';
    if (isCorrect) setScore(score + 1);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setShowScore(true);
    }
  };

  if (questions.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '100px' }}>Chargement des questions...</p>;
  }

  if (showScore) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Quiz terminé !</h2>
        <p>Votre score : {score} / {questions.length}</p>
        <button onClick={() => {
          setStep(0);
          setScore(0);
          setShowScore(false);
        }}>
          Rejouer
        </button>
      </div>
    );
  }

  const current = questions[step];

  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
      <h3 dangerouslySetInnerHTML={{ __html: current.question }} />

      <div style={{ marginTop: '20px' }}>
        {Object.entries(current.answers).map(([key, answer]) => (
          answer && (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              style={{
                display: 'block',
                margin: '10px auto',
                padding: '10px 20px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer'
              }}
            >
              {answer}
            </button>
          )
        ))}
      </div>

      <p style={{ marginTop: '20px' }}>Question {step + 1} / {questions.length}</p>
    </div>
  );
};

export default Quizz;
