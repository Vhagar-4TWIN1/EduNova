import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';

const DashboardLayout = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="app-content">
        {children} {/* Le contenu de la route sera injecté ici */}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;