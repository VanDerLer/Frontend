import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './pages/App.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Books from './pages/Books.jsx'
import Reader from './pages/Reader.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="books" element={<Books />} />
        <Route path="reader/:id" element={<Reader />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
