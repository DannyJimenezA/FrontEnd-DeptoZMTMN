import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../img/logo.png';
import { useState } from 'react';

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar__links">
        <Link to="/">Inicio</Link>
        <Link to="/citas-audiencias">Citas / Audiencias</Link>
        <Link to="/solicitud-expediente">Solicitud Expediente</Link>
        <Link to="/denuncias">Denuncias</Link>
        <Link to="/concesiones">Concesiones</Link>
        <Link to="/uso-precario">Uso Precario</Link>
        <Link to="/prorroga-concesion">Prórroga de Concesión</Link>

        {/* Dropdown para paneles y tablas */}
        <div className="dropdown">
          <button className="dropdown__toggle" onClick={handleDropdownToggle}>
            Paneles y Tablas
          </button>
          {dropdownVisible && (
            <div className="dropdown__menu">
              {/* <Link to="/Panel-Citas">Tabla Citas</Link> */}
              {/* <Link to="/Panel-Denuncias">Tabla Denuncias</Link> */}
              <Link to="/Panel-Solicitud-Concesion">Solicitudes Concesión</Link>
              <Link to="/TablaSolicitudes">Tabla de Solicitudes</Link>
              <Link to="/TablaSolicitudes1">Tabla de Concesiones</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
