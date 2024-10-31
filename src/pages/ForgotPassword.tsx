import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css';
import {  useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/forgot-password', { email });
      setMessage(response.data.message);
      setIsError(false);
    } catch (error) {
      setMessage(error.response.data.message);
      setIsError(true);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Olvidó su Contraseña</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Recuperar Contraseña</button>
        <button type="submit" onClick={() => navigate('/login')}>Volver</button>
      </form>
      {message && (
        <p className={`forgot-password-message ${isError ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
