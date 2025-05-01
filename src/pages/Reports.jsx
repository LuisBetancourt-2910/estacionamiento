import React, { useContext, useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaSearch } from 'react-icons/fa';
import { generatePDF, exportToExcel } from '../utils/reportUtils';
import { VehicleContext } from '../context/VehicleContext';
import '../styles/Reports.css';

const Reports = () => {
  const { vehicles } = useContext(VehicleContext);

  const [dateFilter, setDateFilter] = useState({
    date: new Date().toISOString().split('T')[0], // Fecha actual
    startTime: '00:00',
    endTime: '23:59',
  });

  useEffect(() => {
    console.log('Vehículos disponibles:', vehicles);
  }, [vehicles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Filtro solo por fecha (sin hora)
  const filteredRecords = vehicles.filter((record) => {
    if (!record.entryTime) return false; // Si no hay entrada, no se muestra

    // Convertir entrada a solo fecha sin hora
    const entryDate = new Date(record.entryTime).toISOString().split('T')[0];
    const filterDate = dateFilter.date;

    console.log('Fecha de entrada:', entryDate, 'Fecha filtrada:', filterDate);

    // Comparar solo la fecha (sin la parte de la hora)
    return entryDate === filterDate;
  });

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
                filteredRecords.map((record, index) => {
                  const hasExited = !!record.exitTime;
                  let timeText = '-';
                  let feeText = '-';

                  if (hasExited) {
                    const timeElapsed = Math.round(
                      (new Date(record.exitTime) - new Date(record.entryTime)) / (1000 * 60)
                    );
                    const hours = Math.floor(timeElapsed / 60);
                    const minutes = timeElapsed % 60;
                    timeText = `${hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : ''} ${minutes} min`;
                    feeText = `$${record.fee.toFixed(2)} MXN`;
                  }

                  return (
                    <tr key={index}>
                      <td>{record.plateNumber}</td>
                      <td>
                        {record.type === 'official' && 'Oficial'}
                        {record.type === 'resident' && 'Residente'}
                        {record.type === 'noResident' && 'No Residente'}
                      </td>
                      <td>{new Date(record.entryTime).toLocaleString()}</td>
                      <td>{hasExited ? new Date(record.exitTime).toLocaleString() : '-'}</td>
                      <td>{timeText}</td>
                      <td>{feeText}</td>
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
