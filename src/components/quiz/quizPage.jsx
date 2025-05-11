// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Timer, AlertCircle, CheckCircle, BarChart2, Award, Clock } from 'lucide-react';

// const QuizPage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [results, setResults] = useState(null);
//   const [error, setError] = useState('');
//   const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds
//   const [isLoading, setIsLoading] = useState(true);
//   const studentId = localStorage.getItem('userId');

//   useEffect(() => {
//     setIsLoading(true);
//     axios.get('http://localhost:3000/api/quiz/generate')
//       .then((res) => {
//         setQuestions(res.data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setError('Error loading quiz.');
//         setIsLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (submitted) return;
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       handleSubmit(); // auto-submit
//     }
//   }, [timeLeft, submitted]);

//   const handleSelect = (questionId, answerId) => {
//     setAnswers(prev => ({ ...prev, [questionId]: answerId }));
//   };

//   const handleSubmit = async () => {
//     if (submitted) return;

//     const responses = Object.entries(answers).map(([questionId, answerId]) => ({
//       questionId,
//       answerId
//     }));

//     if (responses.length !== questions.length) {
//       setError(`You've answered ${responses.length} out of ${questions.length} questions.`);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const res = await axios.post('http://localhost:3000/api/quiz/submit', {
//         studentId,
//         responses
//       });
//       setResults(res.data);
//       setSubmitted(true);
//     } catch {
//       setError('Submission error.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   if (isLoading && !submitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-[#172746] border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-lg text-gray-700">Loading quiz...</p>
//         </div>
//       </div>
//     );
//   }

//   if (submitted && results) {
//     const levelStats = {};
//     results.responses.forEach((resp) => {
//       const levelName = resp.question.level?.name || "Unknown";
//       if (!levelStats[levelName]) levelStats[levelName] = { correct: 0, total: 0 };
//       levelStats[levelName].total++;
//       if (resp.isCorrect) levelStats[levelName].correct++;
//     });

//     const globalTotal = Object.values(levelStats).reduce((acc, val) => acc + val.total, 0);
//     const globalCorrect = Object.values(levelStats).reduce((acc, val) => acc + val.correct, 0);
//     const globalScore = Math.round((globalCorrect / globalTotal) * 100);

//     // Determine global level
//     let globalLevel = "Beginner";
//     let levelColor = "text-blue-800";
//     let levelBgColor = "bg-blue-100";
//     if (globalScore >= 80) {
//       globalLevel = "Expert";
//       levelColor = "text-blue-900";
//       levelBgColor = "bg-blue-200";
//     } else if (globalScore >= 60) {
//       globalLevel = "Intermediate";
//       levelColor = "text-blue-700";
//       levelBgColor = "bg-blue-150";
//     }

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
//             {/* Results header */}
//             <div className="bg-[#172746] p-8 text-white text-center">
//               <div className="flex flex-col items-center">
//                 <CheckCircle className="w-12 h-12 mb-4 text-blue-200" />
//                 <h2 className="text-3xl font-bold text-white">Quiz Results</h2>
//                 <p className="mt-2 opacity-90 text-blue-200">Thank you for completing our assessment</p>
//               </div>
//             </div>

//             {/* Overall score */}
//             <div className="p-8 border-b border-gray-200 text-center">
//               <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full p-4 mb-6">
//                 <BarChart2 className="w-8 h-8" />
//               </div>
//               <h3 className="text-2xl font-semibold text-gray-800 mb-6">Overall Score</h3>
//               <div className="flex justify-center mb-6">
//                 <div className="relative w-56 h-56">
//                   <svg className="w-full h-full" viewBox="0 0 36 36">
//                     <path
//                       d="M18 2.0845
//                         a 15.9155 15.9155 0 0 1 0 31.831
//                         a 15.9155 15.9155 0 0 1 0 -31.831"
//                       fill="none"
//                       stroke="#E5E7EB"
//                       strokeWidth="3"
//                     />
//                     <path
//                       d="M18 2.0845
//                         a 15.9155 15.9155 0 0 1 0 31.831
//                         a 15.9155 15.9155 0 0 1 0 -31.831"
//                       fill="none"
//                       stroke="#172746"
//                       strokeWidth="3"
//                       strokeDasharray={`${globalScore}, 100`}
//                     />
//                   </svg>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-5xl font-bold text-gray-800">{globalScore}%</span>
//                   </div>
//                 </div>
//               </div>
//               <div className={`inline-flex items-center ${levelBgColor} ${levelColor} px-4 py-2 rounded-full mb-4`}>
//                 <Award className="w-5 h-5 mr-2" />
//                 <span className="font-semibold">Level: {globalLevel}</span>
//               </div>
//               <p className="text-gray-600">
//                 {globalCorrect} correct answers out of {globalTotal} questions
//               </p>
//             </div>

