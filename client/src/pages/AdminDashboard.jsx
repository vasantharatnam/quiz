// client/src/pages/AdminDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const AdminDashboard = () => {
  const { themeStyles } = useContext(ThemeContext);
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questions: []
  });
  const [tempQuestion, setTempQuestion] = useState({
    questionText: '',
    questionType: 'single',
    options: [],
    correctAnswers: []
  });
  const [tempOption, setTempOption] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get('/admin/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        await API.delete(`/admin/quiz/${quizId}`);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        alert('Quiz deleted successfully!');
      } catch (err) {
        console.error(err);
        alert('Error deleting quiz');
      }
    }
  };

  const handleAddOption = () => {
    if (tempOption.trim()) {
      setTempQuestion({
        ...tempQuestion,
        options: [...tempQuestion.options, tempOption]
      });
      setTempOption('');
    }
  };

  const handleDeleteOption = (optionIndex) => {
    const updatedOptions = tempQuestion.options.filter((_, idx) => idx !== optionIndex);
    setTempQuestion({
      ...tempQuestion,
      options: updatedOptions,
      correctAnswers: tempQuestion.correctAnswers.filter(idx => idx !== optionIndex)
    });
  };

  const handleAddCorrectAnswer = (optionIndex) => {
    if (tempQuestion.questionType === 'multiple') {
      // toggle
      const correctAnswers = [...tempQuestion.correctAnswers];
      if (correctAnswers.includes(optionIndex)) {
        // remove
        const updated = correctAnswers.filter((idx) => idx !== optionIndex);
        setTempQuestion({ ...tempQuestion, correctAnswers: updated });
      } else {
        // add
        correctAnswers.push(optionIndex);
        setTempQuestion({ ...tempQuestion, correctAnswers });
      }
    } else {
      setTempQuestion({ ...tempQuestion, correctAnswers: [optionIndex] });
    }
  };

  const handleAddQuestion = () => {
    if (!tempQuestion.questionText.trim()) {
      alert('Please enter a question text');
      return;
    }

    // Validate options based on question type
    if (tempQuestion.questionType === 'truefalse') {
      if (tempQuestion.correctAnswers.length === 0) {
        alert('Please select True or False as the correct answer');
        return;
      }
    } else {
      if (tempQuestion.options.length === 0) {
        alert('Please add at least one option');
        return;
      }
      if (tempQuestion.correctAnswers.length === 0) {
        alert('Please select at least one correct answer');
        return;
      }
    }

    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, tempQuestion]
    });
    // reset
    setTempQuestion({
      questionText: '',
      questionType: 'single',
      options: [],
      correctAnswers: []
    });
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = newQuiz.questions.filter((_, idx) => idx !== questionIndex);
    setNewQuiz({
      ...newQuiz,
      questions: updatedQuestions
    });
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (!newQuiz.description.trim()) {
      alert('Please enter a quiz description');
      return;
    }

    if (newQuiz.questions.length === 0 || newQuiz.questions.length === 1) {
      alert('Please add at least two questions to the quiz');
      return;
    }

    try {
      await API.post('/admin/quiz', newQuiz);
      alert('Quiz created successfully!');
      // reset
      setNewQuiz({ title: '', description: '', questions: [] });
    } catch (err) {
      console.error(err);
      alert('Error creating quiz');
    }
  };

  return (
    <div style={{ ...themeStyles, minHeight: '80vh', padding: '2rem' }}>
      <h2 style={{ 
        marginBottom: '2rem',
        color: '#2196F3',
        borderBottom: '2px solid #2196F3',
        paddingBottom: '0.5rem'
      }}>
        Admin Dashboard
      </h2>

      {/* Existing Quizzes Section */}
      <section style={{ 
        marginBottom: '3rem',
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          color: '#333',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>📚</span> Existing Quizzes
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {quizzes.map((quiz) => (
            <div 
              key={quiz._id}
              style={{
                border: '1px solid #e0e0e0',
                padding: '1.5rem',
                borderRadius: '8px',
                position: 'relative',
                background: '#fff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  ':hover': {
                    background: '#ff0000'
                  }
                }}
              >
                Delete Quiz
              </button>
              <h4 style={{ 
                color: '#2196F3',
                marginBottom: '0.5rem',
                fontSize: '1.2rem'
              }}>
                {quiz.title}
              </h4>
              <p style={{ 
                color: '#666',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {quiz.description}
              </p>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                <span>📝 {quiz.questions.length} Questions</span>
                <span>📅 Created: {new Date(quiz.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create New Quiz Section */}
      <section style={{ 
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          color: '#333',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>➕</span> Create New Quiz
        </h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Title: </label>
          <input
            type="text"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Description: </label>
          <input
            type="text"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <hr style={{ margin: '2rem 0' }} />

        <h4 style={{ 
          color: '#333',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>❓</span> Add Question
        </h4>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Question Text: </label>
          <input
            type="text"
            value={tempQuestion.questionText}
            onChange={(e) => setTempQuestion({ ...tempQuestion, questionText: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Question Type: </label>
          <select
            value={tempQuestion.questionType}
            onChange={(e) => setTempQuestion({ ...tempQuestion, questionType: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="truefalse">True/False</option>
          </select>
        </div>

        {/* Options */}
        {tempQuestion.questionType !== 'truefalse' ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Option: </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={tempOption}
                onChange={(e) => setTempOption(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              <button 
                onClick={handleAddOption}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Add Option
              </button>
            </div>
            <div>
              {tempQuestion.options.map((opt, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#f5f5f5',
                    borderRadius: '4px'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type={tempQuestion.questionType === 'multiple' ? 'checkbox' : 'radio'}
                      checked={tempQuestion.correctAnswers.includes(idx)}
                      onChange={() => handleAddCorrectAnswer(idx)}
                    />
                    {opt}
                  </label>
                  <button 
                    onClick={() => handleDeleteOption(idx)}
                    style={{ 
                      background: '#ff4444', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Correct Answer: </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  checked={tempQuestion.correctAnswers[0] === 0}
                  onChange={() => handleAddCorrectAnswer(0)}
                />
                True
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  checked={tempQuestion.correctAnswers[0] === 1}
                  onChange={() => handleAddCorrectAnswer(1)}
                />
                False
              </label>
            </div>
          </div>
        )}

        <button 
          onClick={handleAddQuestion}
          style={{ 
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
        >
          Add Question to Quiz
        </button>

        {/* Display Added Questions */}
        {newQuiz.questions.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ 
              color: '#333',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📋</span> Added Questions
            </h4>
            {newQuiz.questions.map((question, qIdx) => (
              <div 
                key={qIdx} 
                style={{ 
                  border: '1px solid #e0e0e0', 
                  padding: '1.5rem', 
                  marginTop: '1rem', 
                  borderRadius: '8px',
                  position: 'relative',
                  background: '#f9f9f9'
                }}
              >
                <button 
                  onClick={() => handleDeleteQuestion(qIdx)}
                  style={{ 
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete Question
                </button>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#2196F3' }}>Question {qIdx + 1}:</strong> {question.questionText}
                </p>
                <p style={{ marginBottom: '0.5rem', color: '#666' }}>
                  <strong>Type:</strong> {question.questionType}
                </p>
                {question.questionType !== 'truefalse' ? (
                  <div>
                    <strong style={{ color: '#666' }}>Options:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      {question.options.map((opt, optIdx) => (
                        <li key={optIdx} style={{ marginBottom: '0.25rem' }}>
                          {opt} {question.correctAnswers.includes(optIdx) && 
                            <span style={{ color: '#4CAF50', marginLeft: '0.5rem' }}>✓ Correct</span>
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>
                    <strong style={{ color: '#666' }}>Correct Answer:</strong>{' '}
                    <span style={{ color: '#4CAF50' }}>
                      {question.correctAnswers[0] === 0 ? 'True' : 'False'}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <hr style={{ margin: '2rem 0' }} />
        
        <button 
          onClick={handleCreateQuiz}
          style={{ 
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
        >
          Create Quiz
        </button>
      </section>
    </div>
  );
};

export default AdminDashboard;