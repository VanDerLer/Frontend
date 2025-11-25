import React, { useEffect, useState } from "react";
import "../../styles/Profile/Profile.css";

import { getMyProfile, updateMyProfile } from "../../service/userService";
import { getUsuarioAtual } from "../../service/authService";

import PurpleTree from "../../assets/svg/PurpleTree.svg";
import CloudGirl from "../../assets/svg/CloudGirl.svg";
import BookCard from "../../components/BookCard/BookCard";
import defaultCover from "../../assets/covers/default-cover.jpg";
import { listMyLibrary } from "../../service/bookService";

export default function Profile() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaFake] = useState("*******");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [myBooks, setMyBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // carrega dados do usuário
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(true);
        setErrorMsg("");

        const data = await getMyProfile();
        setNome(data.nome || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error("[Profile] erro ao carregar perfil:", err);
        setErrorMsg("Não foi possível carregar seus dados.");
      } finally {
        setLoadingProfile(false);
      }
    }

    // carrega livros reservados
    async function loadBooks() {
      try {
        setLoadingBooks(true);
        const data = await listMyLibrary();
        setMyBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[Profile] erro ao carregar biblioteca:", err);
      } finally {
        setLoadingBooks(false);
      }
    }

    const user = getUsuarioAtual();
    if (user) {
      loadProfile();
      loadBooks();
    } else {
      setErrorMsg("Faça login para acessar seu perfil.");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      await updateMyProfile({ nome, email });
      setSuccessMsg("Alterações salvas com sucesso!");
    } catch (err) {
      console.error("[Profile] erro ao salvar perfil:", err);
      setErrorMsg("Não foi possível salvar suas alterações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      {/* árvore à esquerda */}
      <img src={PurpleTree} alt="" className="profile-tree" />

      {/* menina à direita */}
      <img src={CloudGirl} alt="" className="profile-girl" />

      <div className="profile-inner">
        <h1 className="profile-title">Informações pessoais</h1>

        <section className="profile-card">
          <form className="profile-form" onSubmit={handleSubmit}>
            {/* NOME */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                className="profile-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                disabled={loadingProfile || saving}
              />
            </div>

            {/* EMAIL */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="profile-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loadingProfile || saving}
              />
            </div>

            {/* SENHA (apenas visual) */}
            <div className="profile-field">
              <label className="profile-label" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                className="profile-input profile-input--disabled"
                value={senhaFake}
                readOnly
              />
            </div>

            {errorMsg && <p className="profile-message profile-message--error">{errorMsg}</p>}
            {successMsg && (
              <p className="profile-message profile-message--success">
                {successMsg}
              </p>
            )}

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving || loadingProfile}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </section>

        {/* RESERVADOS */}
        <section className="profile-reserved">
          <h2 className="profile-reserved__title">Reservados</h2>

          {loadingBooks && (
            <p className="profile-reserved__empty">Carregando seus livros...</p>
          )}

          {!loadingBooks && myBooks.length === 0 && (
            <p className="profile-reserved__empty">
              Você ainda não reservou nenhum livro.
            </p>
          )}

          {!loadingBooks && myBooks.length > 0 && (
            <div className="profile-reserved__list">
              {myBooks.map((book) => (
                <div key={book.id} className="profile-reserved__item">
                  <BookCard
                    id={book.id}
                    title={book.titulo || book.title}
                    author={book.autor || book.author}
                    cover={defaultCover}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
