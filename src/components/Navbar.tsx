import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../img/logo.png';

function Navbar() {
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
      </div>
      <div className="navbar__search">
      <button type="button"><Link to="/login">Iniciar Sesion</Link></button>
      </div>
    </nav>
  );
};

export default Navbar;
