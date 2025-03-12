import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Home from "./Home/Home";
import BookAppointment from "./BookAppointment/BookAppointment";
import ProductsPage from "./Product/ProductsPage";
import ProductDetailsPage from "./Product/ProductDetailsPage";
import CheckoutPage from "./Product/CheckoutPage";
import Services from "./Services/Services";
import ServiceDetails from "./Services/ServiceDetails";
import AboutUs from "./AboutUs/AboutUs";
import Enroll from "./Enroll/Enroll";
import CourseProgress from "./Enroll/CourseProgress";
import Footer from "./Footer/Footer";
import Copyright from "./Copyright/Copyright";
import MyAccount from "./MyAccount/MyAccount";
import { AuthProvider } from "./Context/AuthContext";
import AdminApp from "./Admin/AdminApp";
import CartPage from "./Product/CartPage";

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
        <Router>
          <ScrollToTop />
          <Routes>
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
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetails />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/enroll" element={<Enroll />} />
                    <Route path="/courses/progress/:enrollmentId" element={<CourseProgress />} />
                    <Route path="/myaccount" element={<MyAccount />} />
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
