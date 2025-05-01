import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './vehicleUtils';

/**
 * Genera un reporte en PDF de los registros de estacionamiento
 * @param {Array} records - Registros de estacionamiento
 * @param {Object} filters - Filtros aplicados (fecha, horario)
 */
export const generatePDF = (records, filters) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(16);
  doc.text('Reporte de Estacionamiento', 14, 22);
  
  // Información del filtro
  doc.setFontSize(10);
  doc.text(`Fecha: ${filters.date}`, 14, 30);
  doc.text(`Horario: ${filters.startTime} a ${filters.endTime}`, 14, 35);
  
  // Tabla de datos
  const tableColumn = ["Núm. Placa", "Tipo", "Tiempo Estacionado", "Cantidad a Pagar"];
  const tableRows = [];
  
  // Añadir filas a la tabla
  records.forEach(record => {
    const timeElapsed = Math.round((new Date(record.exitTime) - new Date(record.entryTime)) / (1000 * 60));
    const hours = Math.floor(timeElapsed / 60);
    const minutes = timeElapsed % 60;
    const timeStr = `${hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : ''}${minutes} min`;
    
    const vehicleType = 
      record.type === 'official' ? 'Oficial' :
      record.type === 'resident' ? 'Residente' : 'No Residente';
    
    const rowData = [
      record.plateNumber,
      vehicleType,
      timeStr,
      formatCurrency(record.fee)
    ];
    tableRows.push(rowData);
  });
  
  // Generar tabla
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 10);
  }
  
  // Guardar el PDF
  doc.save(`Reporte_Estacionamiento_${filters.date}.pdf`);
};

/**
 * Exporta los registros a un archivo Excel
 * @param {Array} records - Registros de estacionamiento
 * @param {Object} filters - Filtros aplicados (fecha, horario)
 */
export const exportToExcel = (records, filters) => {
    // Preparar los datos
    const excelData = records.map(record => {
      const timeElapsed = Math.round((new Date(record.exitTime) - new Date(record.entryTime)) / (1000 * 60));
      const hours = Math.floor(timeElapsed / 60);
      const minutes = timeElapsed % 60;
      const timeStr = `${hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : ''}${minutes} min`;
      
      const vehicleType = 
        record.type === 'official' ? 'Oficial' :
        record.type === 'resident' ? 'Residente' : 'No Residente';
      
      return {
        'Núm. Placa': record.plateNumber,
        'Tipo': vehicleType,
        'Entrada': new Date(record.entryTime).toLocaleString(),
        'Salida': new Date(record.exitTime).toLocaleString(),
        'Tiempo Estacionado': timeStr,
        'Cantidad a Pagar': record.fee.toFixed(2) + ' MXN'
      };
    });
    
    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Añadir la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');
    
    // Guardar el archivo
    XLSX.writeFile(workbook, `Reporte_Estacionamiento_${filters.date}.xlsx`);
  };