//             {/* Level breakdown */}
//             <div className="p-8">
//               <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
//                 <BarChart2 className="w-6 h-6 mr-2 text-[#172746] inline-block" />
//                 Performance by Level
//               </h3>
//               <div className="space-y-6 max-w-2xl mx-auto">
//                 {Object.entries(levelStats).map(([level, stat]) => {
//                   const score = Math.round((stat.correct / stat.total) * 100);
//                   const colorClass = score >= 80 ? 'bg-blue-100 text-blue-800' 
//                                     : score >= 60 ? 'bg-blue-50 text-blue-700' 
//                                     : 'bg-blue-50 text-blue-600';
//                   const barColor = score >= 80 ? 'bg-[#172746]' 
//                                  : score >= 60 ? 'bg-blue-700' 
//                                  : 'bg-blue-500';
//                   return (
//                     <div key={level} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                       <div className="flex justify-between items-center mb-4">
//                         <span className="font-medium text-gray-800 capitalize text-lg">{level}</span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-bold ${colorClass}`}>
//                           {score}%
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
//                         <div 
//                           className={`h-2.5 rounded-full ${barColor}`} 
//                           style={{ width: `${score}%` }}
//                         ></div>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-500">
//                         <span>{stat.correct} correct</span>
//                         <span>{stat.total} questions</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Feedback */}
//             <div className="bg-blue-50 p-8 border-t border-gray-200 text-center">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h3>
//               {globalScore >= 80 ? (
//                 <p className="text-blue-800 max-w-2xl mx-auto">
//                   <span className="font-bold">Congratulations!</span> Your results demonstrate exceptional mastery of the concepts. 
//                   You may consider more advanced challenges to continue progressing.
//                 </p>
//               ) : globalScore >= 60 ? (
//                 <p className="text-blue-700 max-w-2xl mx-auto">
//                   <span className="font-bold">Good performance!</span> You have solid understanding of the basics, 
//                   but some areas could benefit from additional review to reach excellence.
//                 </p>
//               ) : (
//                 <p className="text-blue-600 max-w-2xl mx-auto">
//                   <span className="font-bold">Keep practicing!</span> We recommend reviewing basic concepts 
//                   and using additional resources to strengthen your understanding.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-4 pb-12 px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <header className="max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4 border-b border-gray-300">
//           <h1 className="text-2xl font-bold text-[#172746]">Assessment Platform</h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-blue-800">{studentId}</span>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
//           {/* Quiz header */}
//           <div className="bg-[#172746] p-8 text-white text-center">
//             <h1 className="text-3xl font-bold mb-2 text-white">Assessment Quiz</h1>
//             <p className="text-blue-200">Answer all questions before time runs out</p>
//           </div>

//           <div className="p-8">
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 flex items-start">
//                 <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium">{error}</p>
//                   <p className="text-sm mt-1">Please answer all questions before submitting.</p>
//                 </div>
//               </div>
//             )}

//             {/* Timer and progress */}
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-blue-50 p-4 rounded-lg border border-gray-300">
//               <div className="flex items-center mb-4 sm:mb-0">
//                 <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 flex items-center mr-4">
//                   <Timer className="w-5 h-5 mr-2" />
//                   <span className="font-semibold">{formatTime(timeLeft)}</span>
//                 </div>
//                 <div className="text-sm text-blue-700">
//                   {timeLeft > 60 ? 'Time remaining' : 'Last minute!'}
//                 </div>
//               </div>
              
