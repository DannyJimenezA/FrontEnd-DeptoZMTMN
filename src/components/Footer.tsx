import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'; 
import '../styles/Footer.css';
import { TbWorld } from "react-icons/tb";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <h2>Síguenos en nuestras redes sociales</h2>
      <p>Conéctate con nosotros a través de nuestras redes sociales y canales de contacto:</p>
      <div className="social-links">
        {/* Facebook */}
        <a href="https://www.facebook.com/alcaldia.denicoya" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaFacebook />
        </a>
        {/* Instagram */}
        <a href="https://www.nicoya.go.cr" target="_blank" rel="noopener noreferrer" className="social-icon">
        <TbWorld />
        </a>
        {/* WhatsApp */}
        <a href="https://wa.me/26858700" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaWhatsapp />
        </a>
        {/* Gmail */}
        <a href="https://www.instagram.com/municipalidadnicoya/" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaInstagram />
        </a>
      </div>
    </div>
  );
};

export default Footer;
