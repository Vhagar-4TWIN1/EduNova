import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="app-content">
      <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;