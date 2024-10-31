import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import '../styles/Register.css';

function Register() {
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Alternar visibilidad de las contraseñas
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Verificar que las contraseñas coincidan
    if (password.trim() !== confirmPassword.trim()) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido1,
          apellido2,
          telefono,
          cedula,
          email,
          password: password.trim(),
          confirmPassword: confirmPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      // Mostrar alerta de confirmación de registro exitoso
      window.alert('Usuario registrado exitosamente. Por favor, revisa tu correo electrónico para verificar tu cuenta.');

      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  // Mueve el `return` fuera del `try-catch`
  return (
    <div className="login-container">
      <h2>Registro de Usuario</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido1">Primer Apellido</label>
          <input
            type="text"
            id="apellido1"
            value={apellido1}
            onChange={(e) => setApellido1(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido2">Segundo Apellido</label>
          <input
            type="text"
            id="apellido2"
            value={apellido2}
            onChange={(e) => setApellido2(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cedula">Cédula</label>
          <input
            type="text"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>

        {/* Campo de confirmación de contraseña */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>

        <button type="submit">Registrarse</button>
        <button type="button" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
}

export default Register;
