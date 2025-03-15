// client/src/pages/Home.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <div style={{ ...themeStyles, minHeight: '80vh', padding: '2rem' }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem 0'
      }}>
        <div style={{ 
          fontSize: '4rem',
          marginBottom: '1rem',
          animation: 'bounce 2s infinite'
        }}>
          🎯
        </div>
        
        <h1 style={{ 
          fontSize: '3rem',
          color: '#2196F3',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          Welcome to QuizApp
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem',
          color: '#666',
          maxWidth: '600px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Test your knowledge with our interactive quizzes. Challenge yourself, learn new things, and compete with others!
        </p>

        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <Link 
            to="/quizzes" 
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#2196F3',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#1976D2',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            Start Quiz
          </Link>
          <Link 
            to="/register" 
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#fff',
              color: '#2196F3',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              border: '2px solid #2196F3',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#f5f5f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            Sign Up
          </Link>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginTop: '2rem'
        }}>
          <div style={{ 
            background: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ color: '#2196F3', marginBottom: '0.5rem' }}>Multiple Topics</h3>
            <p style={{ color: '#666' }}>Explore quizzes on various subjects and topics</p>
          </div>

          <div style={{ 
            background: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ color: '#2196F3', marginBottom: '0.5rem' }}>Track Progress</h3>
            <p style={{ color: '#666' }}>Monitor your performance and improve over time</p>
          </div>

          <div style={{ 
            background: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ color: '#2196F3', marginBottom: '0.5rem' }}>Compete</h3>
            <p style={{ color: '#666' }}>Challenge yourself and compete with others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;