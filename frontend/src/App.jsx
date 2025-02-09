import React, { useEffect, useState } from "react"
import Navbar from "./Navbar/Navbar"
import Register from "./Register/Register"
import Login from "./Login/login"
import Home from "./Home/Home"
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import BookAppointment from "./BookAppointment/BookAppointment"
import ProductsPage from "./Product/ProductsPage"
import Services from "./Services/Services"
import AboutUs from "./Aboutus/Aboutus"
import Enroll from "./Enroll/Enroll"
import AdminDashboard from "./Admin/AdminDashboard"
import Footer from "./Footer/Footer"
import Copyright from "./Copyright/Copyright"
import { AuthProvider } from "./Context/AuthContext"

const PrivateAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
        setIsAdmin(true);
    } 
    else {
    setIsAdmin(false);
    }

    setLoading(false);
  }, [])
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookappointment" element={<BookAppointment />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/admin-dashboard" element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>} />
        </Routes>
        <Footer />
        <Copyright />
      </Router>
    </AuthProvider>
  )
}