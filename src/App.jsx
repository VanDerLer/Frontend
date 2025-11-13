import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import bg from "./assets/svg/background.svg"; 
function App() {
  const location = useLocation();

  const hideLayout = ["/login", "/register"].includes(location.pathname);
  const isHome = location.pathname === "/";

  const showBackground = !hideLayout && isHome;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        showBackground ? "bg-no-repeat bg-cover bg-top" : "bg-white"
      }`}
      style={showBackground ? { backgroundImage: `url(${bg})` } : undefined}
    >
      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
