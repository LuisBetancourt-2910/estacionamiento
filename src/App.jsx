import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import VehicleEntry from './pages/VehicleEntry';
import VehicleExit from './pages/VehicleExit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Footer from './components/Footer';
import { VehicleProvider } from './context/VehicleContext';
import { VehicleContextExitProvider } from './context/VehicleContextExit';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <VehicleProvider>
        <VehicleContextExitProvider>
          <Routes>
            {/* Página de login sin layout */}
            <Route path="/login" element={<Login />} />

            {/* Todas las rutas protegidas usan el layout */}
            <Route
              path="/"
              element={<PrivateRoute element={<Layout><Dashboard /></Layout>} />}
            />
            <Route
              path="/entrada"
              element={<PrivateRoute element={<Layout><VehicleEntry /></Layout>} />}
            />
            <Route
              path="/salida"
              element={<PrivateRoute element={<Layout><VehicleExit /></Layout>} />}
            />
            <Route
              path="/reportes"
              element={<PrivateRoute element={<Layout><Reports /></Layout>} />}
            />
            <Route
              path="/configuracion"
              element={<PrivateRoute element={<Layout><Settings /></Layout>} />}
            />
          </Routes>

          
        </VehicleContextExitProvider>
      </VehicleProvider>
    </Router>
  );
};

export default App;
