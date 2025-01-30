import React from "react"
import Navbar from "./Navbar/navbar"
import Register from "./Register/Register"
import Login from "./Login/login"
import Home from "./Home/Home"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookAppointment from "./BookAppointment/BookAppointment"
import ProductsPage from "./Product/ProductsPage"
import Services from "./Services/Services"
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookappointment" element={<BookAppointment />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  )
}