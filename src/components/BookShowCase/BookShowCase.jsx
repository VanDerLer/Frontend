// src/components/BookShowCase/BookShowCase.jsx
import React, { useEffect, useState, useMemo } from "react";
import "../../styles/BookShowCase/BooksShowCase.css";
import BookCard from "../BookCard/BookCard";
import defaultCover from "../../assets/covers/default-cover.jpg";

import { listBooks } from "../../service/bookService";

const CATEGORIES = ["Ficção", "Romance", "Drama", "Ação", "Infantil"];

export default function BookShowCase() {
  const [activeCategory, setActiveCategory] = useState("Ficção");

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorBooks, setErrorBooks] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoadingBooks(true);
        setErrorBooks("");

        // 🔹 hoje o back não tem categoria, então traz tudo
        const data = await listBooks();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[BookShowCase] erro ao carregar livros:", err);
        setErrorBooks("Não foi possível carregar os livros.");
        setBooks([]);
      } finally {
        setLoadingBooks(false);
      }
    }

    fetchBooks();
  }, []);

  // 🔹 Aqui a mágica das categorias
  const filteredBooks = useMemo(() => {
    if (!books || books.length === 0) return [];

    // 1) Se o back JÁ tiver campo "categoria", usa ele pra filtrar certinho
    if (books.some((b) => b.categoria)) {
      return books.filter(
        (b) =>
          (b.categoria || "").toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // 2) Fallback: enquanto o back não tem categoria,
    // distribui os livros de forma "fake" pelas abas,
    // só pra não ficar tudo igual em todas.
    const catIndex = CATEGORIES.indexOf(activeCategory);
    if (catIndex === -1) return books;

    return books.filter((_, idx) => idx % CATEGORIES.length === catIndex);
  }, [books, activeCategory]);

  // "Os mais adquiridos" (top 5 geral por enquanto)
  const bestSellers = books.slice(0, 5);

  return (
    <section className="books-showcase">
      <div className="books-showcase__inner">
        {/* ====== ABA DE CATEGORIAS + LISTA DE LIVROS ====== */}
        <div className="books-top">
          <nav className="books-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`books-tab ${
                  cat === activeCategory ? "books-tab--active" : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="books-row">
            {loadingBooks && (
              <p className="books-empty">Carregando livros...</p>
            )}

            {!loadingBooks && errorBooks && (
              <p className="books-empty">{errorBooks}</p>
            )}

            {!loadingBooks &&
              !errorBooks &&
              filteredBooks.length === 0 &&
              books.length > 0 && (
                <p className="books-empty">
                  Não há livros nessa categoria ainda.
                </p>
              )}

            {!loadingBooks &&
              !errorBooks &&
              books.length === 0 && (
                <p className="books-empty">Ainda não há livros cadastrados.</p>
              )}

            {!loadingBooks &&
              !errorBooks &&
              filteredBooks.map((book) => {
                const id = book.id;
                const title = book.titulo || book.title || "Livro sem título";
                const author =
                  book.autor || book.author || "Autor não informado";
                const cover = defaultCover; // 🔸 por enquanto o back não tem capa

                return (
                  <div key={id} className="books-row__item">
                    <BookCard
                      id={id}
                      title={title}
                      author={author}
                      cover={cover}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* LINHA ENTRE AS SEÇÕES */}
        <div className="books-divider" />

        {/* ====== OS MAIS ADQUIRIDOS ====== */}
        <div className="books-bottom">
          <h2 className="books-bottom__title">Os mais adquiridos</h2>

          {bestSellers.length === 0 && !loadingBooks && !errorBooks && (
            <p className="books-empty">
              Ainda não há livros marcados como mais adquiridos.
            </p>
          )}

          {bestSellers.length > 0 && (
            <div className="best-sellers-row">
              {bestSellers.map((book, index) => {
                const id = book.id;
                const title =
                  book.titulo || book.title || "Livro sem título";
                const cover = defaultCover;
                const rank = index + 1;

                return (
                  <div key={id} className="best-seller-card">
                    <div className="best-seller-card__rank">{rank}</div>

                    <div className="best-seller-card__image-wrapper">
                      <img
                        src={cover}
                        alt={`Capa do livro ${title}`}
                        className="best-seller-card__image"
                      />
                    </div>

                    <p className="best-seller-card__title">{title}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
