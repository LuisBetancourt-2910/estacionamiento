import React, { useState } from 'react';
import '../styles/VehicleForm.css';

const VehicleForm = ({ onSubmit, formType, vehicleTypes = [] }) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    tarifa: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      // Buscar la tarifa correspondiente al tipo de vehículo seleccionado
      const selectedType = vehicleTypes.find((type) => type.Tipo === value);
      setFormData({
        ...formData,
        type: value,
        tarifa: selectedType ? selectedType.Tarifa : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      plateNumber: '',
      type: '',
      tarifa: 0,
    });
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="plateNumber">Número de Placa</label>
        <input
          type="text"
          id="plateNumber"
          name="plateNumber"
          value={formData.plateNumber}
          onChange={handleChange}
          required
        />
      </div>

      {/* Mostrar el campo de tipo de vehículo solo si el formulario es para entrada */}
      {formType === 'entry' && (
        <div className="form-group">
          <label htmlFor="type">Tipo de Vehículo</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo</option>
            {Array.isArray(vehicleTypes) && vehicleTypes.map((type) => (
              <option key={type.Tipo} value={type.Tipo}>
                {type.Tipo} - ${type.Tarifa.toFixed(2)} MXN/min
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mostrar la tarifa seleccionada solo si el formulario es para entrada */}
      {formType === 'entry' && formData.tarifa > 0 && (
        <div className="form-group">
          <label>Tarifa Seleccionada</label>
          <p>${formData.tarifa.toFixed(2)} MXN/min</p>
        </div>
      )}

      <button type="submit" className="submit-button">
        {formType === 'entry' ? 'Registrar Entrada' : 'Registrar Salida'}
      </button>
    </form>
  );
};

export default VehicleForm;