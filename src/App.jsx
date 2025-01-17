import React from "react"
import Navbar from "./Navbar/navbar"
import Register from "./Register/Register"
import Login from "./Login/login"
import Home from "./Home/Home"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}