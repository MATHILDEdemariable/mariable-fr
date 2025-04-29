
import React from 'react';
import { Navigate } from 'react-router-dom';

const LoginFrame = () => {
  // Redirect to the register page
  return <Navigate to="/register" replace />;
};

export default LoginFrame;
