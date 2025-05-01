import React from 'react';
import { calculateFee } from '../utils/vehicleUtils';
import '../styles/VehicleList.css';

const VehicleList = ({ vehicles }) => {
  return (
    <div className="vehicle-list">
      <h2 className="list-title">Vehículos en el Estacionamiento</h2>
      {vehicles.length === 0 ? (
        <p className="empty-message">No hay vehículos registrados actualmente.</p>
      ) : (
        <div className="table-wrapper">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Tipo</th>
                <th>Hora de Entrada</th>
                <th>Tiempo Transcurrido</th>
                <th>Tarifa Actual</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const timeElapsed = vehicle.exitTime 
                  ? Math.round((new Date(vehicle.exitTime) - new Date(vehicle.entryTime)) / (1000 * 60)) 
                  : Math.round((new Date() - new Date(vehicle.entryTime)) / (1000 * 60));
                
                const fee = calculateFee(vehicle.type, timeElapsed);

                return (
                  <tr key={vehicle.plateNumber}>
                    <td>{vehicle.plateNumber}</td>
                    <td>
                      {vehicle.type === 'official' && 'Oficial'}
                      {vehicle.type === 'resident' && 'Residente'}
                      {vehicle.type === 'noResident' && 'No Residente'}
                    </td>
                    <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
                    <td>{timeElapsed} minutos</td>
                    <td>${fee.toFixed(2)} MXN</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
