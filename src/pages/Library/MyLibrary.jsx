// src/pages/Library/MyLibrary.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listMyLibrary } from "../../service/bookService";
import BookCard from "../../components/BookCard/BookCard";
import defaultCover from "../../assets/covers/default-cover.jpg";

import "../../styles/BookDetails/BookDetails.css"; // reaproveita tipografia se quiser

export default function MyLibrary() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLibrary() {
      try {
        setLoading(true);
        setErro("");

        const data = await listMyLibrary();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[MyLibrary] erro ao carregar biblioteca:", err);
        setErro(
          "Não foi possível carregar sua biblioteca. Verifique se está logado."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, []);

  function handleVoltarHome() {
    navigate("/");
  }

  return (
    <div className="book-details-page">
      <div className="book-details-inner">
        <header className="book-details-header" style={{ marginBottom: "1.5rem" }}>
          <h1 className="book-details-title">Minha biblioteca</h1>

          <button
            type="button"
            className="book-details-btn book-details-btn--return"
            onClick={handleVoltarHome}
          >
            Voltar para a página inicial
          </button>
        </header>

        {loading && <p className="book-details-loading">Carregando livros...</p>}

        {!loading && erro && (
          <p className="book-details-error">{erro}</p>
        )}

        {!loading && !erro && books.length === 0 && (
          <p className="book-details-empty">
            Você ainda não salvou nenhum livro.  
            Acesse um livro e clique em “Salvar na minha biblioteca”.
          </p>
        )}

        {!loading && !erro && books.length > 0 && (
          <div className="books-row">
            {books.map((book) => {
              const id = book.id;
              const title = book.titulo || book.title || "Livro sem título";
              const author =
                book.autor || book.author || "Autor não informado";
              const cover = defaultCover;

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
        )}
      </div>
    </div>
  );
}
