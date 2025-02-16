import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Home from "./Home/Home";
import BookAppointment from "./BookAppointment/BookAppointment";
import ProductsPage from "./Product/ProductsPage";
import ProductDetailsPage from "./Product/ProductDetailsPage";
import Services from "./Services/Services";
import AboutUs from "./Aboutus/Aboutus";
import Enroll from "./Enroll/Enroll";
import Footer from "./Footer/Footer";
import Copyright from "./Copyright/Copyright";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import AdminApp from "./Admin/AdminApp";

export default function App() {
  // Scroll to top component
  const ScrollToTop = () => {
    const location = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0); // Reset scroll position to top on route change
    }, [location]);

    return null;
  };
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
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
                    <Route path="/products/product/:id" element={<ProductDetailsPage />} />
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
      </CartProvider>
    </AuthProvider>
  );
}
