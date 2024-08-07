import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import '../App.css';

function DogsAccount() {
const token = localStorage.getItem('token');
const {logout } = useAuth();

  const [dogs, setDogs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: ''
  });

  const fetchDogs = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dogs/userdogs/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDogs(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      }
      console.error('Error fetching dogs:', error);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/dogs/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }  // Include the Authorization header
      });
      fetchDogs(); 
      setFormData({ name: '', breed: '', age: '' }); // Clear the form
    } catch (error) {
      if (error.response.status === 401) {
        logout()
      }
      console.error('Error creating new post:', error);
    }
  };

  const handleDelete = async (dogId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/dogs/${dogId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDogs();
    } catch (error) {
      if (error.response.status === 401) {
        logout()
      }
      console.error('Error creating new post:', error);
    }
  };

  return (
    <div className="account-container">
      <form onSubmit={handleSubmit} className="dog-form">
        <h2>Register a New Dog</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          placeholder="Breed"
          required
        />
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <button type="submit">Complete Registration</button>
      </form>

      <hr className='separator'/>
      
      <div className="dog-list">
        {dogs.map((dog) => (
          <div key={dog.id} className="dog-item">
            <p>Name: {dog.name}</p>
            <p>Breed: {dog.breed}</p>
            <p>Age: {dog.age}</p>
            <button onClick={() => handleDelete(dog.id)} className="delete-button">X</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DogsAccount;
