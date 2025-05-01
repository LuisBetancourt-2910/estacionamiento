import React, { useState } from 'react';
import { FaSave, FaCog } from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    rates: {
      resident: 1.00,
      noResident: 3.00,
    },
    notifications: {
      emailAlerts: true,
      dailyReport: true,
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
    }
  });

  const handleRateChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [name]: parseFloat(value)
      }
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Configuración guardada correctamente');
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Configuración del Sistema</h2>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Tarifas */}
        <div className="settings-card">
          <h3 className="settings-card-title"><FaCog /> Tarifas</h3>

          <div>
            <label htmlFor="resident">Tarifa para Residentes (MXN por minuto)</label>
            <input
              id="resident"
              name="resident"
              type="number"
              step="0.01"
              min="0"
              value={settings.rates.resident}
              onChange={handleRateChange}
              className="settings-input"
            />
          </div>

          <div>
            <label htmlFor="noResident">Tarifa para No Residentes (MXN por minuto)</label>
            <input
              id="noResident"
              name="noResident"
              type="number"
              step="0.01"
              min="0"
              value={settings.rates.noResident}
              onChange={handleRateChange}
              className="settings-input"
            />
          </div>

          <div className="settings-note">
            Nota: Los vehículos oficiales no pagan tarifa.
          </div>
        </div>

        {/* Notificaciones */}
        <div className="settings-card">
          <h3 className="settings-card-title"><FaCog /> Notificaciones</h3>

          <div>
            <input
              id="emailAlerts"
              name="emailAlerts"
              type="checkbox"
              checked={settings.notifications.emailAlerts}
              onChange={handleNotificationChange}
            />
            <label htmlFor="emailAlerts" className="settings-checkbox-label">
              Recibir alertas por correo electrónico
            </label>
          </div>

          <div>
            <input
              id="dailyReport"
              name="dailyReport"
              type="checkbox"
              checked={settings.notifications.dailyReport}
              onChange={handleNotificationChange}
            />
            <label htmlFor="dailyReport" className="settings-checkbox-label">
              Recibir reporte diario
            </label>
          </div>
        </div>

        {/* Sistema */}
        <div className="settings-card">
          <h3 className="settings-card-title"><FaCog /> Sistema</h3>

          <div>
            <input
              id="autoBackup"
              name="autoBackup"
              type="checkbox"
              checked={settings.system.autoBackup}
              onChange={handleSystemChange}
            />
            <label htmlFor="autoBackup" className="settings-checkbox-label">
              Copia de seguridad automática
            </label>
          </div>

          {settings.system.autoBackup && (
            <div>
              <label htmlFor="backupFrequency">Frecuencia de copia de seguridad</label>
              <select
                id="backupFrequency"
                name="backupFrequency"
                value={settings.system.backupFrequency}
                onChange={handleSystemChange}
                className="settings-select"
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
          )}
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="settings-submit" onClick={handleSubmit}>
          <FaSave />
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default Settings;
