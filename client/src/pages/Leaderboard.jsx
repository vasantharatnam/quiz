// client/src/pages/Leaderboard.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const Leaderboard = () => {
  const { themeStyles } = useContext(ThemeContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState({});
  const [selectedQuiz, setSelectedQuiz] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaderboard data
        const leaderboardRes = await API.get('/admin/leaderboard');
        setLeaderboard(leaderboardRes.data);
        setFilteredLeaderboard(leaderboardRes.data);

        // Fetch all quizzes to get their names
        const quizzesRes = await API.get('/quiz');
        const quizMap = {};
        quizzesRes.data.forEach(quiz => {
          quizMap[quiz._id] = quiz.title;
        });
        setQuizzes(quizMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedQuiz === 'all') {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter(item => item.quizId === selectedQuiz);
      setFilteredLeaderboard(filtered);
    }
  }, [selectedQuiz, leaderboard]);

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
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Get unique quiz IDs for the filter dropdown
  const uniqueQuizIds = [...new Set(leaderboard.map(item => item.quizId))];

  return (
    <div style={{ ...themeStyles, minHeight: '80vh', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          color: '#2196F3',
          borderBottom: '2px solid #2196F3',
          paddingBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: 0
        }}>
          <span>🏆</span> Leaderboard
        </h2>

        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <label style={{ 
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Filter by Quiz:
          </label>
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#fff',
              color: '#333',
              fontSize: '0.9rem',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              ':hover': {
                borderColor: '#2196F3'
              }
            }}
          >
            <option value="all">All Quizzes</option>
            {uniqueQuizIds.map(quizId => (
              <option key={quizId} value={quizId}>
                {quizzes[quizId] || 'Unknown Quiz'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ 
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredLeaderboard.map((item, idx) => (
            <div 
              key={idx}
              style={{
                border: '1px solid #e0e0e0',
                padding: '1.5rem',
                borderRadius: '8px',
                background: '#f9f9f9',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ 
                  color: '#2196F3',
                  margin: 0,
                  fontSize: '1.2rem'
                }}>
                  {item.username}
                </h3>
                <span style={{ 
                  background: '#e3f2fd',
                  color: '#2196F3',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  Rank #{idx + 1}
                </span>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Score</div>
                  <div style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#4CAF50'
                  }}>
                    {item.score}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Total</div>
                  <div style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#666'
                  }}>
                    {item.total}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>📝</span> Quiz: {quizzes[item.quizId] || 'Unknown Quiz'}
                </div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>⏰</span> Attempted: {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;