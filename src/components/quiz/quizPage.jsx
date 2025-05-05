import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Timer, AlertCircle, CheckCircle, BarChart2, Award, Clock } from 'lucide-react';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes en secondes
  const [isLoading, setIsLoading] = useState(true);
  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:3000/api/quiz/generate')
      .then((res) => {
        setQuestions(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Erreur lors du chargement du quiz.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit(); // auto-submit
    }
  }, [timeLeft, submitted]);

  const handleSelect = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    const responses = Object.entries(answers).map(([questionId, answerId]) => ({
      questionId,
      answerId
    }));

    if (responses.length !== questions.length) {
      setError(`Vous avez répondu à ${responses.length} sur ${questions.length} questions.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:3000/api/quiz/submit', {
        studentId,
        responses
      });
      setResults(res.data);
      setSubmitted(true);
    } catch {
      setError('Erreur lors de la soumission.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    const levelStats = {};
    results.responses.forEach((resp) => {
      const levelName = resp.question.level?.name || "Inconnu";
      if (!levelStats[levelName]) levelStats[levelName] = { correct: 0, total: 0 };
      levelStats[levelName].total++;
      if (resp.isCorrect) levelStats[levelName].correct++;
    });

    const globalTotal = Object.values(levelStats).reduce((acc, val) => acc + val.total, 0);
    const globalCorrect = Object.values(levelStats).reduce((acc, val) => acc + val.correct, 0);
    const globalScore = Math.round((globalCorrect / globalTotal) * 100);

    // Déterminer le niveau global
    let globalLevel = "Débutant";
    let levelColor = "text-green-600";
    let levelBgColor = "bg-green-100";
    if (globalScore >= 80) {
      globalLevel = "Expert";
      levelColor = "text-green-800";
      levelBgColor = "bg-green-200";
    } else if (globalScore >= 60) {
      globalLevel = "Intermédiaire";
      levelColor = "text-green-700";
      levelBgColor = "bg-green-150";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100">
            {/* Header des résultats */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white text-center">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 mb-4 text-green-100" />
                <h2 className="text-3xl font-bold">Résultats du Quiz</h2>
                <p className="mt-2 opacity-90 text-green-100">Merci d'avoir complété notre évaluation</p>
              </div>
            </div>

            {/* Score global */}
            <div className="p-8 border-b border-green-100 text-center">
              <div className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full p-4 mb-6">
                <BarChart2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Score Global</h3>
              <div className="flex justify-center mb-6">
                <div className="relative w-56 h-56">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray={`${globalScore}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-800">{globalScore}%</span>
                  </div>
                </div>
              </div>
              <div className={`inline-flex items-center ${levelBgColor} ${levelColor} px-4 py-2 rounded-full mb-4`}>
                <Award className="w-5 h-5 mr-2" />
                <span className="font-semibold">Niveau: {globalLevel}</span>
              </div>
              <p className="text-gray-600">
                {globalCorrect} bonnes réponses sur {globalTotal} questions
              </p>
            </div>

            {/* Détails par niveau */}
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                <BarChart2 className="w-6 h-6 mr-2 text-green-600 inline-block" />
                Performance par niveau
              </h3>
              <div className="space-y-6 max-w-2xl mx-auto">
                {Object.entries(levelStats).map(([level, stat]) => {
                  const score = Math.round((stat.correct / stat.total) * 100);
                  const colorClass = score >= 80 ? 'bg-green-100 text-green-800' 
                                    : score >= 60 ? 'bg-green-50 text-green-700' 
                                    : 'bg-green-50 text-green-600';
                  const barColor = score >= 80 ? 'bg-green-600' 
                                 : score >= 60 ? 'bg-green-500' 
                                 : 'bg-green-400';
                  return (
                    <div key={level} className="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-gray-800 capitalize text-lg">{level}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${colorClass}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                        <div 
                          className={`h-2.5 rounded-full ${barColor}`} 
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{stat.correct} bonnes réponses</span>
                        <span>{stat.total} questions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback global */}
            <div className="bg-green-50 p-8 border-t border-green-100 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h3>
              {globalScore >= 80 ? (
                <p className="text-green-700 max-w-2xl mx-auto">
                  <span className="font-bold">Félicitations !</span> Vos résultats démontrent une maîtrise exceptionnelle des concepts. 
                  Vous pouvez envisager des défis plus avancés pour continuer à progresser.
                </p>
              ) : globalScore >= 60 ? (
                <p className="text-green-600 max-w-2xl mx-auto">
                  <span className="font-bold">Bonne performance !</span> Vous avez une solide compréhension des bases, 
                  mais quelques domaines pourraient bénéficier d'une révision supplémentaire pour atteindre l'excellence.
                </p>
              ) : (
                <p className="text-green-600 max-w-2xl mx-auto">
                  <span className="font-bold">Continuez à pratiquer !</span> Nous recommandons de revoir les concepts de base 
                  et d'utiliser les ressources supplémentaires pour renforcer votre compréhension.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 border-b border-green-200">
          <h1 className="text-2xl font-bold text-green-800">Plateforme d'Évaluation</h1>
          <div className="flex items-center space-x-4">
            <span className="text-green-700">{studentId}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100">
          {/* En-tête du quiz */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Quiz d'évaluation</h1>
            <p className="text-green-100">Répondez à toutes les questions avant la fin du temps imparti</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm mt-1">Veuillez répondre à toutes les questions avant de soumettre.</p>
                </div>
              </div>
            )}

            {/* Timer et progression */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="bg-green-100 text-green-800 rounded-lg px-4 py-2 flex items-center mr-4">
                  <Timer className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-sm text-green-700">
                  {timeLeft > 60 ? 'Temps restant' : 'Dernière minute !'}
                </div>
              </div>
              
              <div className="w-full sm:w-64">
                <div className="flex justify-between text-sm text-green-700 mb-1">
                  <span>Progression</span>
                  <span>{Object.keys(answers).length}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Liste des questions */}
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={q._id} className="p-6 bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-green-600 font-medium uppercase tracking-wide">
                      Question {index + 1} sur {questions.length}
                    </div>
                    {q.level?.name && (
                      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                        {q.level.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-6">{q.questionText}</p>
                  <div className="space-y-3">
                    {q.answers.map((a) => (
                      <label
                        key={a._id}
                        className={`block p-4 rounded-lg border transition cursor-pointer ${
                          answers[q._id] === a._id
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'border-gray-300 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name={q._id}
                            value={a._id}
                            checked={answers[q._id] === a._id}
                            onChange={() => handleSelect(q._id, a._id)}
                            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 flex-shrink-0"
                          />
                          <span className="ml-3 text-gray-700">{a.text}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton de soumission */}
            <div className="mt-12 text-center">
              <button
                onClick={handleSubmit}
                disabled={submitted || timeLeft === 0 || isLoading}
                className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition ${
                  submitted || timeLeft === 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    {timeLeft === 0 ? 'Temps écoulé - Voir résultats' : 'Soumettre le quiz'}
                  </>
                )}
              </button>
              {timeLeft > 0 && timeLeft < 60 && (
                <div className="mt-4 flex items-center justify-center text-sm text-red-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Attention: il ne reste que {timeLeft} seconde{timeLeft > 1 ? 's' : ''}!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;