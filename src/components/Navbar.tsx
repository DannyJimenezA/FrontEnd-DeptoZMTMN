import { Link, useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import { FaTable, FaUser, FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.png';
import {jwtDecode} from 'jwt-decode'; // Importación corregida
import { useAuth } from '../context/AuthContext'; // Uso de contexto de autenticación

import '../styles/Navbar.css';
import logo from '../img/logo.png';
import { useState } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import { FaTable, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación


// Definición de la interfaz para el token decodificado
interface DecodedToken {
  email?: string;
  roles?: { id: number; name: string }[];
}

const Navbar: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRoles, setUserRoles] = useState<{ id: number; name: string }[]>([]);
  const { isAuthenticated, logout } = useAuth(); // Usar autenticación desde el contexto
  const navigate = useNavigate();

  // Función para alternar la visibilidad del dropdown de roles
  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Función para alternar la visibilidad del dropdown de usuario
  const handleUserDropdownToggle = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  // Función de cierre de sesión
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    setUserEmail(''); // Limpiar el estado del email
    setUserRoles([]); // Limpiar el estado de los roles
    navigate('/'); // Redirigir a la página de inicio
  };

  // useEffect para cargar los datos del usuario desde el token JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as DecodedToken;
        console.log('Token decodificado:', decodedToken);

        // Establecer el email y roles si están presentes en el token
        if (decodedToken.email) setUserEmail(decodedToken.email);
        if (decodedToken.roles && decodedToken.roles.length > 0) {
          setUserRoles(decodedToken.roles);
        } else {
          console.warn('No se encontraron roles en el token.');
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    } else {
      console.warn('No se encontró un token en el localStorage.');
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
        {/* Mostrar dropdown de usuarios si el usuario tiene el rol 'user' */}
        {isAuthenticated && hasRole('user') && (
          <div className="relative">
            <button className="flex items-center space-x-1 hover:text-gray-200" onClick={handleDropdownToggle}>
              <FaTable />
              <span>Usuarios</span>
            </button>
            {dropdownVisible && (
              <div className="absolute bg-white text-black rounded shadow-lg mt-2">
                <Link to="/citas-listas" className="block px-4 py-2 hover:bg-gray-200">Agendar una cita</Link>
                <Link to="/concesiones" className="block px-4 py-2 hover:bg-gray-200">Solicitudes Concesión</Link>
                <Link to="/prorroga-concesion" className="block px-4 py-2 hover:bg-gray-200">Prórroga de Concesiones</Link>
                <Link to="/solicitud-expediente" className="block px-4 py-2 hover:bg-gray-200">Solicitud de expediente</Link>
              </div>
            )}
          </div>
        )}

        {/* Mostrar dropdown de admin si el usuario tiene el rol 'admin' */}
        {isAuthenticated && hasRole('admin') && (
          <div className="relative">
            <button className="flex items-center space-x-1 hover:text-gray-200" onClick={handleDropdownToggle}>
              <FaTable />
              <span>Admins</span>
            </button>
            {dropdownVisible && (

              <div className="absolute bg-white text-black rounded shadow-lg mt-2">
                <Link to="/TablaSolicitudes" className="block px-4 py-2 hover:bg-gray-200">Tabla de usuarios</Link>
                <Link to="/Panel-Solicitud-Concesion" className="block px-4 py-2 hover:bg-gray-200">Solicitudes Concesión</Link>
                <Link to="/Panel-Prorroga-Concesiones" className="block px-4 py-2 hover:bg-gray-200">Prórroga de Concesiones</Link>
                <Link to="/Panel-Citas" className="block px-4 py-2 hover:bg-gray-200">Tabla de citas</Link>
                <Link to="/Panel-Solicitud-Expediente" className="block px-4 py-2 hover:bg-gray-200">Tabla de solicitud expediente</Link>

              <div className="dropdown__menu">
                <Link to="/TablaSolicitudes">Tabla de usuarios</Link>
                <Link to="/Panel-Solicitud-Concesion">Solicitudes Concesión</Link>
                <Link to="/Panel-Prorroga-Concesiones">Prorroga de Concesiones</Link>
                <Link to="/Panel-Citas">Tabla de citas</Link>
                <Link to="/Panel-Solicitud-Expediente">Tabla de solicitud expediente</Link>
                {/* Añadir la nueva opción de Denuncias */}
                <Link to="/admin/denuncias">Gestión de Denuncias</Link> {/* Nueva opción */}
                {/* Añadir la nueva opción de Revisión de Plano */}
                <Link to="/admin/revision-plano">Gestión de Revisión de Plano</Link> {/* Nueva opción */}

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
        )}
      </div>
    </nav>
  );
};

export default Navbar;

