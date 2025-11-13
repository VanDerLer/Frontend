import { Link } from "react-router-dom";
import "../../styles/Navbar/Navbar.css";

export default function Navbar() {
  const user = {
    name: "Nicolas",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&h=80&fit=crop&crop=faces",
  };

  return (
    <header className="vd-nav">
      <div className="vd-nav__inner">
        {/* LOGO */}
        <div className="vd-nav__logo">
          <span className="vd-nav__logo-text">VanDerLer</span>
        </div>

        {/* LINKS CENTRAIS */}
        <ul className="vd-nav__links">
          <li>
            <Link to="/my-books">Reservados</Link>
          </li>
          <li>
            <Link to="/home">Procurar Livros</Link>
          </li>
          <li>
            <Link to="/books">Livros</Link>
          </li>
        </ul>

        {/* PERFIL */}
        <div className="vd-nav__profile">
          {user ? (
            <Link to="/profile" className="vd-nav__avatar-wrap">
              <img
                src={user.avatar}
                alt={user.name}
                className="vd-nav__avatar-img"
              />
            </Link>
          ) : (
            <Link to="/login" className="vd-nav__login">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
