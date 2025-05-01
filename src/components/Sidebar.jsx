import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaArrowRight, FaArrowLeft, FaChartBar, FaCog } from 'react-icons/fa';
import '../styles/Sidebar.css'; 

const Sidebar = () => {
  const activeClass = "sidebar-link-active";
  const inactiveClass = "sidebar-link";

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
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">&copy; {new Date().getFullYear()} - Sistema de Estacionamiento</p>
      </div>
    </aside>
  );
};

export default Sidebar;
