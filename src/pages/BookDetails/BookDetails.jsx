// src/pages/BookDetail/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import bear from "../../assets/svg/bear.svg";
import defaultCover from "../../assets/covers/default-cover.jpg";

import {
  getBookSummary,
  listMyLibrary,
  addToLibrary,
  removeFromLibrary,
} from "../../service/bookService";

import "../../styles/BookDetails/BookDetails.css";

export default function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [errorBook, setErrorBook] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [loadingLibraryAction, setLoadingLibraryAction] = useState(false);
  const [errorLibrary, setErrorLibrary] = useState("");

  // === Carrega dados do livro ===
  useEffect(() => {
    async function fetchBook() {
      try {
        setLoadingBook(true);
        setErrorBook("");

        const data = await getBookSummary(id);
        if (!data) {
          setErrorBook("Livro não encontrado.");
          setBook(null);
        } else {
          setBook(data);
        }
      } catch (err) {
        console.error("[BookDetail] erro ao buscar livro:", err);
        setErrorBook("Não foi possível carregar os detalhes deste livro.");
        setBook(null);
      } finally {
        setLoadingBook(false);
      }
    }

    if (id) fetchBook();
  }, [id]);

  // === Verifica se o livro está na biblioteca do usuário ===
  useEffect(() => {
    async function checkLibrary() {
      try {
        setErrorLibrary("");

        const myBooks = await listMyLibrary();
        const found = myBooks.some((b) => String(b.id) === String(id));
        setIsSaved(found);
      } catch (err) {
        // Se der 401/403 aqui, provavelmente o usuário não está logado.
        console.warn("[BookDetail] erro ao carregar biblioteca do usuário:", err);
        setErrorLibrary(
          "Não foi possível verificar se este livro está na sua biblioteca."
        );
      }
    }

    if (id) {
      checkLibrary();
    }
  }, [id]);

  async function handleSalvar() {
    try {
      setLoadingLibraryAction(true);
      setErrorLibrary("");

      await addToLibrary(id);
      setIsSaved(true);
    } catch (err) {
      console.error("[BookDetail] erro ao adicionar livro à biblioteca:", err);
      setErrorLibrary(
        "Erro ao salvar o livro na sua biblioteca. Tente novamente."
      );
    } finally {
      setLoadingLibraryAction(false);
    }
  }

  async function handleDevolver() {
    try {
      setLoadingLibraryAction(true);
      setErrorLibrary("");

      await removeFromLibrary(id);
      setIsSaved(false);
    } catch (err) {
      console.error("[BookDetail] erro ao remover livro da biblioteca:", err);
      setErrorLibrary(
        "Erro ao devolver o livro. Tente novamente em instantes."
      );
    } finally {
      setLoadingLibraryAction(false);
    }
  }

  if (loadingBook) {
    return (
      <div className="book-details-page">
        <div className="book-details-inner">
          <p className="book-details-loading">Carregando detalhes do livro...</p>
        </div>
      </div>
    );
  }

  if (errorBook || !book) {
    return (
      <div className="book-details-page">
        <div className="book-details-inner">
          <p className="book-details-error">
            {errorBook || "Livro não encontrado."}
          </p>
        </div>
      </div>
    );
  }

  const title = book.titulo || book.title || "Livro sem título";
  const author = book.autor || book.author || "Autor desconhecido";
  const genre = "Não informado"; // o back ainda não tem campo de gênero
  const cover = defaultCover;
  const description = book.descricao || book.description || "Sem descrição disponível.";

  const paragraphs = description
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="book-details-page">
      <div className="book-details-inner">
        <section className="book-details-row">
          {/* CAPA */}
          <aside className="book-details-sidebar">
            <div className="book-details-cover">
              <img src={cover} alt={`Capa do livro ${title}`} />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="book-details-main">
            {/* TÍTULO + BOTÕES */}
            <header className="book-details-header">
              <h1 className="book-details-title">{title}</h1>

              <div className="book-details-actions">
                {isSaved && (
                  <div className="book-details-badge book-details-badge--saved">
                    <span className="book-details-badge-text">Livro salvo</span>
                    <span className="book-details-badge-check">✓</span>
                  </div>
                )}

                {isSaved ? (
                  <button
                    type="button"
                    className="book-details-btn book-details-btn--return"
                    onClick={handleDevolver}
                    disabled={loadingLibraryAction}
                  >
                    {loadingLibraryAction ? "Devolvendo..." : "Devolver"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="book-details-btn book-details-btn--return"
                    onClick={handleSalvar}
                    disabled={loadingLibraryAction}
                  >
                    {loadingLibraryAction
                      ? "Salvando..."
                      : "Salvar na minha biblioteca"}
                  </button>
                )}
              </div>
            </header>

            {/* META */}
            <div className="book-details-meta">
              <p>
                <span className="book-details-label">Autor: </span>
                <span className="book-details-linklike">{author}</span>
              </p>
              <p>
                <span className="book-details-label">Gênero: </span>
                <span>{genre}</span>
              </p>
            </div>

            {/* ERRO RELACIONADO À BIBLIOTECA */}
            {errorLibrary && (
              <p className="book-details-error book-details-error--small">
                {errorLibrary}
              </p>
            )}

            {/* DESCRIÇÃO */}
            <section className="book-details-description">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </section>
          </section>
        </section>

        {/* URSINHO FIXO NO CANTO */}
        <img src={bear} alt="Urso lendo" className="book-details-bear" />
      </div>
    </div>
  );
}
