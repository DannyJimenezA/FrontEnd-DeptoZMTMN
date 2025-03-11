import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Image from "../img/IMG05.jpg"; // Importa la imagen
import ApiRoutes from '../components/ApiRoutes';
import '../styles/Register.css'

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
      const response = await fetch(`${ApiRoutes.urlBase}/users/register`, {
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
          origin: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      // Mostrar alerta de confirmación de registro exitoso
      window.alert(
        'Usuario registrado exitosamente. Por favor, revisa tu correo electrónico para verificar tu cuenta.'
      );

      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${Image})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-120">
        <h2 className="text-2xl text-center mb-6">Registro de Usuario</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="flex flex-col">
              <label htmlFor="nombre" className="text-sm font-semibold mb-2">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg h-14 text-black"
              />
            </div>
  
            {/* Primer Apellido */}
            <div className="flex flex-col">
              <label htmlFor="apellido1" className="text-sm font-semibold mb-2">Primer Apellido</label>
              <input
                type="text"
                id="apellido1"
                value={apellido1}
                onChange={(e) => setApellido1(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg h-14 text-black"
              />
            </div>
  
            {/* Segundo Apellido */}
            <div className="flex flex-col">
              <label htmlFor="apellido2" className="text-sm font-semibold mb-2">Segundo Apellido</label>
              <input
                type="text"
                id="apellido2"
                value={apellido2}
                onChange={(e) => setApellido2(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg h-14 text-black"
              />
            </div>
  
            {/* Teléfono */}
            <div className="flex flex-col">
              <label htmlFor="telefono" className="text-sm font-semibold mb-2">Teléfono</label>
              <input
                type="text"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg h-14 text-black"
              />
            </div>
  
            {/* Cédula */}
            <div className="flex flex-col">
              <label htmlFor="cedula" className="text-sm font-semibold mb-2">Cédula</label>
              <input
                type="text"
                id="cedula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg h-14 text-black"
              />
            </div>
  
            {/* Correo */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold mb-2">Correo</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg h-14 text-black"
              />
            </div>
  
            {/* Contraseña */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg h-14 text-black"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>
  
            {/* Confirmar Contraseña */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-sm font-semibold mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg h-14 text-black"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>
          </div>
  
          {/* Mensaje de error */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
  
          {/* Botones de Registrarse y Cancelar */}
          <div className="flex justify-between mt-8">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Registrarse
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-1/2 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition duration-300 ml-4"
            >
              Cancelar
            </button>
          </div>
          {/* Enlace para iniciar sesión */}
          <p className="text-center text-sm mt-6">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-500 hover:underline">Inicia sesión aquí</Link>
          </p>
  
        </form>
      </div>
    </div>
  );  
}

export default Register;
