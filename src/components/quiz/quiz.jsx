import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const API_KEY = 'OeewoAURpKKYNiQdh5E9WMzaypg0aIf0PbqNY4se';

   useEffect(()=>{
    document.title = "Quiz"
  },[])
  const categories = [
    { value: 'Linux', label: 'Linux' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Code', label: 'Programming' },
    { value: 'SQL', label: 'SQL' },
    { value: 'Docker', label: 'Docker' },
    { value: 'CMS', label: 'CMS' }
  ];

  const startQuiz = () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }
    setQuizStarted(true);
    fetchQuestions();
  };

  const fetchQuestions = () => {
    setIsLoading(true);
    setError(null);
    axios
      .get(`https://quizapi.io/api/v1/questions?limit=5&category=${selectedCategory}`, {
        headers: {
          'X-Api-Key': API_KEY,
        },
      })
      .then((res) => {
        setQuestions(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load questions. Please try again later.');
        setIsLoading(false);
      });
  };

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

  const restartQuiz = () => {
    setStep(0);
    setScore(0);
    setShowScore(false);
    setQuizStarted(false);
    setSelectedCategory(null);
  };

  // Category selection screen
  if (!quizStarted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Select Quiz Category</h2>
          {error && <p style={styles.errorText}>{error}</p>}
          
          <div style={styles.categoriesContainer}>
            {categories.map((category) => (
              <div
                key={category.value}
                style={{
                  ...styles.categoryCard,
                  borderColor: selectedCategory === category.value ? '#172746' : '#d2d6e0',
                  backgroundColor: selectedCategory === category.value ? '#f0f4ff' : '#fff'
                }}
                onClick={() => setSelectedCategory(category.value)}
              >
                <h3 style={styles.categoryTitle}>{category.label}</h3>
              </div>
            ))}
          </div>
          
          <button 
            style={styles.primaryButton} 
            onClick={startQuiz}
            disabled={!selectedCategory}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <p style={styles.text}>Loading {selectedCategory} questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Error</h2>
          <p style={styles.text}>{error}</p>
          <button style={styles.primaryButton} onClick={restartQuiz}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz completed screen
  if (showScore) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Quiz Completed!</h2>
          <p style={styles.scoreText}>
            Your score: <span style={styles.scoreHighlight}>{score}</span> / {questions.length}
          </p>
          <div style={styles.progressContainer}>
            <div 
              style={{
                ...styles.progressBar,
                width: `${(score / questions.length) * 100}%`
              }}
            ></div>
          </div>
          <button style={styles.primaryButton} onClick={restartQuiz}>
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz questions screen
  const current = questions[step];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.quizHeader}>
          <span style={styles.categoryBadge}>{selectedCategory}</span>
          <span style={styles.questionCounter}>
            Question {step + 1} of {questions.length}
          </span>
        </div>
        
        <h3 style={styles.questionText} dangerouslySetInnerHTML={{ __html: current.question }} />
        
        <div style={styles.answersContainer}>
          {Object.entries(current.answers).map(([key, answer]) => (
            answer && (
              <button
                key={key}
                style={styles.answerButton}
                onClick={() => handleAnswer(key)}
              >
                {answer}
              </button>
            )
          ))}
        </div>
        
        <div style={styles.progressContainer}>
          <div 
            style={{
              ...styles.progressBar,
              width: `${((step) / questions.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center'
  },
  heading: {
    color: '#172746',
    marginBottom: '20px',
    fontSize: '24px'
  },
  categoriesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
    margin: '25px 0'
  },
  categoryCard: {
    padding: '20px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  categoryTitle: {
    color: '#172746',
    margin: 0,
    fontSize: '16px'
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#172746',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    width: '100%',
    maxWidth: '200px'
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    color: '#172746',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  questionCounter: {
    color: '#5c6b8a',
    fontSize: '14px'
  },
  questionText: {
    color: '#1d1d1f',
    fontSize: '18px',
    marginBottom: '30px',
    lineHeight: '1.5',
    textAlign: 'left'
  },
  answersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px'
  },
  answerButton: {
    padding: '14px 20px',
    backgroundColor: '#f5f7fa',
    color: '#1d1d1f',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    ':hover': {
      backgroundColor: '#e0e7ff'
    }
  },
  progressContainer: {
    height: '6px',
    backgroundColor: '#d2d6e0',
    borderRadius: '3px',
    marginTop: '20px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#172746',
    transition: 'width 0.5s ease'
  },
  scoreText: {
    fontSize: '20px',
    margin: '20px 0',
    color: '#1d1d1f'
  },
  scoreHighlight: {
    color: '#172746',
    fontWeight: '600'
  },
  errorText: {
    color: '#f44336',
    marginBottom: '20px'
  },
  spinner: {
    border: '4px solid #d2d6e0',
    borderTop: '4px solid #172746',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  text: {
    color: '#5c6b8a',
    marginBottom: '20px'
  }
};

export default Quiz;
