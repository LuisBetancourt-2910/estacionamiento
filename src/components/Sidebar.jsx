import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowRight, FaArrowLeft, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const activeClass = "sidebar-link-active";
  const inactiveClass = "sidebar-link";

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    navigate('/login');               // Redirige al login
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Sistema de Estacionamiento</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass} end>
            <FaHome className="icon" />
            Dashboard
          </NavLink>
          <NavLink to="/entrada" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaArrowRight className="icon" />
            Registrar Entrada
          </NavLink>
          <NavLink to="/salida" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaArrowLeft className="icon" />
            Registrar Salida
          </NavLink>
          <NavLink to="/reportes" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaChartBar className="icon" />
            Reportes
          </NavLink>
          <NavLink to="/configuracion" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaCog className="icon" />
            Configuración
          </NavLink>

          {/* Botón de cerrar sesión */}
          <button className="sidebar-link logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            Cerrar sesión
          </button>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">&copy; {new Date().getFullYear()} - Sistema de Estacionamiento</p>
      </div>
    </aside>
  );
};

export default Sidebar;
