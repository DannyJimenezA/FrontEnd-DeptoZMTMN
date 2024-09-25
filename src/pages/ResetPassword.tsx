import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token'); // Obtiene el token de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      // Realiza la solicitud de restablecimiento de contraseña con la URL corregida
      const response = await axios.post(`http://localhost:3000/users/reset-password`, {
        token, // Incluye el token en el cuerpo si el backend lo requiere.
        newPassword,
      });
      setMessage(response.data.message);
      navigate('/login'); // Redirigir al login después de cambiar la contraseña
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input 
          type="password"
          placeholder="Confirmar Nueva Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer Contraseña</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
