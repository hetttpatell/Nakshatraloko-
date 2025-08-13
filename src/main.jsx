import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import React from "react";
import App from './App.jsx'


const router = createBrowserRouter(
    
)

createRoot(document.getElementById('root')).render(
  
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
  
)
