// src/components/BookCard/BookCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { getUsuarioAtual } from "../../service/authService";
import defaultCover from "../../assets/covers/default-cover.jpg";
import "../../styles/Bookcard/BookCard.css";

/**
 * BookCard
 *
 * Props:
 * - id: string | number  -> identificador do livro (usado na navegação)
 * - title: string
 * - author: string
 * - cover: string (url)
 * - badge: string (ex: "Reservado", "Novo") optional
 * - onClick: function optional -> se quiser sobrescrever o comportamento padrão
 */
export default function BookCard({ id, title, author, cover, badge, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    // Se tiver onClick customizado, usa ele
    if (onClick) {
      onClick(id);
      return;
    }

    // Lê o usuário da sessão (localStorage)
    const currentUser = getUsuarioAtual();
    const isAuthenticated = !!currentUser;

    // Flag de biometria:
    // - pode vir do back (biometriaCadastrada)
    // - ou do localStorage que marcamos depois do cadastro
    const localBiometricFlag =
      localStorage.getItem("vanderler_biometria") === "true";
    const hasBiometrics =
      currentUser?.biometriaCadastrada === true || localBiometricFlag;

    // 1) Não logado → manda pro login
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/books/${id}` } });
      return;
    }

    // 2) Logado, mas sem biometria → manda pro cadastro facial
    if (!hasBiometrics) {
      navigate("/face-registration", { state: { from: `/books/${id}` } });
      return;
    }

    // 3) Logado + biometria cadastrada → manda pra verificação facial
    navigate(`/face-verification/${id}`, {
      state: { from: `/books/${id}` },
    });
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" ? handleClick(e) : null)}
      className="book-card"
      aria-label={`Abrir detalhes do livro ${title}`}
    >
      <div className="book-card__cover-wrapper">
        <img
          src={cover || defaultCover}
          alt={`Capa do livro ${title}`}
          className="book-card__cover"
          loading="lazy"
        />

        {badge && <span className="book-card__badge">{badge}</span>}
      </div>

      <div className="book-card__info">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  cover: PropTypes.string,
  badge: PropTypes.string,
  onClick: PropTypes.func,
};

BookCard.defaultProps = {
  author: "Autor não informado",
  cover: defaultCover,
  badge: null,
  onClick: null,
};
