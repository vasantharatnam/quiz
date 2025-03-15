// client/src/pages/QuizPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const QuizPage = () => {
  const { themeStyles } = useContext(ThemeContext);
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz) {
    return (
      <div style={{ 
        ...themeStyles, 
        minHeight: '80vh', 
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⌛</div>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // For single or true/false, we store single index
  // For multiple, we store an array of indices
  const handleOptionChange = (optionIndex) => {
    if (currentQuestion.questionType === 'multiple') {
      // Toggle
      const existing = selectedAnswers[currentQuestionIndex] || [];
      if (existing.includes(optionIndex)) {
        // remove
        const updated = existing.filter((v) => v !== optionIndex);
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: updated });
      } else {
        // add
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: [...existing, optionIndex] });
      }
    } else {
      // single or true/false
      setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: optionIndex });
    }
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Submit quiz
      submitQuiz();
    }
  };

  const checkCurrentAnswer = () => {
    // Show correct or incorrect for the current question
    const correctAnswers = currentQuestion.correctAnswers;
    const userAnswer = selectedAnswers[currentQuestionIndex];
    let isCorrect = false;
    if (currentQuestion.questionType === 'multiple') {
      if (Array.isArray(userAnswer) && userAnswer.length === correctAnswers.length) {
        isCorrect = correctAnswers.every((val) => userAnswer.includes(val));
      }
    } else {
      isCorrect = userAnswer === correctAnswers[0];
    }
    setResult(isCorrect ? 'Correct!' : 'Incorrect!');
    setShowResult(true);
  };

  const submitQuiz = async () => {
    // Convert selectedAnswers object into array
    const answersArray = quiz.questions.map((q, idx) => {
      return selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : null;
    });

    try {
      const res = await API.post(`/quiz/${quizId}/submit`, { answers: answersArray });
      setScore(res.data.score);
    } catch (err) {
      console.error(err);
    }
  };

  if (score !== null) {
    // final summary
    return (
      <div style={{ 
        ...themeStyles, 
        minHeight: '80vh', 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{ 
          background: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ 
            color: '#2196F3',
            marginBottom: '1rem',
            fontSize: '2rem'
          }}>Quiz Completed!</h2>
          <div style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#4CAF50',
            marginBottom: '1rem'
          }}>
            {score} / {quiz.questions.length}
          </div>
          <p style={{ color: '#666' }}>
            {score === quiz.questions.length 
              ? 'Perfect score! Amazing job!' 
              : score > quiz.questions.length / 2 
                ? 'Good effort! Keep practicing!' 
                : 'Keep practicing to improve your score!'}
          </p>
        </div>
      </div>
    );
  }

  // Progress bar
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div style={{ ...themeStyles, minHeight: '80vh', padding: '2rem' }}>
      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#2196F3',
          marginBottom: '1rem',
          fontSize: '1.8rem'
        }}>{quiz.title}</h2>
        
        <div style={{ 
          background: '#f5f5f5',
          height: '8px',
          borderRadius: '4px',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: '#2196F3',
            width: `${progress}%`,
            height: '100%',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          color: '#666'
        }}>
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>

        <div style={{ 
          background: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <p style={{ 
            fontSize: '1.2rem',
            marginBottom: '1.5rem',
            color: '#333'
          }}>{currentQuestion.questionText}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.options.map((option, idx) => {
              let checked = false;
              const userAnswer = selectedAnswers[currentQuestionIndex];
              if (currentQuestion.questionType === 'multiple') {
                checked = Array.isArray(userAnswer) && userAnswer.includes(idx);
              } else {
                checked = userAnswer === idx;
              }

              return (
                <label 
                  key={idx}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    background: checked ? '#e3f2fd' : '#fff',
                    border: `2px solid ${checked ? '#2196F3' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      background: '#f5f5f5'
                    }
                  }}
                >
                  <input
                    type={currentQuestion.questionType === 'multiple' ? 'checkbox' : 'radio'}
                    checked={checked}
                    onChange={() => handleOptionChange(idx)}
                    style={{ marginRight: '1rem' }}
                  />
                  <span style={{ color: '#333' }}>{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div style={{ 
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            background: result === 'Correct!' ? '#e8f5e9' : '#ffebee',
            color: result === 'Correct!' ? '#2e7d32' : '#c62828',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {result}
          </div>
        )}

        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}>
          {!showResult ? (
            <button 
              onClick={checkCurrentAnswer}
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.2s',
                ':hover': {
                  background: '#1976D2'
                }
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button 
              onClick={handleNext}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background 0.2s',
                ':hover': {
                  background: '#388E3C'
                }
              }}
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;