//               <div className="w-full sm:w-64">
//                 <div className="flex justify-between text-sm text-blue-700 mb-1">
//                   <span>Progress</span>
//                   <span>{Object.keys(answers).length}/{questions.length}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div 
//                     className="bg-[#172746] h-2.5 rounded-full transition-all duration-300" 
//                     style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* Questions list */}
//             <div className="space-y-8">
//               {questions.map((q, index) => (
//                 <div key={q._id} className="p-6 bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="text-sm text-blue-700 font-medium uppercase tracking-wide">
//                       Question {index + 1} of {questions.length}
//                     </div>
//                     {q.level?.name && (
//                       <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
//                         {q.level.name}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-xl font-semibold text-gray-800 mb-6">{q.questionText}</p>
//                   <div className="space-y-3">
//                     {q.answers.map((a) => (
//                       <label
//                         key={a._id}
//                         className={`block p-4 rounded-lg border transition cursor-pointer ${
//                           answers[q._id] === a._id
//                             ? 'border-[#172746] bg-blue-50 ring-2 ring-blue-200'
//                             : 'border-gray-300 hover:bg-blue-50'
//                         }`}
//                       >
//                         <div className="flex items-start">
//                           <input
//                             type="radio"
//                             name={q._id}
//                             value={a._id}
//                             checked={answers[q._id] === a._id}
//                             onChange={() => handleSelect(q._id, a._id)}
//                             className="mt-1 h-4 w-4 text-[#172746] focus:ring-[#172746] flex-shrink-0"
//                           />
//                           <span className="ml-3 text-gray-700">{a.text}</span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Submit button */}
//             <div className="mt-12 text-center">
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitted || timeLeft === 0 || isLoading}
//                 className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition ${
//                   submitted || timeLeft === 0 || isLoading
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-[#172746] hover:bg-blue-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
//                 }`}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-6 h-6 mr-2" />
//                     {timeLeft === 0 ? 'Time expired - View results' : 'Submit quiz'}
//                   </>
//                 )}
//               </button>
//               {timeLeft > 0 && timeLeft < 60 && (
//                 <div className="mt-4 flex items-center justify-center text-sm text-red-600">
//                   <Clock className="w-4 h-4 mr-1" />
//                   <span>Warning: only {timeLeft} second{timeLeft > 1 ? 's' : ''} left!</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizPage;


import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  Timer, 
  AlertCircle, 
  CheckCircle, 
  BarChart2, 
  Award, 
  Clock, 
  Volume2,
  VolumeX
} from 'lucide-react';

