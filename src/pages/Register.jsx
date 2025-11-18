import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await register(nome, email, senha);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErro("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="auth-page">
        <section className="auth-illustration">
          <h2>Crie sua conta</h2>
          <p>
            Monte uma biblioteca digital segura para guardar e acompanhar seus
            livros favoritos.
          </p>
          <div className="auth-characters">👩‍👧📖</div>
        </section>

        <section className="auth-card">
          <h1 className="auth-title">Cadastro</h1>
          <p className="auth-subtitle">
            Preencha os dados para começar a usar o VanDerLer.
          </p>

          {erro && <div className="auth-error">{erro}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="confirmar">Confirmar senha</label>
              <input
                id="confirmar"
                type="password"
                placeholder="Repita sua senha"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Começar"}
            </button>
          </form>

          <div className="auth-footer">
            Já tem uma conta?{" "}
            <Link to="/login" style={{ color: "#f97316" }}>
              Entre aqui
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
