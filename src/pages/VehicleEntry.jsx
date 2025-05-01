import React, { useState } from 'react';
import VehicleForm from '../components/VehicleForm';
import '../styles/VehicleEntry.css';

const VehicleEntry = () => {
  const [vehicles, setVehicles] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleVehicleEntry = (vehicle) => {
    const isVehicleInParking = vehicles.some(v =>
      v.plateNumber === vehicle.plateNumber && !v.exitTime
    );

    if (isVehicleInParking) {
      setNotification({
        show: true,
        message: `El vehículo con placa ${vehicle.plateNumber} ya está en el estacionamiento.`,
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    setVehicles([...vehicles, vehicle]);
    setNotification({
      show: true,
      message: `Entrada registrada: Vehículo ${vehicle.plateNumber}`,
      type: 'success'
    });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
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
          <VehicleForm onSubmit={handleVehicleEntry} formType="entry" />
        </div>
        <div className="entry-instructions">
          <h3>Instrucciones</h3>
          <ul>
            <li>Ingrese el número de placa del vehículo.</li>
            <li>Seleccione el tipo de vehículo:
              <ul>
                <li><strong>Oficial:</strong> No paga tarifa</li>
                <li><strong>Residente:</strong> $1.00 MXN/min</li>
                <li><strong>No Residente:</strong> $3.00 MXN/min</li>
              </ul>
            </li>
            <li>Haga clic en "Registrar Entrada".</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntry;
