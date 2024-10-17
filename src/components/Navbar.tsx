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
}

export default Navbar;
