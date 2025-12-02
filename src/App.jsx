// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import BookDetail from "./pages/BookDetails/BookDetails";
import FaceRegistration from "./pages/FaceRegistration/FaceRegistration";
import FaceVerification from "./pages/FaceVerification/FaceVerification";
import Profile from "./pages/Profile/Profile";
import ReservedBooks from "./pages/ReservedBooks/ReservedBooks"; // ✅ nova tela

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import homeBg from "./assets/svg/background.svg";
import pinkInfoBg from "./assets/infos/info-bg-pink.png";
import purpleProfileBg from "./assets/auth/register-bg-purple.png"; // fundo roxo

function App() {
  const location = useLocation();
  const path = location.pathname;

  // telas sem navbar/footer
  const hideLayout =
    ["/login", "/register", "/face-registration"].includes(path) ||
    path.startsWith("/face-verification");

  const isHome = path === "/";
  const isBookDetail = path.startsWith("/books");
  const isProfile = path.startsWith("/profile");
  const isReserved = path.startsWith("/reserved"); // ✅ reservados

  // classes da div raiz
  let wrapperClasses = "min-h-screen flex flex-col";
  if (!isHome && !isBookDetail && !isProfile && !isReserved) {
    // outras telas seguem com fundo branco
    wrapperClasses += " bg-white";
  }

  // estilo de background por rota
  let backgroundStyle = undefined;

  if (isHome) {
    backgroundStyle = {
      backgroundImage: `url(${homeBg})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top center",
      backgroundSize: "cover",
    };
  } else if (isBookDetail) {
    backgroundStyle = {
      backgroundImage: `url(${pinkInfoBg})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  } else if (isProfile || isReserved) {
    // ✅ perfil e reservados usam o mesmo fundo roxo
    backgroundStyle = {
      backgroundImage: `url(${purpleProfileBg})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return (
    <div className={wrapperClasses} style={backgroundStyle}>
      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* cadastro facial */}
          <Route path="/face-registration" element={<FaceRegistration />} />
          {/* verificação facial antes de abrir o livro */}
          <Route path="/face-verification/:id" element={<FaceVerification />} />
          {/* perfil */}
          <Route path="/profile" element={<Profile />} />
          {/* livros reservados */}
          <Route path="/reserved" element={<ReservedBooks />} /> {/* ✅ */}
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      {/* não tem footer na tela de detalhes */}
      {!hideLayout && !isBookDetail && <Footer />}
    </div>
  );
}

export default App;
