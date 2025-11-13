import React, { useState } from "react";
import "../../styles/BookShowCase/BooksShowCase.css"; // ✅ caminho real do CSS
import BookCard from "../BookCard/BookCard";
import defaultCover from "../../assets/covers/default-cover.jpg"; // ✅ .jpg e caminho certo

const CATEGORIES = ["Ficção", "Romance", "Drama", "Ação", "Infantil"];

// Livros por categoria (mock)
const BOOKS_BY_CATEGORY = {
  Ficção: [
    {
      id: 1,
      title: "Five Nights at Freddy's: The Fourth Closet",
      author: "Scott Cawthon",
      cover: defaultCover,
    },
    {
      id: 2,
      title: "Freddy",
      author: "Autor X",
      cover: defaultCover,
    },
    {
      id: 3,
      title: "The Silver Eyes",
      author: "Scott Cawthon",
      cover: defaultCover,
    },
    {
      id: 4,
      title: "The Fourth Closet",
      author: "Scott Cawthon",
      cover: defaultCover,
    },
  ],
  Romance: [
    {
      id: 5,
      title: "A Hipótese do Amor",
      author: "Ali Hazelwood",
      cover: defaultCover,
    },
    {
      id: 6,
      title: "Como eu era antes de você",
      author: "Jojo Moyes",
      cover: defaultCover,
    },
  ],
  Drama: [],
  Ação: [],
  Infantil: [],
};

// "Os mais adquiridos" (top 5)
const BEST_SELLERS = [
  {
    id: 101,
    rank: 1,
    title: "A Hipótese do AMOR",
    cover: defaultCover,
  },
  {
    id: 102,
    rank: 2,
    title: "Como eu era antes de você",
    cover: defaultCover,
  },
  {
    id: 103,
    rank: 3,
    title: "O poder da ação",
    cover: defaultCover,
  },
  {
    id: 104,
    rank: 4,
    title: "A guerra dos mundos",
    cover: defaultCover,
  },
  {
    id: 105,
    rank: 5,
    title: "Vamos dormir?",
    cover: defaultCover,
  },
];

export default function BookShowCase() {
  const [activeCategory, setActiveCategory] = useState("Ficção");
  const currentBooks = BOOKS_BY_CATEGORY[activeCategory] || [];

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
            {currentBooks.length === 0 && (
              <p className="books-empty">
                Ainda não há livros cadastrados nesta categoria.
              </p>
            )}

            {currentBooks.map((book) => (
              <div key={book.id} className="books-row__item">
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  cover={book.cover}
                />
              </div>
            ))}
          </div>
        </div>

        {/* LINHA LARANJA ENTRE AS SEÇÕES */}
        <div className="books-divider" />

        {/* ====== OS MAIS ADQUIRIDOS ====== */}
        <div className="books-bottom">
          <h2 className="books-bottom__title">Os mais adquiridos</h2>

          <div className="best-sellers-row">
            {BEST_SELLERS.map((book) => (
              <div key={book.id} className="best-seller-card">
                <div className="best-seller-card__rank">{book.rank}</div>

                <div className="best-seller-card__image-wrapper">
                  <img
                    src={book.cover || defaultCover}
                    alt={`Capa do livro ${book.title}`}
                    className="best-seller-card__image"
                  />
                </div>

                <p className="best-seller-card__title">{book.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
