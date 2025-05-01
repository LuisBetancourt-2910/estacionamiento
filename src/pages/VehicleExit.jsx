import React, { useState } from 'react';
import VehicleForm from '../components/VehicleForm';
import { calculateFee } from '../utils/vehicleUtils';
import '../styles/VehicleExit.css';

const VehicleExit = () => {
  const [vehicles, setVehicles] = useState([]);
  const [parkingReceipt, setParkingReceipt] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleVehicleExit = (vehicleData) => {
    const vehicleIndex = vehicles.findIndex(v =>
      v.plateNumber === vehicleData.plateNumber && !v.exitTime
    );

    if (vehicleIndex === -1) {
      setNotification({
        show: true,
        message: `No se encontró registro para ${vehicleData.plateNumber}.`,
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    const vehicle = vehicles[vehicleIndex];
    const entryTime = new Date(vehicle.entryTime);
    const exitTime = new Date();
    const timeElapsed = Math.round((exitTime - entryTime) / (1000 * 60));
    const fee = calculateFee(vehicle.type, timeElapsed);

    const updatedVehicles = [...vehicles];
    updatedVehicles[vehicleIndex] = { ...vehicle, exitTime, timeElapsed, fee };
    setVehicles(updatedVehicles);

    setParkingReceipt({ ...vehicle, entryTime, exitTime, timeElapsed, fee });
  };

  const handlePrintReceipt = () => window.print();

  return (
    <div className="exit-container">
      <h2 className="exit-title">Registro de Salida</h2>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="exit-grid">
        {!parkingReceipt ? (
          <>
            <div>
              <VehicleForm onSubmit={handleVehicleExit} formType="exit" />
            </div>
            <div className="exit-instructions">
              <h3>Instrucciones</h3>
              <ul>
                <li>Ingrese la placa del vehículo.</li>
                <li>El sistema calculará el tiempo y tarifa.</li>
                <li>Presione "Registrar Salida".</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="receipt-container">
            <div id="receipt">
              <div className="receipt-header">
                <h3>Recibo de Estacionamiento</h3>
                <button onClick={handlePrintReceipt}>Imprimir</button>
              </div>
              <div className="receipt-body">
                <div><strong>Placa:</strong> {parkingReceipt.plateNumber}</div>
                <div><strong>Tipo:</strong> {parkingReceipt.type}</div>
                <div><strong>Entrada:</strong> {parkingReceipt.entryTime.toLocaleString()}</div>
                <div><strong>Salida:</strong> {parkingReceipt.exitTime.toLocaleString()}</div>
                <div><strong>Tiempo:</strong> {parkingReceipt.timeElapsed} min</div>
              </div>
              <div className="receipt-total">
                <strong>Total:</strong> ${parkingReceipt.fee.toFixed(2)} MXN
              </div>
              <div className="receipt-footer">
                ¡Gracias! Fecha: {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="receipt-reset">
              <button onClick={() => setParkingReceipt(null)}>Registrar otra salida</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleExit;
