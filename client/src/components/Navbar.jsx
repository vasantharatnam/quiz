// client/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (active) => ({
    color: '#FFF',
    textDecoration: 'none',
    marginRight: '1.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    opacity: active ? 1 : 0.8,
    ':hover': {
      opacity: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '::after': active ? {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '20px',
      height: '2px',
      backgroundColor: '#FFF',
      borderRadius: '2px',
    } : {},
  });

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFF',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginLeft: '1rem',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  };

  return (
    <nav
      style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#6200EE' : '#3700B3',
        color: '#FFF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Link 
          to="/" 
          style={{
            ...navLinkStyle(isActive('/')),
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🎯</span> QuizApp
        </Link>
        <Link to="/quizzes" style={navLinkStyle(isActive('/quizzes'))}>
          Quizzes
        </Link>
        {user && user.isAdmin && (
          <>
            <Link to="/leaderboard" style={navLinkStyle(isActive('/leaderboard'))}>
              Leaderboard
            </Link>
            <Link to="/admin" style={navLinkStyle(isActive('/admin'))}>
              Admin
            </Link>
          </>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button 
          onClick={toggleTheme} 
          style={{
            ...buttonStyle,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        {user ? (
          <>
            <span style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              👤 {user.username}
            </span>
            <button 
              onClick={logout}
              style={{
                ...buttonStyle,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{
                ...buttonStyle,
                textDecoration: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                ...buttonStyle,
                textDecoration: 'none',
                backgroundColor: '#FFF',
                color: theme === 'light' ? '#6200EE' : '#3700B3',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;