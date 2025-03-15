import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const QuizSelection = () => {
  const { themeStyles } = useContext(ThemeContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get('/quiz');
        if (Array.isArray(res.data)) {
          setQuizzes(res.data);
        } else {
          setQuizzes([]);
          console.error("Unexpected API response:", res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
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
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...themeStyles, minHeight: '80vh', padding: '2rem' }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          marginBottom: '2rem',
          color: '#2196F3',
          borderBottom: '2px solid #2196F3',
          paddingBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>📚</span> Available Quizzes
        </h2>

        {quizzes.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: '3rem',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No Quizzes Available</h3>
            <p style={{ color: '#999' }}>Check back later for new quizzes!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {quizzes.map((quiz) => (
              <div 
                key={quiz._id} 
                className="quiz-card"
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <div style={{ 
                  padding: '1.5rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <h3 style={{ 
                    color: '#2196F3',
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.3rem'
                  }}>
                    {quiz.title}
                  </h3>
                  <p style={{ 
                    color: '#666',
                    margin: 0,
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}>
                    {quiz.description}
                  </p>
                </div>
                
                <div style={{ 
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8f9fa'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    <span>📝</span> {quiz.questionCount} Questions
                  </div>
                  <Link 
                    to={`/quiz/${quiz._id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: '#1976D2'
                      }
                    }}
                  >
                    Take Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSelection;