import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useParams } from 'react-router-dom';
import '../App.css';

function UserDogs() {

  const token = localStorage.getItem('token');
  const {logout } = useAuth();
  const { user_id } = useParams();

  const [dogs, setDogs] = useState([]);
  

  const fetchDogs = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dogs/${user_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDogs(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      }
      console.error('Error fetching dogs:', error);
    }
  }, [token, logout, user_id]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return (
      <div className="dog-list">
        {dogs.map((dog) => (
          <div key={dog.id} className="dog-item">
            <p>Name: {dog.name}</p>
            <p>Breed: {dog.breed}</p>
            <p>Age: {dog.age}</p>
          </div>
        ))}
      </div>
  );
}

export default UserDogs;
