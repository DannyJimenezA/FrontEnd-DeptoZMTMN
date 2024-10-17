import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoHomeSharp } from "react-icons/io5";

import { FaTable, FaUser, FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.png';

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  // Función para decodificar el token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  };

  // Función para cargar el usuario desde el token
  const loadUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setIsAuthenticated(true);
        setUserEmail(decoded.email);
        setUserRoles(decoded.roles || []);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  // useEffect para cargar el usuario y manejar cambios en el localStorage
  useEffect(() => {
    loadUserFromToken();

    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        loadUserFromToken();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

import { FaTable, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { jwtDecode } from 'jwt-decode'; // Importación corregida

// El token decodificado debería incluir un array de roles
interface DecodedToken {
  email?: string;  // El campo 'email' es opcional
  roles?: { id: number; name: string }[];  // Array de roles, cada uno con id y nombre
}

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');  // Estado para almacenar el email del usuario
  const [userRoles, setUserRoles] = useState<{ id: number; name: string }[]>([]);  // Estado para almacenar los roles del usuario
  const [userDropdownVisible, setUserDropdownVisible] = useState(false); // Estado para mostrar/ocultar el dropdown del usuario
  const { isAuthenticated, logout } = useAuth(); // Desestructura la autenticación
  const navigate = useNavigate(); // Hook para la navegación


  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  const handleLogout = () => {

    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRoles([]);
    navigate('/');

    logout(); // Llama a la función logout del contexto
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    setUserEmail(''); // Limpiar el estado del email
    setUserRoles([]);  // Limpiar el estado de los roles
    navigate('/'); // Redirigir a la página de inicio
  };

  // Ejecuta cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as DecodedToken;
        console.log("Token decodificado:", decodedToken); // Verificar el token decodificado

        // Establecer el email en el estado si está presente en el token
        if (decodedToken.email) {
          setUserEmail(decodedToken.email);
        }

        // Establecer los roles en el estado si están presentes en el token
        if (decodedToken.roles && decodedToken.roles.length > 0) {
          setUserRoles(decodedToken.roles); // Asignar todos los roles
        } else {
          console.warn("No se encontraron roles en el token.");
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    } else {
      console.warn("No se encontró un token en el localStorage.");
    }
  }, []);

  // Verificar si el usuario tiene un rol específico
  const hasRole = (roleName: string) => {
    return userRoles.some(role => role.name === roleName);

  };

  return (
    <nav className="bg-blue-600 text-white flex items-center justify-between p-4 shadow-md">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <Link to="/" className="flex items-center space-x-1 hover:text-gray-200">
          <IoHomeSharp />
          <span>Inicio</span>
        </Link>
      </div>


      <div className="flex items-center space-x-6">
        {isAuthenticated && userRoles.includes('user') && (
          <div className="relative">
            <button
              className="flex items-center space-x-1 hover:text-gray-200"
              onClick={handleDropdownToggle}
            >
              <FaTable />
              <span>Usuarios</span>
            </button>
            {dropdownVisible && (
              <div className="absolute bg-white text-black rounded shadow-lg mt-2">
                <Link to="/citas-listas" className="block px-4 py-2 hover:bg-gray-200">Agendar una cita</Link>
                <Link to="/concesiones" className="block px-4 py-2 hover:bg-gray-200">Solicitudes Concesión</Link>
                <Link to="/prorroga-concesion" className="block px-4 py-2 hover:bg-gray-200">Prorroga de Concesiones</Link>
                <Link to="/solicitud-expediente" className="block px-4 py-2 hover:bg-gray-200">Solicitud de expediente</Link>

        {/* Mostrar dropdown de usuarios si el usuario tiene el rol 'user' */}
        {isAuthenticated && hasRole('user') && (
          <div className="dropdown">
            <button className="dropdown__toggle" onClick={handleDropdownToggle}>
              <FaTable /> Usuarios
            </button>
            {dropdownVisible && (
              <div className="dropdown__menu">
                <Link to="/citas-listas">Agendar una cita</Link>
                <Link to="/concesiones">Solicitudes Concesión</Link>
                <Link to="/prorroga-concesion">Prórroga de Concesiones</Link>
                <Link to="/solicitud-expediente">Solicitud de expediente</Link>

              </div>
            )}
          </div>
        )}


        {isAuthenticated && userRoles.includes('admin') && (
          <div className="relative">
            <button
              className="flex items-center space-x-1 hover:text-gray-200"
              onClick={handleDropdownToggle}
            >
              <FaTable />
              <span>Admins</span>
            </button>
            {dropdownVisible && (
              <div className="absolute bg-white text-black rounded shadow-lg mt-2">
                <Link to="/TablaSolicitudes" className="block px-4 py-2 hover:bg-gray-200">Tabla de usuarios</Link>
                <Link to="/Panel-Solicitud-Concesion" className="block px-4 py-2 hover:bg-gray-200">Solicitudes</Link>
                <Link to="/Panel-Prorroga-Concesiones" className="block px-4 py-2 hover:bg-gray-200">Prorroga de Concesiones</Link>
                <Link to="/Panel-Citas" className="block px-4 py-2 hover:bg-gray-200">Tabla de citas</Link>
                <Link to="/Panel-Solicitud-Expediente" className="block px-4 py-2 hover:bg-gray-200">Tabla de solicitud expediente</Link>

        {/* Mostrar dropdown de admin si el usuario tiene el rol 'admin' */}
        {isAuthenticated && hasRole('admin') && (
          <div className="dropdown">
            <button className="dropdown__toggle" onClick={handleDropdownToggle}>
              <FaTable /> Admins
            </button>
            {dropdownVisible && (
              <div className="dropdown__menu">
                <Link to="/TablaSolicitudes">Tabla de usuarios</Link>
                <Link to="/Panel-Solicitud-Concesion">Solicitudes Concesión</Link>
                <Link to="/Panel-Prorroga-Concesiones">Prórroga de Concesiones</Link>
                <Link to="/Panel-Citas">Tabla de citas</Link>
                <Link to="/Panel-Solicitud-Expediente">Tabla de solicitud expediente</Link>

              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <div className="relative">
            <FaUserCircle
              className="text-2xl cursor-pointer hover:text-gray-200"
              onClick={handleUserDropdownToggle}
            />
            {userDropdownVisible && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg">
                <div className="block px-4 py-2">{userEmail}</div>
                <div
                  className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </div>
              </div>
            )}
          </div>
        ) : (

          <Link to="/login" className="flex items-center space-x-1 hover:text-gray-200">
            <FaUser />
            <span>Iniciar Sesión</span>
          </Link>

          <Link to="/login"><FaUser /> Iniciar Sesión</Link>

        )}
      </div>
    </nav>
  );
}

export default Navbar;
