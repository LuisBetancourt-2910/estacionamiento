import React from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
