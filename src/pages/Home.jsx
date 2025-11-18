import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarLivros, criarLivro, deletarLivro } from "../services/bookService.js";
import { adicionarNaMinhaBiblioteca } from "../services/libraryService.js";
import { useAuth } from "../context/AuthContext.jsx";
import BookCard from "../components/BookCard.jsx";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  // form admin
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoAutor, setNovoAutor] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const data = await listarLivros();
        setLivros(data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar catálogo.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const term = busca.trim().toLowerCase();
    if (!term) return livros;
    return livros.filter(
      (b) =>
        b.titulo.toLowerCase().includes(term) ||
        b.autor.toLowerCase().includes(term)
    );
  }, [livros, busca]);

  async function handleAddToLibrary(id) {
  if (!user) {
    navigate("/login");
    return;
  }
  try {
    await adicionarNaMinhaBiblioteca(id);
    alert("Livro adicionado à sua biblioteca!");
  } catch (err) {
    console.error(err);
    if (err?.response?.status === 403) {
      alert("Você não tem permissão para adicionar este livro.");
    } else {
      alert("Não foi possível adicionar o livro.");
    }
  }
}

  function handleRead(id) {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/livros/${id}`);
  }

  async function handleAdminCreate(e) {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      const payload = {
        titulo: novoTitulo,
        autor: novoAutor,
        descricao: novaDescricao,
        conteudo: novoConteudo,
      };
      const criado = await criarLivro(payload);
      setLivros((prev) => [...prev, criado]);
      setNovoTitulo("");
      setNovoAutor("");
      setNovaDescricao("");
      setNovoConteudo("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar livro.");
    }
  }

  async function handleAdminDelete(id) {
    if (!isAdmin) return;
    if (!window.confirm("Remover este livro do catálogo?")) return;
    try {
      await deletarLivro(id);
      setLivros((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao remover livro.");
    }
  }

  return (
    <div className="page">
      <div className="hero-shell">
        <section className="hero-card">
          <div className="hero-fox"></div>
          <div>
            <div className="hero-text-title">O poder das palavras em suas mãos</div>
            
            <p className="hero-text-sub">
              Explore livros que vão acender a imaginação. Adicione ao seu acervo
              e leia em qualquer lugar.
            </p>
          </div>
        </section>
        <br/>

        <section className="hero-side">
          <div className="field" style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Busque por título ou autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </section>
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {carregando && <p>Carregando livros...</p>}

      {!carregando && (
        <>
          <section>
            <h2 style={{ marginBottom: 10 }}>Catálogo de livros</h2>
            <div className="grid">
              {filtrados.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAdd={handleAddToLibrary}
                  onRead={handleRead}
                  isAdmin={isAdmin}
                  onAdminDelete={handleAdminDelete}
                />
              ))}
            </div>
            {filtrados.length === 0 && <p>Nenhum livro encontrado.</p>}
          </section>

          {isAdmin && (
            <section style={{ marginTop: 32 }}>
              <h2>Área secreta do administrador 🔐</h2>
              <p style={{ fontSize: 14, color: "#6b7280" }}>
                Aqui você pode cadastrar novos livros e removê-los do catálogo.
              </p>

              <form
                onSubmit={handleAdminCreate}
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="field">
                  <label>Título</label>
                  <input
                    type="text"
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Autor</label>
                  <input
                    type="text"
                    value={novoAutor}
                    onChange={(e) => setNovoAutor(e.target.value)}
                    required
                  />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Descrição curta</label>
                  <input
                    type="text"
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                  />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Conteúdo do livro</label>
                  <textarea
                    value={novoConteudo}
                    onChange={(e) => setNovoConteudo(e.target.value)}
                    required
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <button className="btn-primary" type="submit">
                    Cadastrar livro
                  </button>
                </div>
              </form>
            </section>
          )}
        </>
      )}
    </div>
  );
}
