import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await login(email, senha);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErro("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="auth-page">
        <section className="auth-illustration">
          <h2>Login</h2>
          <p>
            Faça login para reservar seus livros com segurança e continuar de
            onde parou.
          </p>
          <div className="auth-characters">📚✨</div>
        </section>

        <section className="auth-card">
          <h1 className="auth-title">Bem-vindo de volta!</h1>
          <p className="auth-subtitle">
            Digite seus dados para acessar sua conta VanDerLer.
          </p>

          {erro && <div className="auth-error">{erro}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer">
            Não tem uma conta?{" "}
            <Link to="/cadastro" style={{ color: "#f97316" }}>
              Cadastre-se aqui
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
