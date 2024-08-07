import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/token/`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.status !== 200) {
        throw new Error('Login failed')
      }
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_image', response.data.image);
      navigate('/posts');
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_image');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);