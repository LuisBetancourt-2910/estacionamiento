/**
 * Calcula la tarifa a pagar según el tipo de vehículo y tiempo estacionado
 * @param {string} vehicleType - 'official', 'resident', o 'noResident'
 * @param {number} minutes - Tiempo estacionado en minutos
 * @returns {number} - Tarifa a pagar en MXN
 */
export const calculateFee = (vehicleType, minutes) => {
    switch (vehicleType) {
      case 'official':
        // Los vehículos oficiales no pagan
        return 0;
      case 'resident':
        // Los residentes pagan $1.00 por minuto
        return minutes * 1.0;
      case 'noResident':
      default:
        // Los no residentes pagan $3.00 por minuto
        return minutes * 3.0;
    }
  };
  
  /**
   * Formatea un valor monetario como una cadena con formato de moneda MXN
   * @param {number} amount - Cantidad a formatear
   * @returns {string} - Cadena formateada como moneda
   */
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
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