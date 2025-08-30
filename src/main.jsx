import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import React from "react";
import App from './App.jsx'
import  { Blogs, Cart, FAQs, Gemstones, Categories ,Custom, Home } from "./Components/export.js"; 
import Wishlist from "./Components/Wishlist/Wishlist.jsx";
import UserAccount from "./Components/UserAccount/UserAccount.jsx";
import Productdetails from "./Components/Product/Productdetails.jsx"
import ExpertCall from "./Components/Home/ExpertCall.jsx";
import DetailBlog from "./Components/Blogs/DetailBlog.jsx"
import LoginSignup from "./Components/Login/Login.jsx";
import SignupForm from "./Components/Input/SignupForm.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} > 
      <Route index element={<Home/>} />

      {/* Product Page */}
      <Route path="product/:id" element={<Productdetails />} />
      <Route path="blog/:id" element={<DetailBlog />} />

      {/* Gemstones Page */}
      <Route path="gemstones" element={<Gemstones />} />
      <Route path="expertcall" element={<ExpertCall />} /> 

      <Route path="custom" element={<Custom />} />
      <Route path="categories" element={<Categories />} />
      <Route path="faqs" element={<FAQs />} />
      <Route path="cart" element={<Cart />} />
      <Route path="login" element={<LoginSignup />} />
      <Route path="signup" element={<SignupForm />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="account" element={<UserAccount />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="necklace" element={<Cart />} />
      <Route path="rudraksh" element={<UserAccount />} />
      <Route path="pandent" element={<Wishlist />} />
    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
  
)
