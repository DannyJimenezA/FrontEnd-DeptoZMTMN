
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import { FaTable, FaUser, FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.png';
import { jwtDecode } from 'jwt-decode'; // Importación corregida
import { useAuth } from '../context/AuthContext'; // Uso de contexto de autenticación


const Navbar: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [adminDropdownVisible, setAdminDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const { isAuthenticated, userEmail, logout } = useAuth(); // Obtener el estado de autenticación desde el contexto

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAdminDropdownToggle = () => {
    setAdminDropdownVisible(!adminDropdownVisible);
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownVisible(!userDropdownVisible); // Mostrar el dropdown del usuario
  };


  const handleLogout = () => {
    logout(); // Ejecuta la función de logout desde el contexto

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
    return userRoles.some((role) => role.name === roleName);

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

        {isAuthenticated && (
          <>
            <div className="relative">
              <button
                className="flex items-center space-x-1 hover:text-gray-200"
                onClick={handleDropdownToggle}
              >
                <FaTable />
                <span>Admin Dashboard</span>
              </button>
              {dropdownVisible && (
                <div className="absolute bg-white text-black rounded shadow-lg mt-2">
                  <Link to="/admin-dashboard" className="block px-4 py-2 hover:bg-gray-200">
                    Ir a Admin Dashboard
                  </Link>
                  {/* Otras opciones del menú */}
                </div>
              )}
            </div>
            <div className="relative">
              <FaUserCircle
                className="text-2xl cursor-pointer hover:text-gray-200"
                onClick={handleUserDropdownToggle}
              />
              {userDropdownVisible && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg">
                  {/* Mostrar el email del usuario */}
                  <div className="block px-4 py-2">{userEmail}</div>
                  {/* Opción para cerrar sesión */}
                  <div
                    className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!isAuthenticated && (

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
