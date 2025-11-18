import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { atualizarNome } from "../services/userService.js";

export default function Profile() {
  const { user, updateNameLocally } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState(user?.nome || "");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    try {
      setSalvando(true);
      await atualizarNome(nome);
      updateNameLocally(nome);
      setMensagem("Nome atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setErro("Não foi possível atualizar seu nome.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page">
      <div className="profile-grid">
        <section className="profile-card">
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Informações pessoais</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18 }}>
            Você pode alterar apenas o seu nome. E-mail e tipo de conta são
            definidos pelo sistema.
          </p>

          <form
            onSubmit={handleSalvar}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>E-mail</label>
              <input value={user.email} disabled />
            </div>

            <div className="field">
              <label>Tipo de conta</label>
              <input
                value={user.role === "ADMIN" ? "Administrador" : "Usuário"}
                disabled
              />
            </div>

            {erro && <div className="auth-error">{erro}</div>}
            {mensagem && (
              <div
                style={{
                  background: "#ecfdf5",
                  color: "#16a34a",
                  borderRadius: 14,
                  padding: "8px 10px",
                  fontSize: 13,
                }}
              >
                {mensagem}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>

        <section className="auth-illustration" style={{ minHeight: 0 }}>
          <h2>Reserve, leia, releia.</h2>
          <p>
            O VanDerLer guarda seus livros favoritos em um só lugar. Continue
            construindo a sua história de leitura.
          </p>
          <div className="auth-characters">📖💫</div>
        </section>
      </div>
    </div>
  );
}
