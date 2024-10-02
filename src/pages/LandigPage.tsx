import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { jwtDecode } from 'jwt-decode'; 

const LandingPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error decodificando el token:', error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Función para manejar clic en un servicio
  const handleServiceClick = (path: string) => {
    if (!isAuthenticated) {
      // Redirigir a la página de login y pasar la ruta solicitada y un mensaje
      navigate('/login', { state: { from: path, message: 'Por favor, inicia sesión para acceder a este servicio.' } });
    } else {
      navigate(path);  // Si está autenticado, permitir la navegación
    }
  };

  return (
    <div className="landing-page">
      {/* Banner con mensaje principal */}
      <div className="banner">
        <h1>Bienvenido al Departamento de Zona Maritimo Terrestre de la Municipalidad de Nicoya</h1>
        <Banner />
      </div>

      {/* Sección de accesos rápidos */}
      <div className="quick-access">
        <h2>Accede a nuestros servicios</h2>
        <div className="services-grid">
          <div className="service-card" onClick={() => handleServiceClick('/citas-listas')}>
            <h3>Citas</h3>
            <p>Solicita tus citas de manera rápida.</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('/concesiones')}>
            <h3>Concesiones</h3>
            <p>Solicita concesiones.</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('/prorroga-concesion')}>
            <h3>Prórroga de Concesión</h3>
            <p>Solicita prórrogas de concesión.</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('/solicitud-expediente')}>
            <h3>Solicitud de Expediente</h3>
            <p>Realiza solicitudes de expediente.</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('/denuncias')}>
            <h3>Denuncias</h3>
            <p>Envía denuncias.</p>
          </div>
          <div className="service-card" onClick={() => handleServiceClick('/uso-precario')}>
            <h3>Uso Precario</h3>
            <p>Realiza solicitudes de uso precario.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
