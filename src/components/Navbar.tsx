import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../img/logo.png';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Importación nombrada

interface DecodedToken {
  email?: string;  // El campo 'email' es opcional, en caso de que no siempre esté presente
}


function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');  // Estado para almacenar el email del usuario

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Ejecuta cuando el componente se monta
  useEffect(() => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Verificar si el token es una cadena válida
        if (typeof token !== 'string' || token.trim() === '') {
          throw new Error('Token no válido');
        }

        // Decodificar el token JWT para obtener los datos del usuario
        const decodedToken = jwtDecode(token) as DecodedToken;  // Cast para indicar la estructura del token
        
        // Verificar si el token decodificado tiene un campo de email
        if (decodedToken.email) {
          setUserEmail(decodedToken.email);  // Establecer el email en el estado
        } else {
          console.warn('El token no contiene un campo de email.');
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    } else {
      console.warn('No se encontró un token en el localStorage.');
    }
  }, []);  // [] se asegura de que useEffect se ejecute solo una vez cuando el componente se monta

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar__links">
          {/* Mostrar el email del usuario si está logueado */}
          {userEmail && (
            <div className="navbar__welcome">
              Bienvenido, {userEmail}
            </div>
        )}
        <Link to="/">Inicio</Link>
        <Link to="/citas-Listas">Citas</Link>
        <Link to="/concesiones">Concesiones</Link>
        <Link to="/prorroga-concesion">Prórroga de Concesión</Link>
        <Link to="/solicitud-expediente">Solicitud Expediente</Link>
        <Link to="/denuncias">Denuncias</Link>
        <Link to="/uso-precario">Uso Precario</Link>

        {/* Dropdown para paneles y tablas */}
        <div className="dropdown">
          <button className="dropdown__toggle" onClick={handleDropdownToggle}>
            Paneles y Tablas
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
      </div>
      
    </nav>
  );
}

export default Navbar;
