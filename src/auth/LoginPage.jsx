import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../App.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/posts');
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    login(username, password)
  };

  const handleBack = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Login</h1>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="password"
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
        <button onClick={handleBack} className="btn btn-back">
          <span>Register</span>
        </button>
      </form>

    </div>
  );
}

export default LoginPage;
