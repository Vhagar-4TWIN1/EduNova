import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Récupère le rôle de l'utilisateur



  // Si l'utilisateur n'est pas connecté ou n'est pas un admin, rediriger vers la page d'accueil
  if (!token || role !== 'Admin') {
    console.log("Redirection vers /");
    return <Navigate to="/" replace />;
  }

  
  return children;
};

export default PrivateRoute;
