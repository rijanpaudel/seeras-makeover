import React from "react"
import Navbar from "./Navbar/navbar"
import Register from "./Register/Register"
import Login from "./Login/login"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  )
}