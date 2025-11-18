import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lerLivro } from "../services/bookService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ReadBook() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    async function carregar() {
      try {
        setCarregando(true);
        const data = await lerLivro(id);
        setLivro(data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 403) {
          setErro(
            "Você precisa ter este livro na sua biblioteca ou ser administrador para ler."
          );
        } else {
          setErro("Erro ao carregar o livro.");
        }
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id, user, navigate]);

  if (!user) return null;

  return (
    <div className="page">
      {carregando && <p>Carregando livro...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {livro && !carregando && (
        <div className="card">
          <h1 style={{ marginTop: 0 }}>{livro.titulo}</h1>
          <p style={{ marginTop: 4, color: "#6b7280" }}>{livro.autor}</p>
          <hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            {livro.conteudo}
          </div>
        </div>
      )}
    </div>
  );
}
