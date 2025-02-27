import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';
import Logs from "./logs";
import { Outlet } from 'react-router-dom'; // Outlet gère les routes enfants

const DashboardLayout = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="app-content">
          <Logs /> {/* Ajout de Logs ici */}
          <Outlet /> {/* Permet d'afficher les routes enfants */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;