import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarMinhaBiblioteca, removerDaMinhaBiblioteca } from "../services/libraryService.js";
import { useAuth } from "../context/AuthContext.jsx";
import BookCard from "../components/BookCard.jsx";

export default function Library() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    async function carregar() {
      try {
        setCarregando(true);
        const data = await listarMinhaBiblioteca();
        setLivros(data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar sua biblioteca.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [user, navigate]);

  async function handleRemover(id) {
    if (!window.confirm("Remover este livro da sua biblioteca?")) return;
    try {
      await removerDaMinhaBiblioteca(id);
      setLivros((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Não foi possível remover o livro.");
    }
  }

  function handleRead(id) {
    navigate(`/livros/${id}`);
  }

  return (
    <div className="page">
      <div className="hero-shell" style={{ marginBottom: 18 }}>
        <section className="hero-card" style={{ gridColumn: "1 / -1", minHeight: 0 }}>
          <div className="hero-fox">📚</div>
          <div>
            <div className="hero-text-title">Sua biblioteca digital</div>
            <p className="hero-text-sub">
              Aqui ficam os livros que você adicionou. Clique em ler para
              continuar sua jornada.
            </p>
          </div>
        </section>
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {carregando && <p>Carregando sua biblioteca...</p>}

      {!carregando && (
        <>
          {livros.length === 0 ? (
            <p>Você ainda não adicionou nenhum livro.</p>
          ) : (
            <div className="grid">
              {livros.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isInLibrary
                  onRemove={handleRemover}
                  onRead={handleRead}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
