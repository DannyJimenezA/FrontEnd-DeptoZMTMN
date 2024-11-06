// import { useState } from 'react';
// import axios from 'axios';
// import '../styles/ForgotPassword.css';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../components/ApiRoutes';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${ApiRoutes.usuarios.usuariosbase}/status/forgot-password`, { email });
//       setMessage(response.data.message);
//       setIsError(false);
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         setMessage(error.response.data.message);
//       } else {
//         setMessage('Error inesperado. Por favor, intente nuevamente.');
//       }
//       setIsError(true);
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       <h2>Olvidó su Contraseña</h2>
//       <form className="forgot-password-form" onSubmit={handleSubmit}>
//         <input 
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           required
//         />
//         <button type="submit">Recuperar Contraseña</button>
//         <button type="button" onClick={() => navigate('/login')}>Volver</button>
//       </form>
//       {message && (
//         <p className={`forgot-password-message ${isError ? 'error' : 'success'}`}>
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;

import { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../components/ApiRoutes';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Define el origen específico para este frontend de usuarios
  const origin = "user"; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Enviar solicitud de recuperación de contraseña con el parámetro `origin`
      const response = await axios.post(`${ApiRoutes.usuarios.usuariosbase}/status/forgot-password`, { email, origin });
      setMessage(response.data.message);
      setIsError(false);
    } catch (error) {
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error inesperado. Por favor, intente nuevamente.');
      }
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
          placeholder="Ingrese su correo electrónico"
          required
        />
        <button type="submit">Recuperar Contraseña</button>
        <button type="button" onClick={() => navigate('/login')}>Volver</button>
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
