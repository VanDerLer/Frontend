import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          VanDerLer
        </NavLink>
      </div>

      <nav className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " navbar-link-active" : "")
          }
        >
          Catálogo
        </NavLink>
        <NavLink
          to="/biblioteca"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " navbar-link-active" : "")
          }
        >
          Livros salvos
        </NavLink>
        {user && (
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              "navbar-link" + (isActive ? " navbar-link-active" : "")
            }
          >
            Perfil
          </NavLink>
        )}
      </nav>

      <div className="navbar-auth">
        {user ? (
          <>
            <div className="navbar-user-chip">
              <span style={{ fontSize: 12, opacity: 0.8 }}>Logado como </span>
              <strong style={{ fontSize: 13 }}>{user.nome}</strong>
            </div>
            <button className="btn-ghost" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-link">
              Entrar
            </NavLink>
            <NavLink to="/cadastro" className="btn-primary">
              Começar
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
