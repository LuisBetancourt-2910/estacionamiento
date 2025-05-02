import React, { useState, useEffect } from 'react';
import { FaSave, FaCog, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/Settings.css';
import { obtenerTarifas, guardarTarifa, eliminarTarifa } from '../services/tarifaService';
import { registrarUsuario, obtenerUsuarios } from '../services/usuarioService';

const Settings = () => {
  const [settings, setSettings] = useState({
    rates: {},
    vehicleTypes: [],
  });

  const [newVehicleType, setNewVehicleType] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  // Cargar tarifas desde el backend al montar el componente
  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const tarifas = await obtenerTarifas();

        const rates = {};
        const vehicleTypes = [];
        tarifas.forEach((tarifa) => {
          rates[tarifa.Tipo] = tarifa.Tarifa;
          vehicleTypes.push(tarifa.Tipo);
        });

        setSettings({
          rates,
          vehicleTypes,
        });
      } catch (error) {
        console.error('Error al cargar las tarifas:', error);
        alert('No se pudieron cargar las tarifas. Intenta nuevamente.');
      }
    };

    fetchTarifas();
  }, []);

  // Manejar cambios en las tarifas
  const handleRateChange = async (e) => {
    const { name, value } = e.target;

    if (isNaN(value) || value < 0) {
      alert('Por favor, ingresa un número válido para la tarifa.');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        [name]: parseFloat(value),
      },
    }));

    try {
      await guardarTarifa({
        tipo: name,
        tarifa: parseFloat(value),
      });
      alert('Tarifa guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la tarifa:', error);
      alert('No se pudo guardar la tarifa. Intenta nuevamente.');
    }
  };

  //obtiene los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuarios = await obtenerUsuarios();
        setUsers(usuarios);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        alert('No se pudieron cargar los usuarios. Intenta nuevamente.');
      }
    };
  
    fetchUsuarios();
  }, []);
  
  // Agregar un nuevo tipo de vehículo
  const handleAddVehicleType = async () => {
    if (!newVehicleType.trim()) {
      alert('El tipo de vehículo no puede estar vacío.');
      return;
    }

    if (settings.vehicleTypes.includes(newVehicleType)) {
      alert('Este tipo de vehículo ya existe.');
      return;
    }

    try {
      setIsLoading(true);
      await guardarTarifa({
        tipo: newVehicleType,
        tarifa: 0.0,
      });

      setSettings((prev) => ({
        ...prev,
        vehicleTypes: [...prev.vehicleTypes, newVehicleType],
        rates: {
          ...prev.rates,
          [newVehicleType]: 0.0,
        },
      }));

      setNewVehicleType('');
      alert('Nuevo tipo de vehículo agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar el tipo de vehículo:', error);
      alert('No se pudo agregar el tipo de vehículo. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar un tipo de vehículo
  const handleDeleteVehicleType = async (type) => {
    try {
      setIsLoading(true);
      await eliminarTarifa(type);

      setSettings((prev) => {
        const { [type]: _, ...newRates } = prev.rates;
        return {
          ...prev,
          vehicleTypes: prev.vehicleTypes.filter((vehicle) => vehicle !== type),
          rates: newRates,
        };
      });

      alert('Tipo de vehículo eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el tipo de vehículo:', error);
      alert('No se pudo eliminar el tipo de vehículo. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
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
  const handleAddUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim()) {
      alert('El nombre de usuario y la contraseña no pueden estar vacíos.');
      return;
    }
  
    try {
      await registrarUsuario(newUser);
      alert('Usuario registrado correctamente.');
      const updatedUsers = await obtenerUsuarios();
      setUsers(updatedUsers);
      
      setNewUser({ username: '', password: '' });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error al registrar usuario. Intenta nuevamente.');
      }
    }
  };
  
  // Eliminar un usuario
  const handleDeleteUser = (username) => {
    setUsers((prev) => prev.filter((user) => user.username !== username));
    alert('Usuario eliminado correctamente.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Configuración guardada correctamente.');
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
                disabled={isLoading}
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
            disabled={isLoading}
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

          {/* Lista de Usuarios */}
          <div className="users-list">
            {users.map((user) => (
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