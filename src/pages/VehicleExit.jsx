import React, { useState } from 'react';
import VehicleForm from '../components/VehicleForm';
import { registrarSalida } from '../services/registroService';
import '../styles/VehicleExit.css';

const VehicleExit = () => {
  const [parkingReceipt, setParkingReceipt] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleVehicleExit = async (vehicleData) => {
    try {
      const receipt = await registrarSalida({
        plateNumber: vehicleData.plateNumber,
      });

      setParkingReceipt(receipt);
    } catch (error) {
      setNotification({
        show: true,
        message: `Error al registrar la salida. Intente nuevamente.`,
        type: 'error',
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
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
                <div><strong>Placa:</strong> {parkingReceipt?.Placa || 'N/A'}</div>
                <div><strong>Tipo:</strong> {parkingReceipt?.Tipo || 'N/A'}</div>
                <div><strong>Entrada:</strong> {parkingReceipt?.HoraEntrada ? new Date(parkingReceipt.HoraEntrada).toLocaleString() : 'N/A'}</div>
                <div><strong>Salida:</strong> {parkingReceipt?.HoraSalida ? new Date(parkingReceipt.HoraSalida).toLocaleString() : 'N/A'}</div>
                <div><strong>Tiempo:</strong> {parkingReceipt?.TiempoEstacionadoMinutos ? `${parkingReceipt.TiempoEstacionadoMinutos} min` : 'N/A'}</div>
              </div>
              <div className="receipt-total">
                <strong>Total:</strong> ${parkingReceipt?.Tarifa ? parkingReceipt.Tarifa.toFixed(2) : '0.00'} MXN
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