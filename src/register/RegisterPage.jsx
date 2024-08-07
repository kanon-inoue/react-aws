import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function RegisterPage() {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    image: null,
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/`, formData);
      navigate('/login');
    } catch (error) {
      console.error('Failed to create user:', error.response ? error.response.data : error.message);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  async function base64ConversionForImages(e) {
    if (e.target.files[0]) {
        getBase64(e.target.files[0]);
    }
}

function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setFormData(prevFormData => ({
        ...prevFormData,
        image: reader.result
      }));
    };
    reader.onerror = function (error) {
        console.log('Error', error);
    }
}

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h1>Register</h1>
        <div className="input-group">
          <label htmlFor="first_name">First name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="last_name">Last name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
        <label htmlFor="profileImage">Profile Image</label>
        <input type='file' onChange={e => base64ConversionForImages(e)}/>
        </div>
        <button type="submit" className="register-button">Register</button>
        <button onClick={handleBack} className="btn btn-back">
          <span className="arrow">&#8592;</span>Login
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
