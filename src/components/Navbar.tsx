import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import { FaTable, FaUser, FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.png';
import { useAuth } from '../context/AuthContext'; // Usar el contexto de autenticación

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
                <span>Opciones</span>
              </button>
              {dropdownVisible && (
                <div className="absolute bg-white text-black rounded shadow-lg mt-2">
                  <Link to="/citas-listas" className="block px-4 py-2 hover:bg-gray-200">
                    Agendar una cita
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
