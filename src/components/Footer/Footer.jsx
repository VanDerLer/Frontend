// src/components/Footer/Footer.jsx
import { FaFacebook, FaTwitter, FaVimeoV, FaYoutube } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import shapeDefault from "../../assets/svg/shape.svg";
import shapeHome from "../../assets/svg/shape-home.svg"; // ✅ shape laranja
import "../../styles/Footer/Footer.css";

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className="vd-footer">
      {/* ONDA DO TOPO */}
      <img
        src={isHome ? shapeHome : shapeDefault} // ✅ laranja só na home
        alt="onda decorativa"
        className="vd-footer__shape"
      />

      {/* CONTEÚDO DO FOOTER */}
      <div className="vd-footer__content">
        {/* PARTE DE CIMA: links + redes */}
        <div className="vd-footer__top">
          <nav className="vd-footer__nav">
            <button>Sobre</button>
            <button>Sla</button>
            <button>Explorar</button>
            <button>Livros</button>
          </nav>

          <div className="vd-footer__social">
            <button className="vd-footer__icon" aria-label="Facebook">
              <FaFacebook />
            </button>
            <button className="vd-footer__icon" aria-label="Twitter">
              <FaTwitter />
            </button>
            <button className="vd-footer__icon" aria-label="Vimeo">
              <FaVimeoV />
            </button>
            <button className="vd-footer__icon" aria-label="YouTube">
              <FaYoutube />
            </button>
          </div>
        </div>

        {/* LINHA */}
        <div className="vd-footer__line" />

        {/* PARTE DE BAIXO: © e Termos */}
        <div className="vd-footer__bottom">
          <span>© 2025 VanDerLer</span>
          <button className="vd-footer__terms">Termos e privacidade</button>
        </div>
      </div>
    </footer>
  );
}
