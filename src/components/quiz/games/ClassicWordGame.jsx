import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClassicWordGame.css';

const ClassicWordGame = () => {
  const [subject, setSubject] = useState('');
  const [words, setWords] = useState([]);
  const [guessedWord, setGuessedWord] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animateMessage, setAnimateMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setAnimateMessage(true);
      const timer = setTimeout(() => {
        setAnimateMessage(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchWords = async () => {
    if (!subject.trim()) {
      setMessage("Please enter a subject");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate_words', { subject });
      setWords(response.data.words.map(w => w.toLowerCase()));
      setCorrectGuesses([]);
      setGuessedWord('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setMessage("Error fetching words.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = () => {
    if (!guessedWord.trim()) return;

    const guess = guessedWord.toLowerCase();
    if (words.includes(guess)) {
      if (!correctGuesses.includes(guess)) {
        setCorrectGuesses([...correctGuesses, guess]);
        setMessage("Nice guess!");
      } else {
        setMessage("You already guessed that word.");
      }
    } else {
      setMessage("Wrong guess!");
    }
    setGuessedWord('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      words.length > 0 ? handleGuess() : fetchWords();
    }
  };

  const calculateProgress = () => {
    return (correctGuesses.length / 10) * 100;
  };

  return (
    <div className="word-game-container">
      <div className="word-game-card">
        <h1 className="word-game-title">Educational Word Game</h1>

        <div className="input-group">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a subject (e.g., biology, math...)"
            className="text-input"
            onKeyPress={handleKeyPress}
            disabled={isLoading || words.length > 0}
          />
          {words.length === 0 && (
            <button 
              onClick={fetchWords} 
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Generate Words'}
            </button>
          )}
        </div>

        {words.length > 0 && (
          <div className="game-section">
            <p className="subject-label">
              Guess the 10 words related to: <span className="highlight">{subject}</span>
            </p>

            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
              <span className="progress-text">{correctGuesses.length}/10</span>
            </div>

            <div className="input-group">
              <input
                type="text"
                value={guessedWord}
                onChange={(e) => setGuessedWord(e.target.value)}
                placeholder="Type a word"
                className="text-input"
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <button 
                onClick={handleGuess} 
                className="primary-button"
              >
                Guess
              </button>
            </div>

            <div className={`message ${animateMessage ? 'animate' : ''} ${message.includes('Nice') ? 'success' : message.includes('Wrong') ? 'error' : ''}`}>
              {message}
            </div>

            <div className="guessed-words-section">
              <h2 className="section-title">Guessed Words:</h2>
              {correctGuesses.length > 0 ? (
                <ul className="guessed-words-list">
                  {correctGuesses.map((word, index) => (
                    <li key={index} className="guessed-word">
                      <span className="word-text">{word}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-list">No words guessed yet</p>
              )}
            </div>

            {correctGuesses.length === 10 && (
              <div className="success-message">
                <p>Congratulations! You found all the words!</p>
                <button 
                  onClick={() => {
                    setWords([]);
                    setSubject('');
                  }} 
                  className="secondary-button"
                >
                  New Game
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicWordGame;
