import React from 'react';
import '../styles/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Sistema de Estacionamiento - Todos los derechos reservados
        </p>
        <p className="footer-version">Versión 1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
