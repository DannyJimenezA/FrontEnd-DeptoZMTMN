import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // Importar los íconos de react-icons
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import { FaRegUser } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState('');  // Manejar el estado del email
  const [password, setPassword] = useState('');  // Manejar el estado del password
  const [showPassword, setShowPassword] = useState(false);  // Mostrar/ocultar contraseña
  const [error, setError] = useState('');  // Manejar errores
  const navigate = useNavigate();  // Usar para redirigir al usuario
  const location = useLocation();  // Usar para obtener el estado de redirección

  // Obtener el mensaje y la ruta desde el estado de la navegación
  const { state } = location;
  const message = state?.message || '';  // Mensaje pasado desde la redirección

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();  // Evitar que el formulario recargue la página
    setError('');  // Limpiar errores antes de hacer la solicitud

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,  // Enviar el email ingresado
          password,  // Enviar el password ingresado
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Almacenar el token JWT en el localStorage o donde prefieras
      localStorage.setItem('token', data.access_token);

      // Redirigir al usuario después de iniciar sesión correctamente
      navigate('/');
    } catch (error) {
      if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
        setError('Correo o contraseña incorrectos'); // Mensaje de error más amigable para el usuario
      } else {
        setError(error.message); // Otros errores
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>

      {/* Mostrar el mensaje si el usuario fue redirigido desde una página protegida */}
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        
        {/* Campo de correo con icono */}
        <div className="form-group">
          <div className="input-container">
            <FaRegUser className="input-icon" /> {/* Icono del usuario */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Actualizar el estado del email
              placeholder="Correo"
              required
            />
          </div>
        </div>

        {/* Campo de contraseña con icono */}
        <div className="form-group">
          <div className="input-container">
            <FaLock className="input-icon" /> {/* Icono de candado */}
            <input
              type={showPassword ? 'text' : 'password'}  // Cambiar entre texto y contraseña
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Actualizar el estado del password
              placeholder="Contraseña"
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? 'OCULTAR' : 'MOSTRAR'}
            </span>
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Mostrar error si lo hay */}

        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
        <p>
          <Link to="/forgot-password">Olvidaste tu contraseña?</Link>
        </p>
        
        <button type="submit">Iniciar Sesión</button>  {/* Enviar el formulario */}
        <button type="button" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
}

export default Login;
