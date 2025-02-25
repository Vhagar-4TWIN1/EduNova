import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";

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

export default DashboardLayout;
