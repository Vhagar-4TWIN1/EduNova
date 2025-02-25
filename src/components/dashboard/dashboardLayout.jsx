import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';
import Logs from "./logs";
import { Outlet } from 'react-router-dom'; // Outlet gère les routes enfants

const DashboardLayout = ({ children }) => {


const DashboardLayout = () => {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="app-content">
        <Outlet /> {/* 👈 This renders the child routes */}
      </main>
      <Footer />
    </div>    
  );
};
}
export default DashboardLayout;
