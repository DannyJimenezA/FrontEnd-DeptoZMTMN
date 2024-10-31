import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import '../styles/ResetPassword.css';

interface ErrorResponse {
  message: string;
}

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token'); // Obtiene el token de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el botón de envío
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica que el token esté presente en la URL
    if (!token) {
      setMessage('Token de restablecimiento no válido o faltante.');
      console.warn('No se encontró un token de restablecimiento en la URL.');
    }
  }, [token]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.');
      return;
    }

    setIsSubmitting(true); // Desactiva el botón mientras se envía la solicitud

    try {
      const response = await axios.post(`http://localhost:3000/users/reset-password`, {
        token, // Incluye el token en el cuerpo si el backend lo requiere
        newPassword,
      });
      setMessage(response.data.message);
      navigate('/login'); // Redirigir al login después de cambiar la contraseña
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>; // Asignamos un tipo específico a `err`
      if (err.response && err.response.data) {
        setMessage(err.response.data.message || 'Error al restablecer la contraseña');
      } else {
        setMessage('No se pudo conectar con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setIsSubmitting(false); // Reactiva el botón al finalizar la solicitud
    }
  };

  return (
    <div className="reset-password-container">
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
        <button type="submit" disabled={isSubmitting || !token}> 
          {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
        </button>
        <button type="button" onClick={() => navigate('/login')}>Volver</button>
        {message && <p className={`message ${message.includes('exito') ? 'success' : ''}`}>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
