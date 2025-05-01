import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import VehicleEntry from './pages/VehicleEntry';
import VehicleExit from './pages/VehicleExit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Footer from './components/Footer'; 

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entrada" element={<VehicleEntry />} />
          <Route path="/salida" element={<VehicleExit />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/configuracion" element={<Settings />} />
        </Routes>
        <Footer /> 
      </Layout>
    </Router>
  );
};

export default App;