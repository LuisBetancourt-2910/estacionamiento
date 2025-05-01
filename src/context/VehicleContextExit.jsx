import React, { createContext, useContext } from 'react';
import { VehicleContext } from './VehicleContext';

export const VehicleContextExit = createContext();

export const VehicleContextExitProvider = ({ children }) => {
  const { vehicles, setVehicles } = useContext(VehicleContext); 

  const registerVehicleExit = (plateNumber, exitData) => {
    const index = vehicles.findIndex(v => v.plateNumber === plateNumber && !v.exitTime);
    if (index === -1) return null;

    const updatedVehicle = { ...vehicles[index], ...exitData };
    const updatedVehicles = [...vehicles];
    updatedVehicles[index] = updatedVehicle;

    setVehicles(updatedVehicles); 

    return updatedVehicle;
  };

  return (
    <VehicleContextExit.Provider value={{ registerVehicleExit }}>
      {children}
    </VehicleContextExit.Provider>
  );
};
