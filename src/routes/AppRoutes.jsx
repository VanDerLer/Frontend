import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Library from "../pages/Library.jsx";
import ReadBook from "../pages/ReadBook.jsx";
import Profile from "../pages/Profile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/biblioteca" element={<Library />} />
      <Route path="/livros/:id" element={<ReadBook />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
