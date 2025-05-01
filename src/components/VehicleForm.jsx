import React, { useState } from 'react';
import '../styles/VehicleForm.css';

const VehicleForm = ({ onSubmit, formType }) => {
  const [vehicle, setVehicle] = useState({
    plateNumber: '',
    type: 'No Residente' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...vehicle,
      entryTime: formType === 'entry' ? new Date() : null,
      exitTime: formType === 'exit' ? new Date() : null
    });
    setVehicle({ plateNumber: '', type: 'No Residente' });
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <div className="form-group">
        <label htmlFor="plateNumber">Número de Placa</label>
        <input
          id="plateNumber"
          name="plateNumber"
          type="text"
          placeholder="Ej: ABC1234"
          value={vehicle.plateNumber}
          onChange={handleChange}
          required
        />
      </div>

      {formType === 'entry' && (
        <div className="form-group">
          <label htmlFor="type">Tipo de Vehículo</label>
          <select
            id="type"
            name="type"
            value={vehicle.type}
            onChange={handleChange}
            required
          >
            <option value="Oficial">Oficial</option>
            <option value="Residente">Residente</option>
            <option value="No Residente">No Residente</option>
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit">
          {formType === 'entry' ? 'Registrar Entrada' : 'Registrar Salida'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;