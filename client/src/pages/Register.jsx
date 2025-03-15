// client/src/pages/Register.js
import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const Register = () => {
  const { themeStyles } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registration successful! You can now login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration error');
    }
  };

  return (
    <div style={{ 
      ...themeStyles, 
      minHeight: '80vh', 
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            ✨
          </div>
          <h2 style={{ 
            color: '#2196F3',
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </h2>
          <p style={{ 
            color: '#666',
            fontSize: '1rem'
          }}>
            Join QuizApp and start your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                ':focus': {
                  outline: 'none',
                  borderColor: '#2196F3'
                }
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                ':focus': {
                  outline: 'none',
                  borderColor: '#2196F3'
                }
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#1976D2',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            Create Account
          </button>
        </form>

        <div style={{ 
          textAlign: 'center',
          marginTop: '1.5rem',
          color: '#666'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login"
            style={{
              color: '#2196F3',
              textDecoration: 'none',
              fontWeight: '500',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;