import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaMoneyBillWave, FaClipboardList, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import VehicleList from '../components/VehicleList';
import '../styles/Dashboard.css'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeVehicles: 0,
    totalEntries: 0,
    dailyRevenue: 0,
    vehicleTypes: {
      official: 0,
      resident: 0,
      noResident: 0
    }
  });

  const [activeVehicles, setActiveVehicles] = useState([
    { plateNumber: 'S1234A', type: 'resident', entryTime: new Date(new Date().getTime() - 30 * 60000) },
    { plateNumber: '4567ABC', type: 'noResident', entryTime: new Date(new Date().getTime() - 45 * 60000) },
    { plateNumber: '4FRU573', type: 'official', entryTime: new Date(new Date().getTime() - 180 * 60000) }
  ]);

  useEffect(() => {
    setStats({
      activeVehicles: activeVehicles.length,
      totalEntries: 15,
      dailyRevenue: 1450.00,
      vehicleTypes: {
        official: 2,
        resident: 5,
        noResident: 8
      }
    });
  }, [activeVehicles]);

  useEffect(() => {
    const timer = setInterval(() => {
      const randomAction = Math.random();
      if (randomAction > 0.7 && activeVehicles.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeVehicles.length);
        const newActiveVehicles = [...activeVehicles];
        newActiveVehicles.splice(randomIndex, 1);
        setActiveVehicles(newActiveVehicles);
      } else if (randomAction < 0.3) {
        const types = ['official', 'resident', 'noResident'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const newPlate = `ABC${Math.floor(Math.random() * 1000)}`;

        setActiveVehicles([...activeVehicles, {
          plateNumber: newPlate,
          type: randomType,
          entryTime: new Date()
        }]);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [activeVehicles]);

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
            <p className="value">{stats.activeVehicles}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green-bg">
            <FaMoneyBillWave className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Ingresos Hoy</p>
            <p className="value">${stats.dailyRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon purple-bg">
            <FaArrowRight className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Entradas Hoy</p>
            <p className="value">{stats.totalEntries}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red-bg">
            <FaArrowLeft className="icon" />
          </div>
          <div className="card-content">
            <p className="label">Salidas Hoy</p>
            <p className="value">{stats.totalEntries - stats.activeVehicles}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-panel">
          <h3 className="panel-title">Distribución por Tipo</h3>
          <div className="distribution">
            {['official', 'resident', 'noResident'].map((type, index) => (
              <div key={index}>
                <div className="distribution-row">
                  <span>{type === 'official' ? 'Oficiales' : type === 'resident' ? 'Residentes' : 'No Residentes'}</span>
                  <span>{stats.vehicleTypes[type]}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${type}`}
                    style={{ width: `${(stats.vehicleTypes[type] / stats.totalEntries) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
              {activeVehicles.slice(0, 5).map((vehicle, index) => (
                <li key={index} className="entry-item">
                  <div className="entry-dot" data-type={vehicle.type}></div>
                  <span className="entry-plate">{vehicle.plateNumber}</span>
                  <span className="entry-time">{new Date(vehicle.entryTime).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="panel-header">
          <h3 className="panel-title">Vehículos en Estacionamiento</h3>
          <span className="last-update">Actualizado: {new Date().toLocaleTimeString()}</span>
        </div>
        <VehicleList vehicles={activeVehicles} />
      </div>
    </div>
  );
};

export default Dashboard;
