import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../img/logo.png';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Importación nombrada
import { IoHomeSharp } from "react-icons/io5";
import { FaTable, FaUser } from 'react-icons/fa';

// El token decodificado debería incluir un array de roles
interface DecodedToken {
  email?: string;  // El campo 'email' es opcional, en caso de que no siempre esté presente
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
    // Eliminar el token del localStorage y redirigir a la página de inicio de sesión
    localStorage.removeItem('token');
    setUserEmail(''); // Limpiar el estado del email
    setUserRoles([]);  // Limpiar el estado de los roles
    navigate('/'); // Redirigir a la página de login
  };

  // Ejecuta cuando el componente se monta
  useEffect(() => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decodificar el token JWT para obtener los datos del usuario
        const decodedToken = jwtDecode(token) as DecodedToken;  // Cast para indicar la estructura del token
        
        // Verificar si el token decodificado tiene un campo de email y de roles
        if (decodedToken.email) {
          setUserEmail(decodedToken.email);  // Establecer el email en el estado
        }
        
        if (decodedToken.roles) {
          setUserRoles(decodedToken.roles);    // Establecer los roles en el estado
        } else {
          console.warn('El token no contiene un campo de roles.');
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    } else {
      console.warn('No se encontró un token en el localStorage.');
    }
  }, []);  // [] se asegura de que useEffect se ejecute solo una vez cuando el componente se monta

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

        {/* Mostrar los dropdowns si el usuario está logueado */}
        {userEmail && (
          <>
            {/* Dropdown para solicitudes de usuario, visible para todos los usuarios con rol "user" */}
            {(hasRole('user') || hasRole('admin')) && (
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

            {/* Mostrar paneles administrativos solo si el usuario tiene el rol 'admin' */}
            {hasRole('admin') && (
              <div className="dropdown">
                <button className="dropdown__toggle" onClick={handleDropdownToggle}>
                  <FaTable /> Admins
                </button>
                {dropdownVisible && (
                  <div className="dropdown__menu">
                    <Link to="/TablaSolicitudes">Tabla de usuarios</Link>
                    <Link to="/Panel-Solicitud-Concesion">Solicitudes Concesión</Link>
                    <Link to="/Panel-Prorroga-Concesiones">Prorroga de Concesiones</Link>
                    <Link to="/Panel-Citas">Tabla de citas</Link>
                    <Link to="/Panel-Solicitud-Expediente">Tabla de solicitud expediente</Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Mostrar el email del usuario si está logueado con dropdown de opciones */}
        {userEmail ? (
          <div className="navbar__user">
            <div className="navbar__user-email" onClick={handleUserDropdownToggle}>
              {userEmail} {/* Mostrar el correo del usuario logueado */}
            </div>
            {userDropdownVisible && (
              <div className="user-dropdown">
                <Link to="/change-password">Cambiar contraseña</Link> {/* Ruta para cambiar contraseña */}
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
