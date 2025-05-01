import React from 'react';

import Sidebar from '../components/Sidebar'; 
import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar /> 
      <div className="layout-content">
    
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;