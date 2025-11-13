// src/components/BookCard/BookCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import defaultCover from "../../assets/covers/default-cover.jpg"; // ✅ .jpg aqui
import "../../styles/Bookcard/BookCard.css"; // ✅ caminho real do CSS

/**
 * BookCard
 *
 * Props:
 * - id: string | number  -> identificador do livro (usado na navegação)
 * - title: string
 * - author: string
 * - cover: string (url)
 * - badge: string (ex: "Reservado", "Novo") optional
 * - onClick: function optional -> executado após checagem de auth; recebe id
 */
export default function BookCard({ id, title, author, cover, badge, onClick }) {
  const navigate = useNavigate();

  // deixa o hook seguro (caso useAuth não exista em algum lugar de teste)
  const auth = typeof useAuth === "function" ? useAuth() : null;
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const handleClick = (e) => {
    e.preventDefault();

    if (isAuthenticated) {
      if (onClick) {
        onClick(id);
        return;
      }
      navigate(`/books/${id}`);
      return;
    }

    navigate("/login", { state: { from: `/books/${id}` } });
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
          src={cover || defaultCover} // ✅ se não vier cover, usa a padrão
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
  cover: defaultCover, // ✅ padrão global
  badge: null,
  onClick: null,
};
