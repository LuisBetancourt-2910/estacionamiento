import React, { useState, useEffect } from 'react';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import axios from 'axios'; 
import '../styles/Reports.css';

const Reports = () => {
  const [dateFilter, setDateFilter] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    startTime: '00:00',
    endTime: '23:59',
  });

  const [filteredRecords, setFilteredRecords] = useState([]);

  // Función para obtener registros desde el backend
  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/registros/vehiculos'); // Endpoint del backend
      const records = response.data;

      // Filtrar los registros según los filtros de fecha y hora
      const { date, startTime, endTime } = dateFilter;
      const filterStart = new Date(`${date}T${startTime}`);
      const filterEnd = new Date(`${date}T${endTime}`);

      const filtered = records.filter((record) => {
        if (!record.HoraEntrada) return false;
        const entryTime = new Date(record.HoraEntrada);
        return entryTime >= filterStart && entryTime <= filterEnd;
      });

      setFilteredRecords(filtered);
    } catch (error) {
      console.error('Error al obtener los registros:', error);
    }
  };

  // Llamar a fetchRecords cada vez que cambien los filtros
  useEffect(() => {
    fetchRecords();
  }, [dateFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

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
      'Núm. Placa': record.Placa,
      Tipo:
        record.Tipo === 'Oficial'
          ? 'Oficial'
          : record.Tipo === 'Residente'
          ? 'Residente'
          : 'No Residente',
      Entrada: new Date(record.HoraEntrada).toLocaleString(),
      Salida: record.HoraSalida ? new Date(record.HoraSalida).toLocaleString() : '-',
      'Tiempo Estacionado': record.HoraSalida
        ? formatDuration(record.HoraEntrada, record.HoraSalida)
        : '-',
      'Cantidad a Pagar': record.Tarifa ? `$${record.Tarifa.toFixed(2)} MXN` : '-',
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
                    <td>{record.Placa}</td>
                    <td>{record.Tipo}</td>
                    <td>{new Date(record.HoraEntrada).toLocaleString()}</td>
                    <td>{record.HoraSalida ? new Date(record.HoraSalida).toLocaleString() : '-'}</td>
                    <td>
                      {record.HoraSalida
                        ? formatDuration(record.HoraEntrada, record.HoraSalida)
                        : '-'}
                    </td>
                    <td>{record.Tarifa ? `$${record.Tarifa.toFixed(2)} MXN` : '-'}</td>
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