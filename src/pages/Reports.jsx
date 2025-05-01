import React, { useContext, useState, useEffect } from 'react';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { VehicleContext } from '../context/VehicleContext';
import '../styles/Reports.css';

const Reports = () => {
  const { vehicles } = useContext(VehicleContext);

  const [dateFilter, setDateFilter] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    startTime: '00:00',
    endTime: '23:59',
  });

  const [filteredRecords, setFilteredRecords] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Filtrado automático
  useEffect(() => {
    const { date, startTime, endTime } = dateFilter;
    const filterStart = new Date(`${date}T${startTime}`);
    const filterEnd = new Date(`${date}T${endTime}`);

    const results = vehicles.filter((record) => {
      if (!record.entryTime) return false;
      const entryTime = new Date(record.entryTime);
      return entryTime >= filterStart && entryTime <= filterEnd;
    });

    setFilteredRecords(results);
  }, [dateFilter, vehicles]);

  const formatDuration = (entry, exit) => {
    const diffMs = new Date(exit) - new Date(entry);
    const totalMin = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMin / 60);
    const min = totalMin % 60;
    return `${hrs} hr${hrs !== 1 ? 's' : ''} ${min} min`;
  };

  const exportToExcel = () => {
    if (filteredRecords.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }

    const excelData = filteredRecords.map((record) => ({
      'Núm. Placa': record.plateNumber,
      Tipo:
        record.type === 'official'
          ? 'Oficial'
          : record.type === 'resident'
          ? 'Residente'
          : 'No Residente',
      Entrada: new Date(record.entryTime).toLocaleString(),
      Salida: record.exitTime ? new Date(record.exitTime).toLocaleString() : '-',
      'Tiempo Estacionado': record.exitTime
        ? formatDuration(record.entryTime, record.exitTime)
        : '-',
      'Cantidad a Pagar': record.fee ? `$${record.fee.toFixed(2)} MXN` : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes');

    const filename = `reporte_estacionamiento_${dateFilter.date}.xlsx`;
    XLSX.writeFile(wb, filename);
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
        </div>
      </div>

      <div className="reports-table-section">
        <div className="table-header">
          <h3>Resultados</h3>
          <div className="export-buttons">
            <button onClick={exportToExcel} className="btn btn-excel">
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
                filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.plateNumber}</td>
                    <td>
                      {record.type === 'official' && 'Oficial'}
                      {record.type === 'resident' && 'Residente'}
                      {record.type === 'noResident' && 'No Residente'}
                    </td>
                    <td>{new Date(record.entryTime).toLocaleString()}</td>
                    <td>{record.exitTime ? new Date(record.exitTime).toLocaleString() : '-'}</td>
                    <td>
                      {record.exitTime
                        ? formatDuration(record.entryTime, record.exitTime)
                        : '-'}
                    </td>
                    <td>{record.fee ? `$${record.fee.toFixed(2)} MXN` : '-'}</td>
                  </tr>
                ))
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
