import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import React from "react";
import App from './App.jsx'
import Gemstones from "./Components/Gemstones/Gemstones.jsx";
import Custom from "./Components/Custom/Custom.jsx";
import Home from "./Components/Home/Home.jsx";
import Catagories from "./Components/Catagories/Catagories.jsx";
import Blogs from "./Components/Blogs/Blogs.jsx";
import FAQs from "./Components/FAQS/FAQs.jsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} > 

            <Route index element={<Home/>} />
            <Route path="/gemstones" element={<Gemstones />} />
            <Route path="/Custom" element={<Custom />} />
            <Route path="/Catagories" element={<Catagories />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/blogs" element={<Blogs />} />

        </Route>
    )
)

createRoot(document.getElementById('root')).render(
  
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
  
)
