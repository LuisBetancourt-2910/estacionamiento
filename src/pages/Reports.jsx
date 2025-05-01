import React, { useState } from 'react';
import { FaFilePdf, FaFileExcel, FaSearch } from 'react-icons/fa';
import { generatePDF, exportToExcel } from '../utils/reportUtils';
import '../styles/Reports.css';

const Reports = () => {
  const [dateFilter, setDateFilter] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '00:00',
    endTime: '23:59'
  });

  const [parkingRecords] = useState([
    {
      id: 1,
      plateNumber: 'S1234A',
      type: 'resident',
      entryTime: new Date('2025-04-30T13:00:00'),
      exitTime: new Date('2025-04-30T13:30:00'),
      fee: 30.0
    },
    {
      id: 2,
      plateNumber: '4567ABC',
      type: 'noResident',
      entryTime: new Date('2025-04-30T14:00:00'),
      exitTime: new Date('2025-04-30T15:00:00'),
      fee: 180.0
    },
    {
      id: 3,
      plateNumber: '4FRU573',
      type: 'official',
      entryTime: new Date('2025-04-30T10:00:00'),
      exitTime: new Date('2025-04-30T15:00:00'),
      fee: 0.0
    }
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filterRecords = () => {
    const filterDate = new Date(dateFilter.date);
    const filterStartTime = new Date(`${dateFilter.date}T${dateFilter.startTime}:00`);
    const filterEndTime = new Date(`${dateFilter.date}T${dateFilter.endTime}:00`);

    return parkingRecords.filter((record) => {
      const recordDate = new Date(record.entryTime);
      return (
        recordDate.getDate() === filterDate.getDate() &&
        recordDate.getMonth() === filterDate.getMonth() &&
        recordDate.getFullYear() === filterDate.getFullYear() &&
        recordDate >= filterStartTime &&
        recordDate <= filterEndTime
      );
    });
  };

  const filteredRecords = filterRecords();

  const handleExportPDF = () => {
    generatePDF(filteredRecords, dateFilter);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredRecords, dateFilter);
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Reportes de Estacionamiento</h2>

      <div className="reports-filters">
        <h3 className="filters-title">Filtros</h3>

        <div className="filters-grid">
          <div>
            <label htmlFor="date">Fecha</label>
            <input
              id="date"
              name="date"
              type="date"
              value={dateFilter.date}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label htmlFor="startTime">Desde</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={dateFilter.startTime}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label htmlFor="endTime">Hasta</label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={dateFilter.endTime}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filters-button">
            <button className="btn btn-search">
              <FaSearch className="icon" /> Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="reports-table-section">
        <div className="table-header">
          <h3>Resultados</h3>
          <div className="export-buttons">
            <button onClick={handleExportPDF} className="btn btn-pdf">
              <FaFilePdf className="icon" /> PDF
            </button>
            <button onClick={handleExportExcel} className="btn btn-excel">
              <FaFileExcel className="icon" /> Excel
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Núm. Placa</th>
                <th>Tipo</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Tiempo Estacionado</th>
                <th>Cantidad a Pagar</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-records">
                    No se encontraron registros para el período seleccionado.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const timeElapsed = Math.round((new Date(record.exitTime) - new Date(record.entryTime)) / (1000 * 60));
                  const hours = Math.floor(timeElapsed / 60);
                  const minutes = timeElapsed % 60;

                  return (
                    <tr key={record.id}>
                      <td>{record.plateNumber}</td>
                      <td>
                        {record.type === 'official' && 'Oficial'}
                        {record.type === 'resident' && 'Residente'}
                        {record.type === 'noResident' && 'No Residente'}
                      </td>
                      <td>{new Date(record.entryTime).toLocaleString()}</td>
                      <td>{new Date(record.exitTime).toLocaleString()}</td>
                      <td>
                        {hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : ''} {minutes} min
                      </td>
                      <td>${record.fee.toFixed(2)} MXN</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-summary">
          <p>Total de registros: {filteredRecords.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
