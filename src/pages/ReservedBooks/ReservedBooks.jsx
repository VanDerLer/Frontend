// src/pages/ReservedBooks/ReservedBooks.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/ReservedBooks/ReservedBooks.css";

import { listMyLibrary } from "../../service/bookService";
import { getUsuarioAtual } from "../../service/authService";

import BookCard from "../../components/BookCard/BookCard";
import defaultCover from "../../assets/covers/default-cover.jpg";

import PurpleTree from "../../assets/svg/PurpleTree.svg";
import CloudGirl from "../../assets/svg/CloudGirl.svg";

export default function ReservedBooks() {
  const navigate = useNavigate();

  const [myBooks, setMyBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const user = getUsuarioAtual();

    if (!user) {
      setErrorMsg("Faça login para ver seus livros reservados.");
      return;
    }

    async function loadBooks() {
      try {
        setLoadingBooks(true);
        setErrorMsg("");

        const data = await listMyLibrary();
        setMyBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[ReservedBooks] erro ao carregar biblioteca:", err);
        setErrorMsg("Não foi possível carregar seus livros reservados.");
      } finally {
        setLoadingBooks(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <div className="reserved-page">
      {/* ilustrações de fundo */}
      <img src={PurpleTree} alt="" className="reserved-tree" />
      <img src={CloudGirl} alt="" className="reserved-girl" />

      <div className="reserved-inner">
        <header className="reserved-header">
          <h1 className="reserved-title">Livros reservados</h1>
          <p className="reserved-subtitle">
            Aqui ficam os títulos que já estão separadinhos só pra você 💜
          </p>
        </header>

        <section className="reserved-card">
          {errorMsg && (
            <p className="reserved-message reserved-message--error">
              {errorMsg}
            </p>
          )}

          {loadingBooks && !errorMsg && (
            <p className="reserved-message">Carregando seus livros...</p>
          )}

          {!loadingBooks && !errorMsg && myBooks.length === 0 && (
            <p className="reserved-message">
              Você ainda não fez nenhuma reserva.
            </p>
          )}

          {!loadingBooks && !errorMsg && myBooks.length > 0 && (
            <div className="reserved-list">
              {myBooks.map((book) => (
                <div key={book.id} className="reserved-item">
                  <span className="reserved-status">Reservado</span>

                  <div className="reserved-bookcard-wrapper">
                    <BookCard
                      id={book.id}
                      title={book.titulo || book.title}
                      author={book.autor || book.author}
                      cover={defaultCover}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="reserved-actions">
            <button
              type="button"
              className="reserved-back-btn"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
