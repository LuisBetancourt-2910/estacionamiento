import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaMoneyBillWave, FaClipboardList, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { obtenerVehiculos } from '../services/registroService';
import { VehicleContext } from '../context/VehicleContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { vehicles: contextVehicles } = useContext(VehicleContext); // Datos del contexto
  const [vehicles, setVehicles] = useState([]); // Datos del backend
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [todaysEntries, setTodaysEntries] = useState(0);
  const [todaysExitedVehicles, setTodaysExitedVehicles] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await obtenerVehiculos();
        setVehicles(data);

        // Calcular estadísticas
        const today = new Date();
        const isToday = (dateStr) => {
          const date = new Date(dateStr);
          return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );
        };

        const entriesToday = data.filter(v => isToday(v.HoraEntrada));
        const exitsToday = data.filter(v => v.HoraSalida && isToday(v.HoraSalida));
        const revenueToday = exitsToday.reduce((total, v) => total + (v.Tarifa || 0), 0);

        setTodaysEntries(entriesToday.length);
        setTodaysExitedVehicles(exitsToday.length);
        setTodaysRevenue(revenueToday);
      } catch (error) {
        console.error('Error al obtener los vehículos:', error);
      }
    };

    fetchVehicles();
  }, []);

  // Combinar datos del contexto y del backend
  const activeVehicles = vehicles.filter(v => !v.HoraSalida);
  const lastEntries = [...contextVehicles].reverse().slice(0, 5);

  const typeCounts = {
    official: 0,
    resident: 0,
    noResident: 0,
  };

  activeVehicles.forEach(vehicle => {
    typeCounts[vehicle.Tipo] = (typeCounts[vehicle.Tipo] || 0) + 1;
  });

  const totalActive = activeVehicles.length;

  const typeTranslations = {
    official: 'Oficial',
    resident: 'Residente',
    noResident: 'No Residente',
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="stats-grid">
        <div className="card">
          <div className="card-icon blue-bg">
            <FaCar className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Vehículos Activos</p>
            <p className="value">{totalActive}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green-bg">
            <FaMoneyBillWave className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Ingresos Hoy</p>
            <p className="value">${todaysRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon purple-bg">
            <FaArrowRight className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Entradas Hoy</p>
            <p className="value">{todaysEntries}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red-bg">
            <FaArrowLeft className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Salidas Hoy</p>
            <p className="value">{todaysExitedVehicles}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-panel">
          <h3 className="panel-title">Distribución por Tipo</h3>
          <div className="distribution">
            {['official', 'resident', 'noResident'].map((type, index) => {
              const label = typeTranslations[type];
              const percent = totalActive ? (typeCounts[type] / totalActive) * 100 : 0;
              return (
                <div key={index}>
                  <div className="distribution-row">
                    <span>{label}</span>
                    <span>{typeCounts[type]}</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${type}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">Acciones Rápidas</h3>
          <div className="quick-actions">
            <Link to="/entrada" className="action-link blue-hover">
              <div className="action-icon blue-bg"><FaArrowRight className="small-icon" /></div>
              <div className="action-content">
                <p className="action-title">Registrar Entrada</p>
                <p className="action-description">Registrar la entrada de un vehículo</p>
              </div>
            </Link>

            <Link to="/salida" className="action-link red-hover">
              <div className="action-icon red-bg"><FaArrowLeft className="small-icon" /></div>
              <div className="action-content">
                <p className="action-title">Registrar Salida</p>
                <p className="action-description">Registrar la salida de un vehículo</p>
              </div>
            </Link>

            <Link to="/reportes" className="action-link green-hover">
              <div className="action-icon green-bg"><FaClipboardList className="small-icon" /></div>
              <div className="action-content">
                <p className="action-title">Ver Reportes</p>
                <p className="action-description">Acceder a los reportes del estacionamiento</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">Últimas Entradas</h3>
          <div className="last-entries">
            <ul>
              {lastEntries.length === 0 ? (
                <li className="entry-item">
                  <div className="entry-dot"></div>
                  <span className="entry-plate">-</span>
                  <span className="entry-time">-</span>
                </li>
              ) : (
                lastEntries.map((v, i) => (
                  <li key={i} className="entry-item">
                    <div className="entry-dot"></div>
                    <span className="entry-plate">{v.plateNumber}</span>
                    <span className="entry-time">{new Date(v.entryTime).toLocaleTimeString()}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">Vehículos en Estacionamiento</h3>
          <span className="last-update">Actualizado: {new Date().toLocaleTimeString()}</span>
        </div>
        {activeVehicles.length === 0 ? (
          <div className="vehicle-list-placeholder">Sin datos disponibles</div>
        ) : (
          <ul>
            {activeVehicles.map((v, i) => (
              <li key={i}>
                {v.Placa} - {typeTranslations[v.Tipo] || v.Tipo}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;