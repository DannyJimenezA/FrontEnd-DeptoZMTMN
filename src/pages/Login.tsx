import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');  // Manejar el estado del email
  const [password, setPassword] = useState('');  // Manejar el estado del password
  const [error, setError] = useState('');  // Manejar errores
  const navigate = useNavigate();  // Usar para redirigir al usuario

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
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
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Actualizar el estado del email
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Actualizar el estado del password
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Mostrar error si lo hay */}

        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
        <p>
        <Link to ="/forgot-password"> Olvidaste tu contraseña?</Link>

        </p>
        
        <button type="submit">Iniciar Sesión</button>  {/* Enviar el formulario */}
        <button type="button" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
}

export default Login;
