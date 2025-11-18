import React from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-shell-header">
        <span className="app-shell-dot red" />
        <span className="app-shell-dot yellow" />
        <span className="app-shell-dot green" />
      </div>
      <div className="app-root">
        <Navbar />
        <main className="app-main">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}
