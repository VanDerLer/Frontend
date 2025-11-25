import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import BookDetails from "../pages/BookDetails/BookDetails";
import FaceRegistration from "../pages/FaceRegistration/FaceRegistration";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/face-registration" element={<FaceRegistration />} />

      <Route path="/books/:id" element={<BookDetails />} />
    </Routes>
  );
}
