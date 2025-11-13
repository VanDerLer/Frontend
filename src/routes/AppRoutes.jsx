import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import BookDetail from "../pages/BookDetail/BookDetail"; // a gente cria depois

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* essa rota vai ser protegida no futuro */}
      <Route path="/books/:id" element={<BookDetail />} />
    </Routes>
  );
}
