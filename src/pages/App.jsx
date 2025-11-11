import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">FaceOnly Library</div>
        <nav>
          <Link to="/register">Cadastrar Face</Link>
          <Link to="/login">Entrar</Link>
          <Link to="/books">Livros</Link>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">© {new Date().getFullYear()} FaceOnly • Demo</footer>
    </div>
  )
}
