import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../img/logo.png';
import { useState, useEffect } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import { FaTable, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const { isAuthenticated, userEmail, userRoles, logout } = useAuth(); // Desestructura la autenticación

import { jwtDecode }from 'jwt-decode'; // Importación nombrada corregida
import { IoHomeSharp } from "react-icons/io5";
import { FaTable, FaUser } from 'react-icons/fa';

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
  const navigate = useNavigate(); // Hook para la navegación

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/'); // Redirigir a la página de inicio después de cerrar sesión
    // Eliminar el token del localStorage y redirigir a la página de inicio de sesión
    localStorage.removeItem('token');
    setUserEmail(''); // Limpiar el estado del email
    setUserRoles([]);  // Limpiar el estado de los roles
    navigate('/'); // Redirigir a la página de login
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
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar__links">
        <Link to="/"><IoHomeSharp /> Inicio</Link>

        {/* Mostrar dropdown de usuarios si el usuario tiene el rol 'user' */}
        {isAuthenticated && userRoles.includes('user') && (
        {hasRole('user') && (
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

        {/* Mostrar dropdown de admin si el usuario tiene el rol 'admin' */}

        {isAuthenticated && userRoles.includes('admin') && (

        {hasRole('admin') && (
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

        {/* Mostrar el email del usuario si está logueado con dropdown de opciones */}
        {isAuthenticated ? (
          <div className="navbar__user">
            <div className="navbar__user-email" onClick={handleUserDropdownToggle}>
              {userEmail} {/* Mostrar el correo del usuario logueado */}
            </div>
            {userDropdownVisible && (
              <div className="user-dropdown">
                <div onClick={handleLogout}>Cerrar sesión</div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login"><FaUser /> Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
