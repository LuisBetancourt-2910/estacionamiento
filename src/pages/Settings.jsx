import React, { useState } from 'react';
import { FaSave, FaCog, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    rates: {
      resident: 1.0,
      noResident: 3.0,
    },
    vehicleTypes: ['resident', 'noResident'], // Tipos de vehículos iniciales
    users: [], // Lista de usuarios
  });

  const [newVehicleType, setNewVehicleType] = useState(''); // Estado para el nuevo tipo de vehículo
  const [newUser, setNewUser] = useState({ username: '', password: '' }); // Estado para el nuevo usuario

  // Manejar cambios en las tarifas
  const handleRateChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        [name]: parseFloat(value),
      },
    }));
  };

  // Agregar un nuevo tipo de vehículo
  const handleAddVehicleType = () => {
    if (!newVehicleType.trim()) {
      alert('El tipo de vehículo no puede estar vacío.');
      return;
    }

    if (settings.vehicleTypes.includes(newVehicleType)) {
      alert('Este tipo de vehículo ya existe.');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      vehicleTypes: [...prev.vehicleTypes, newVehicleType],
      rates: {
        ...prev.rates,
        [newVehicleType]: 0.0, // Agregar tarifa inicial para el nuevo tipo
      },
    }));
    setNewVehicleType(''); // Limpiar el campo de entrada
  };

  // Eliminar un tipo de vehículo
  const handleDeleteVehicleType = (type) => {
    setSettings((prev) => {
      const { [type]: _, ...newRates } = prev.rates; // Eliminar la tarifa asociada
      return {
        ...prev,
        vehicleTypes: prev.vehicleTypes.filter((vehicle) => vehicle !== type),
        rates: newRates,
      };
    });
  };

  // Manejar cambios en el formulario de nuevo usuario
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar un nuevo usuario
  const handleAddUser = () => {
    if (!newUser.username.trim() || !newUser.password.trim()) {
      alert('El nombre de usuario y la contraseña no pueden estar vacíos.');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    setNewUser({ username: '', password: '' }); // Limpiar el formulario
    alert('Usuario agregado correctamente.');
  };

  // Eliminar un usuario
  const handleDeleteUser = (username) => {
    setSettings((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.username !== username),
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
          <h3 className="settings-card-title">
            <FaCog /> Tarifas
          </h3>

          {settings.vehicleTypes.map((type) => (
            <div key={type} className="settings-item">
              <label htmlFor={type}>
                Tarifa para {type.charAt(0).toUpperCase() + type.slice(1)} (MXN por minuto)
              </label>
              <input
                id={type}
                name={type}
                type="number"
                step="0.01"
                min="0"
                value={settings.rates[type]}
                onChange={handleRateChange}
                className="settings-input"
              />
              <button
                type="button"
                className="settings-delete-button"
                onClick={() => handleDeleteVehicleType(type)}
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          ))}

          <div className="settings-note">
            Nota: Los vehículos oficiales no pagan tarifa.
          </div>
        </div>

        {/* Agregar Tipo de Vehículo */}
        <div className="settings-card">
          <h3 className="settings-card-title">
            <FaCog /> Agregar Tipo de Vehículo
          </h3>

          <div>
            <label htmlFor="newVehicleType">Nuevo Tipo de Vehículo</label>
            <input
              id="newVehicleType"
              type="text"
              value={newVehicleType}
              onChange={(e) => setNewVehicleType(e.target.value)}
              className="settings-input"
            />
          </div>

          <button
            type="button"
            className="settings-add-button"
            onClick={handleAddVehicleType}
          >
            <FaPlus /> Agregar Tipo de Vehículo
          </button>
        </div>

        {/* Agregar Usuario */}
        <div className="settings-card">
          <h3 className="settings-card-title">
            <FaCog /> Agregar Usuario
          </h3>

          <div>
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              value={newUser.username}
              onChange={handleUserChange}
              className="settings-input"
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleUserChange}
              className="settings-input"
            />
          </div>

          <button
            type="button"
            className="settings-add-button"
            onClick={handleAddUser}
          >
            <FaPlus /> Agregar Usuario
          </button>
        </div>

        {/* Lista de Usuarios */}
        <div className="settings-card">
          <h3 className="settings-card-title">
            <FaCog /> Usuarios
          </h3>

          {settings.users.map((user) => (
            <div key={user.username} className="settings-item">
              <span>{user.username}</span>
              <button
                type="button"
                className="settings-delete-button"
                onClick={() => handleDeleteUser(user.username)}
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          ))}
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