import React, { useState, useEffect } from 'react';
import VehicleForm from '../components/VehicleForm';
import { registrarEntrada } from '../services/registroService';
import { obtenerTarifas } from '../services/tarifaService';
import '../styles/VehicleEntry.css';

const VehicleEntry = () => {
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [vehicleTypes, setVehicleTypes] = useState([]); // Tipos de vehículos y tarifas

  // Cargar tipos de vehículos y tarifas desde el backend
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const tarifas = await obtenerTarifas();
        setVehicleTypes(tarifas);
      } catch (error) {
        console.error('Error al cargar los tipos de vehículos:', error);
        alert('No se pudieron cargar los tipos de vehículos. Intenta nuevamente.');
      }
    };

    fetchVehicleTypes();
  }, []);

  const handleVehicleEntry = async (vehicle) => {
    try {
      await registrarEntrada({
        plateNumber: vehicle.plateNumber,
        type: vehicle.type,
      });

      setNotification({
        show: true,
        message: `Entrada registrada: Vehículo ${vehicle.plateNumber}`,
        type: 'success',
      });
    } catch (error) {
      setNotification({
        show: true,
        message: 'Error al registrar la entrada. Intente nuevamente.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  return (
    <div className="entry-container">
      <h2 className="entry-title">Registro de Entrada</h2>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="entry-grid">
        <div>
          <VehicleForm
            onSubmit={handleVehicleEntry}
            formType="entry"
            vehicleTypes={vehicleTypes} // Pasar los tipos de vehículos al formulario
          />
        </div>
        <div className="entry-instructions">
          <h3>Instrucciones</h3>
          <ul>
            <li>Ingrese el número de placa del vehículo.</li>
            <li>Seleccione el tipo de vehículo:</li>
            <ul>
              {vehicleTypes.map((type) => (
                <li key={type.Tipo}>
                  <strong>{type.Tipo}:</strong> ${type.Tarifa.toFixed(2)} MXN/min
                </li>
              ))}
            </ul>
            <li>Haga clic en "Registrar Entrada".</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntry;