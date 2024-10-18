
import React, { useState } from 'react';
import { Bell, Search, User, Home, BarChart2, Users, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaRegUser } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode'; // Importa jwt-decode para decodificar el token
import '../styles/Login.css';
import image from "../img/WhatsApp Image 2024-09-13 at 6.05.23 PM.jpeg";

// Interfaz para el token decodificado
interface DecodedToken {
  roles: string[];
}

import { useState } from 'react';

import { FaUser, FaLock } from 'react-icons/fa'; // Importar los íconos de react-icons
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Link, useNavigate, useLocation } from 'react-router-dom'; // Combina todas las importaciones de react-router-dom aquí
import { FaLock, FaRegUser } from 'react-icons/fa'; // Combina los íconos de react-icons

import '../styles/Login.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;
  const message = state?.message || '';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Almacena el token en localStorage
      localStorage.setItem('token', data.access_token);

      // Decodifica el token para verificar el rol
      const decodedToken: DecodedToken = jwtDecode(data.access_token);

      // Verifica si el usuario tiene el rol de admin
      if (decodedToken.roles.includes('admin')) {
        navigate('/admin-dashboard'); // Redirige al Admin Dashboard
      } else {
        navigate('/'); // Redirige a la página principal para otros roles
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
          setError('Correo o contraseña incorrectos');
        } else {
          setError(error.message);
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 w-full h-full">
        <img src={image} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white bg-opacity-60 backdrop-blur-md rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Inicio de Sesión</h2>

        {message && <p className="text-blue-600 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <p className="text-center">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
          </p>
          <p className="text-center">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">Olvidaste tu contraseña?</Link>
          </p>

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
