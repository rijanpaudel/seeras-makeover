import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Home from "./Home/Home";
import BookAppointment from "./BookAppointment/BookAppointment";
import ProductsPage from "./Product/ProductsPage";
import Services from "./Services/Services";
import AboutUs from "./Aboutus/Aboutus";
import Enroll from "./Enroll/Enroll";
import Footer from "./Footer/Footer";
import Copyright from "./Copyright/Copyright";
import { AuthProvider } from "./Context/AuthContext";
import AdminApp from "./Admin/AdminApp";

export default function App() {
  return (
    <AuthProvider>
      <Router> 

        <Routes>
          {/* ✅ Routes that should include Navbar & Footer */}
          <Route
            path="/*"
            element={
              <>
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
                </Routes>
                <Footer />
                <Copyright />
              </>
            }
          />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>

      </Router>
    </AuthProvider>
  );
}
