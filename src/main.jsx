import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import React from "react";
import App from './App.jsx'
import Home from "./Components/Home/Home.jsx";
import About from "./Components/About/About.jsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} > 

            <Route index element={<Home/>} />
            <Route path="/About" element={<About />} />

        </Route>
    )
)

createRoot(document.getElementById('root')).render(
  
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
  
)