const QuizPage = () => {
  // États
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioStatus, setAudioStatus] = useState({});
  const audioRef = useRef(null);
  const studentId = localStorage.getItem('userId');

  // Fonction de lecture audio
  const playAudio = async (audioPath, id) => {
    try {
      setAudioStatus(prev => ({ ...prev, [id]: 'loading' }));
      setCurrentlyPlaying(null);

      if (!audioPath) throw new Error('Audio path is missing');

      let audioUrl = audioPath.replace(/\\/g, '/');
      if (!audioUrl.startsWith('http') && !audioUrl.startsWith('/') && !audioUrl.startsWith('blob:')) {
        audioUrl = `http://localhost:3000/${audioUrl}`;
      }

      if (!audioUrl.toLowerCase().endsWith('.wav')) {
        throw new Error('Only .wav files are supported');
      }

      if (currentlyPlaying === id && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setAudioStatus(prev => ({ ...prev, [id]: 'paused' }));
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }

      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      audioRef.current = new Audio(blobUrl);
      audioRef.current.preload = 'auto';

      audioRef.current.onerror = () => {
        setError('Playback failed');
        setAudioStatus(prev => ({ ...prev, [id]: 'error' }));
        setCurrentlyPlaying(null);
      };

      audioRef.current.onended = () => {
        URL.revokeObjectURL(blobUrl);
        setCurrentlyPlaying(null);
        setAudioStatus(prev => ({ ...prev, [id]: 'ended' }));
      };

      await audioRef.current.play();
      setCurrentlyPlaying(id);
      setAudioStatus(prev => ({ ...prev, [id]: 'playing' }));

    } catch (err) {
      console.error('Audio playback error:', err);
      setAudioStatus(prev => ({ ...prev, [id]: 'error' }));
      setError(`Audio error: ${err.message}`);
      setCurrentlyPlaying(null);
    }
  };

  // Chargement des questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/quiz/generate',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
        const API_BASE_URL = 'http://localhost:3000';
        const correctedQuestions = response.data.map(question => ({
          ...question,
          audioUrl: question.audioUrl 
            ? `${API_BASE_URL}/${question.audioUrl.replace(/\\/g, '/')}`
            : null,
          answers: question.answers.map(answer => ({
            ...answer,
            audioUrl: answer.audioUrl 
              ? `${API_BASE_URL}/${answer.audioUrl.replace(/\\/g, '/')}`
              : null
          }))
        }));
        
        setQuestions(correctedQuestions);
      } catch (err) {
        setError('Failed to load quiz questions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Gestion du timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  // Sélection des réponses
  const handleSelect = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  // Soumission du quiz
  const handleSubmit = async () => {
    if (submitted) return;

    const responses = Object.entries(answers).map(([questionId, answerId]) => ({
      questionId,
      answerId
    }));

    if (responses.length !== questions.length) {
      setError(`You've answered ${responses.length} out of ${questions.length} questions`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

   try {
  const res = await axios.post('http://localhost:3000/api/quiz/submit', {
    studentId,
    responses
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  setResults(res.data);
  setSubmitted(true);
} catch (err) {
  console.error('Full error:', err);
  console.error('Error response:', err.response);
  setError(`Submission failed: ${err.message}`);
} finally {
      setIsLoading(false);
    }
  };

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Affichage du chargement
  if (isLoading && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#172746] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Affichage des résultats
  if (submitted && results) {
    const levelStats = {};
    results.responses.forEach((resp) => {
      const levelName = resp.question.level?.name || "Unknown";
      if (!levelStats[levelName]) levelStats[levelName] = { correct: 0, total: 0 };
      levelStats[levelName].total++;
      if (resp.isCorrect) levelStats[levelName].correct++;
    });

    const globalTotal = Object.values(levelStats).reduce((acc, val) => acc + val.total, 0);
    const globalCorrect = Object.values(levelStats).reduce((acc, val) => acc + val.correct, 0);
    const globalScore = Math.round((globalCorrect / globalTotal) * 100);

    // Determine global level
    let globalLevel = "Beginner";
    let levelColor = "text-blue-800";
    let levelBgColor = "bg-blue-100";
    if (globalScore >= 80) {
      globalLevel = "Expert";
      levelColor = "text-blue-900";
      levelBgColor = "bg-blue-200";
    } else if (globalScore >= 60) {
      globalLevel = "Intermediate";
      levelColor = "text-blue-700";
      levelBgColor = "bg-blue-150";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            {/* Results header */}
            <div className="bg-[#172746] p-8 text-white text-center">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 mb-4 text-blue-200" />
                <h2 className="text-3xl font-bold text-white">Quiz Results</h2>
                <p className="mt-2 opacity-90 text-blue-200">Thank you for completing our assessment</p>
              </div>
            </div>

            {/* Overall score */}
            <div className="p-8 border-b border-gray-200 text-center">
              <div className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full p-4 mb-6">
                <BarChart2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Overall Score</h3>
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
                      stroke="#172746"
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
                <span className="font-semibold">Level: {globalLevel}</span>
              </div>
              <p className="text-gray-600">
                {globalCorrect} correct answers out of {globalTotal} questions
              </p>
            </div>

            {/* Level breakdown */}
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                <BarChart2 className="w-6 h-6 mr-2 text-[#172746] inline-block" />
                Performance by Level
              </h3>
              <div className="space-y-6 max-w-2xl mx-auto">
                {Object.entries(levelStats).map(([level, stat]) => {
                  const score = Math.round((stat.correct / stat.total) * 100);
                  const colorClass = score >= 80 ? 'bg-blue-100 text-blue-800' 
                                    : score >= 60 ? 'bg-blue-50 text-blue-700' 
                                    : 'bg-blue-50 text-blue-600';
                  const barColor = score >= 80 ? 'bg-[#172746]' 
                                  : score >= 60 ? 'bg-blue-700' 
                                  : 'bg-blue-500';
                  return (
                    <div key={level} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
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
                        <span>{stat.correct} correct</span>
                        <span>{stat.total} questions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-blue-50 p-8 border-t border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h3>
              {globalScore >= 80 ? (
                <p className="text-blue-800 max-w-2xl mx-auto">
                  <span className="font-bold">Congratulations!</span> Your results demonstrate exceptional mastery of the concepts. 
                  You may consider more advanced challenges to continue progressing.
                </p>
              ) : globalScore >= 60 ? (
                <p className="text-blue-700 max-w-2xl mx-auto">
                  <span className="font-bold">Good performance!</span> You have solid understanding of the basics, 
                  but some areas could benefit from additional review to reach excellence.
                </p>
              ) : (
                <p className="text-blue-600 max-w-2xl mx-auto">
                  <span className="font-bold">Keep practicing!</span> We recommend reviewing basic concepts 
                  and using additional resources to strengthen your understanding.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <br />
      <header className="max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-[#172746]">Assessment Platform</h1>
          <div className="flex items-center space-x-4">
            <span className="text-blue-800">{studentId}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Quiz header */}
          <div className="bg-[#172746] p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">Assessment Quiz</h1>
            <p className="text-blue-200">Answer all questions before time runs out</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm mt-1">Please answer all questions before submitting.</p>
                </div>
              </div>
            )}

            {/* Timer and progress */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-blue-50 p-4 rounded-lg border border-gray-300">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 flex items-center mr-4">
                  <Timer className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-sm text-blue-700">
                  {timeLeft > 60 ? 'Time remaining' : 'Last minute!'}
                </div>
              </div>
              
              <div className="w-full sm:w-64">
                <div className="flex justify-between text-sm text-blue-700 mb-1">
                  <span>Progress</span>
                  <span>{Object.keys(answers).length}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#172746] h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={q._id} className="p-6 bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-blue-700 font-medium uppercase tracking-wide">
                      Question {index + 1} of {questions.length}
                    </div>
                    {q.level?.name && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                        {q.level.name}
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  {q.questionType === 'oral' ? (
                    <div className="mb-6">
                      <button
                        onClick={() => playAudio(q.audioUrl, `question-${q._id}`)}
                        disabled={!q.audioUrl || audioStatus[`question-${q._id}`] === 'error'}
                        className={`flex items-center px-4 py-2 rounded-lg mb-2 ${
                          !q.audioUrl 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : audioStatus[`question-${q._id}`] === 'playing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {audioStatus[`question-${q._id}`] === 'error' ? (
                          <VolumeX className="w-5 h-5 mr-2 text-red-500" />
                        ) : (
                          <Volume2 className="w-5 h-5 mr-2" />
                        )}
                        {!q.audioUrl 
                          ? 'Audio unavailable' 
                          : audioStatus[`question-${q._id}`] === 'playing'
                            ? 'Playing...'
                            : audioStatus[`question-${q._id}`] === 'error'
                              ? 'Playback failed'
                              : 'Play Question'
                        }
                      </button>
                      
                      {q.audioText && (
                        <p className="text-sm text-gray-500 italic">
                          <span className="font-medium">Transcript:</span> {q.audioText}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-gray-800 mb-6">{q.questionText}</p>
                  )}

                  {/* Answers */}
 {/* Réponses pour questions orales */}
<div className="space-y-3">
  {q.answers.map((a, aIndex) => (
    <label
      key={a._id || `${q._id}-${aIndex}`}
      htmlFor={`answer-${q._id}-${a._id || aIndex}`}
      className={`block p-4 rounded-lg border cursor-pointer transition ${
        answers[q._id] === (a._id || aIndex)
          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-300 hover:bg-blue-50'
      }`}
    >
      <div className="flex items-center">
        <input
          type="radio"
          id={`answer-${q._id}-${a._id || aIndex}`}
          name={`question-${q._id}`}
          checked={answers[q._id] === (a._id || aIndex)}
          onChange={() => handleSelect(q._id, a._id || aIndex)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />

        <div className="ml-3 flex-1">
          {a.audioUrl ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playAudio(a.audioUrl, `answer-${q._id}-${a._id || aIndex}`);
              }}
              className={`flex items-center text-left w-full ${
                audioStatus[`answer-${q._id}-${a._id || aIndex}`] === 'playing'
                  ? 'text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {audioStatus[`answer-${q._id}-${a._id || aIndex}`] === 'error' ? (
                <VolumeX className="w-4 h-4 mr-2 text-red-500" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              {audioStatus[`answer-${q._id}-${a._id || aIndex}`] === 'playing'
                ? 'Playing answer...'
                : 'Listen to answer'}
            </button>
          ) : (
            <span className="text-gray-700">{a.text}</span>
          )}
        </div>
      </div>
    </label>
  ))}
</div>



                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="mt-12 text-center">
              <button
                onClick={handleSubmit}
                disabled={submitted || timeLeft === 0 || isLoading}
                className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition ${
                  submitted || timeLeft === 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#172746] hover:bg-blue-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
                    {timeLeft === 0 ? 'Time expired - View results' : 'Submit quiz'}
                  </>
                )}
              </button>
              {timeLeft > 0 && timeLeft < 60 && (
                <div className="mt-4 flex items-center justify-center text-sm text-red-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Warning: only {timeLeft} second{timeLeft > 1 ? 's' : ''} left!</span>
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