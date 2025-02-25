import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { Outlet } from "react-router-dom"; // Outlet manages nested routes

const DashboardLayout = () => {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="app-content">
        <Outlet /> {/* 👈 This ensures child routes render correctly */}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
