import { Navigate } from 'react-router-dom';
import React from 'react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  console.log('ProtectedRoute - Token:', token);
  console.log('ProtectedRoute - User data:', userData);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  try {
    let user = userData ? JSON.parse(userData) : {};
    
    // If user data is missing but token exists, try to extract from token
    if (Object.keys(user).length === 0 && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user = {
          id: payload.id,
          email: payload.email,
          role: payload.role
        };
        localStorage.setItem('user', JSON.stringify(user));
      } catch (tokenError) {
        console.error('Error parsing token:', tokenError);
      }
    }
    
    console.log('ProtectedRoute - Final user object:', user);
    
    if (adminOnly) {
      const userRole = user.role?.toLowerCase();
      console.log('ProtectedRoute - User role:', userRole);
      
      if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
      }
    }
    
    return children;
  } catch (error) {
    console.error('Error in ProtectedRoute:', error);
    return <Navigate to="/" replace />;
  }
};
export default ProtectedRoute;