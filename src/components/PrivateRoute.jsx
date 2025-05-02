import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirige al login si no está autenticado
  }

  return element; // Si está autenticado, muestra el componente que fue pasado
};

export default PrivateRoute;
