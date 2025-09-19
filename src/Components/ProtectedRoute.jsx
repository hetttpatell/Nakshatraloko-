// import { Navigate } from 'react-router-dom';
// import React from 'react';

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const token = localStorage.getItem('authToken');
//   const userData = localStorage.getItem('user');
  
//   console.log('ProtectedRoute - Token:', token);
//   console.log('ProtectedRoute - User data:', userData);
  
//   if (!token) {
//     return <Navigate to="/" replace />;
//   }
  
//   try {
//     let user = userData ? JSON.parse(userData) : {};
    
//     // If user data is missing but token exists, try to extract from token
//     if (Object.keys(user).length === 0 && token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         user = {
//           id: payload.id,
//           email: payload.email,
//           role: payload.role
//         };
//         localStorage.setItem('user', JSON.stringify(user));
//       } catch (tokenError) {
//         console.error('Error parsing token:', tokenError);
//       }
//     }
    
//     console.log('ProtectedRoute - Final user object:', user);
    
//     if (adminOnly) {
//       const userRole = user.role?.toLowerCase();
//       console.log('ProtectedRoute - User role:', userRole);
      
//       if (userRole !== 'admin') {
//         return <Navigate to="/" replace />;
//       }
//     }
    
//     return children;
//   } catch (error) {
//     console.error('Error in ProtectedRoute:', error);
//     return <Navigate to="/" replace />;
//   }
// };
// export default ProtectedRoute;

// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import LoginSignup from "./Login/Login";

// /**
//  * Props:
//  * - children: the component to protect
//  * - adminOnly: if true, only admin users can access
//  * - redirectTo: where to redirect if user is not logged in (optional)
//  */
// const ProtectedWrapper = ({ children, adminOnly = false, redirectTo = "/"  }) => {
//   const [user, setUser] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [checkedAuth, setCheckedAuth] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userData = localStorage.getItem("user");

//     let parsedUser = null;

//     if (userData) {
//       parsedUser = JSON.parse(userData);
//     } else if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         parsedUser = {
//           id: payload.id,
//           email: payload.email,
//           role: payload.role?.toLowerCase() || "user",
//         };
//         localStorage.setItem("user", JSON.stringify(parsedUser));
//       } catch (err) {
//         console.error("Error parsing token:", err);
//       }
//     }

//     // Admin check
//     if (adminOnly && parsedUser?.role !== "admin") {
//       parsedUser = null; // treat as not logged in
//     }

//     setUser(parsedUser);
//     if (!parsedUser) setShowLoginModal(true);
//     setCheckedAuth(true);
//   }, [adminOnly]);

//   // After login callback
//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//     setShowLoginModal(false);
//   };

//   // Wait until auth check is done
//   if (!checkedAuth) return null;

//   // If user is not logged in and no modal, redirect (optional)
//   if (!user && !showLoginModal && redirectTo) {
//     return <Navigate to={redirectTo} replace />;
//   }

//   return (
//     <>
//       {user ? (
//         children
//       ) : (
//         showLoginModal && (
//           <LoginSignup
//             onClose={() => setShowLoginModal(false)}
//             onLogin={handleLoginSuccess}
//           />
//         )
//       )}
//     </>
//   );
// };

// export default ProtectedWrapper;
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    let user = userData ? JSON.parse(userData) : {};

    // If user data missing, extract from token
    if (Object.keys(user).length === 0 && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        user = {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        };
        localStorage.setItem("user", JSON.stringify(user));
      } catch (tokenError) {
        console.error("Error parsing token:", tokenError);
        return <Navigate to="/login" replace />;
      }
    }

    // Admin check
    if (adminOnly && user.role?.toLowerCase() !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
