import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import Footer from '../components/Footer';  // Importamos el nuevo componente Footer
import Banner from '../components/Banner';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Banner con mensaje principal */}
      <div className="banner">
        <h1>Bienvenido al Departamento de Zona Maritimo Terrestre de la Municipalidad de Nicoya</h1>
 
      <Banner/>
      </div>

      {/* Sección de accesos rápidos */}
      <div className="quick-access">
        <h2>Accede a nuestros servicios</h2>
        <div className="services-grid">
          <Link to="/citas-listas" className="service-card">
            <h3>Citas</h3>
            <p>Solicita tus citas de manera rápida.</p>
          </Link>
          <Link to="/concesiones" className="service-card">
            <h3>Concesiones</h3>
            <p>Solicita concesiones.</p>
          </Link>
          <Link to="/prorroga-concesion" className="service-card">
            <h3>Prórroga de Concesión</h3>
            <p>Solicita prórrogas de concesión.</p>
          </Link>
          <Link to="/solicitud-expediente" className="service-card">
            <h3>Solicitud de Expediente</h3>
            <p>Realiza solicitudes de expediente.</p>
          </Link>
          <Link to="/denuncias" className="service-card">
            <h3>Denuncias</h3>
            <p>Envía denuncias .</p>
          </Link>
          <Link to="/uso-precario" className="service-card">
            <h3>Uso Precario</h3>
            <p>Realiza solicitudes de uso precario.</p>
          </Link>
        </div>
      </div>

      <Footer /> 
    </div>
  );
};

export default LandingPage;
