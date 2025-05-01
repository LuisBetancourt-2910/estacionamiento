import React, { createContext, useState } from 'react';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);

  const addVehicle = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
  };

  return (
    <VehicleContext.Provider value={{ vehicles, setVehicles, addVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};
