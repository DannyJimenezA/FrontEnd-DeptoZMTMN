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
          <div className="dropdown">
            <button className="dropdown__toggle" onClick={handleDropdownToggle}>
              <FaTable /> Usuarios
            </button>
            {dropdownVisible && (
              <div className="dropdown__menu">
                <Link to="/citas-listas">Agendar una cita</Link>
                <Link to="/concesiones">Solicitudes Concesión</Link>
                <Link to="/prorroga-concesion">Prorroga de Concesiones</Link>
                <Link to="/solicitud-expediente">Solicitud de expediente</Link>
              </div>
            )}
          </div>
        )}

        {/* Mostrar dropdown de admin si el usuario tiene el rol 'admin' */}
        {isAuthenticated && userRoles.includes('admin') && (
          <div className="dropdown">
            <button className="dropdown__toggle" onClick={handleDropdownToggle}>
              <FaTable /> Admins
            </button>
            {dropdownVisible && (
              <div className="dropdown__menu">
                <Link to="/TablaSolicitudes">Tabla de usuarios</Link>
                <Link to="/Panel-Solicitud-Concesion">Solicitudes Concesión</Link>
                {/* <Link to="/Panel-Prorroga-Concesiones">Prorroga de Concesiones</Link> */}
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
          <Link to="/login"><FaUser /> Iniciar Sesion</Link>
        )}
      </div>
    </nav>
  );
}


export default Navbar;