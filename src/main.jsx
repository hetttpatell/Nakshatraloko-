import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import React from "react";
import App from './App.jsx'
import { Blogs, Cart, FAQs, Gemstones, Categories, Custom, Home } from "./Components/export.js";
import Wishlist from "./Components/Wishlist/Wishlist.jsx";
import UserAccount from "./Components/UserAccount/UserAccount.jsx";
import Productdetails from "./Components/Product/Productdetails.jsx"
import ExpertCall from "./Components/Home/ExpertCall.jsx";
import DetailBlog from "./Components/Blogs/DetailBlog.jsx"
import LoginSignup from "./Components/Login/Login.jsx";
import SignupForm from "./Components/Login/SignupForm.jsx";
import PaymentForm from "./Components/Payment/PaymentForm .jsx";
import ThankYouPage from "./Components/Payment/ThankYou.jsx";
import Pendant from "./Components/Catagories/Pendant.jsx";
import CategoryPage from "./Components/Catagories/Catagories.jsx";
import AuthSuccess from "./Components/Login/AuthSucess.jsx";
import Admin from "./Admin/Admin.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route index element={<Home />} />

      {/* Product Page */}
      <Route path="product/:id" element={<Productdetails />} />
      <Route path="blog/:id" element={<DetailBlog />} />

      {/* Gemstones Page */}
      <Route path="gemstones" element={<Gemstones />} />
      <Route path="expertcall" element={<ExpertCall />} />

      <Route path="custom" element={<Custom />} />
      <Route path="categories" element={<Categories />}>
        <Route path=":category" element={<CategoryPage />} />
      </Route>
      <Route path="faqs" element={<FAQs />} />
      <Route path="cart" element={<Cart />} />
      <Route path="admin" element={<Admin />} />
      <Route path="login" element={<LoginSignup />} />
      <Route path="auth/success" element={<AuthSuccess />} />

      <Route path="signup" element={<SignupForm />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="account" element={<UserAccount />} />
      <Route path="blogs" element={<Blogs />} />
 
      <Route path="payment" element={<PaymentForm />} />
      <Route path="thankyou" element={<ThankYouPage />} />
    </Route>
  )
);


createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>

)
