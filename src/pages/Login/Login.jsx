// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { logar } from "../../service/authService";

import orangeBg from "../../assets/auth/register-bg-orange.png";
import orangeBoy from "../../assets/auth/orange-boy.svg";

import greenBg from "../../assets/auth/register-bg-green.png";
import greenGirl from "../../assets/auth/green-girl.svg";

import "../../styles/Login/Login.css";

const THEMES = [
  {
    id: "orange",
    bg: orangeBg,
    character: orangeBoy,
    cardColor: "#F38F33",
    buttonColor: "#FFA863",
  },
  {
    id: "green",
    bg: greenBg,
    character: greenGirl,
    cardColor: "#7CC46E",
    buttonColor: "#3D9A46",
  },
];

function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export default function Login() {
  const navigate = useNavigate();

  // sorteia o tema uma vez
  const [theme] = useState(
    () => THEMES[Math.floor(Math.random() * THEMES.length)]
  );

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    senha: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const emailOk = isValidEmail(form.email);
  const passwordOk = form.senha.length > 0;

  const canSubmit = emailOk && passwordOk && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      senha: true,
    });

    if (!canSubmit) return;

    try {
      setLoading(true);
      setErro("");

      // 🔗 Chama o back e pega o retorno
      const data = await logar({
        email: form.email,
        senha: form.senha,
      });

      // Se não tiver biometria, obriga a ir pra tela facial
      if (!data.biometriaCadastrada) {
        navigate("/face-registration");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        "Credenciais inválidas. Verifique seu e-mail e senha.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${theme.bg})` }}
    >
      <div className="login-layout">
        {/* ILUSTRAÇÃO */}
        <div className="login-illustration">
          <img
            src={theme.character}
            alt="Ilustração de leitura"
            className="login-character-img"
          />
        </div>

        {/* CARD */}
        <div
          className="login-card"
          style={{ backgroundColor: theme.cardColor }}
        >
          <header className="login-header">
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">
              Faça login para reservar seus livros com segurança
            </p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="login-field">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu email:"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, email: true }))
                }
                className={
                  !emailOk && touched.email ? "login-input-error" : ""
                }
              />
              {!emailOk && touched.email && (
                <span className="login-error-text">
                  Digite um e-mail válido (ex: voce@dominio.com)
                </span>
              )}
            </div>

            {/* SENHA */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="senha">Senha:</label>
              </div>

              <div className="login-password-wrapper">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha:"
                  autoComplete="current-password"
                  value={form.senha}
                  onChange={handleChange("senha")}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, senha: true }))
                  }
                  className={[
                    "login-password-input",
                    !passwordOk && touched.senha
                      ? "login-input-error"
                      : "",
                  ]
                    .join(" ")
                    .trim()}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* ERRO GLOBAL */}
            {erro && <p className="login-error-global">{erro}</p>}

            {/* LINK CADASTRO */}
            <div className="login-register-link">
              <span>Não tem uma conta?</span>
              <button type="button" onClick={() => navigate("/register")}>
                Cadastre-se aqui
              </button>
            </div>

            {/* BOTÃO ENTRAR */}
            <button
              type="submit"
              className="login-submit"
              style={{ backgroundColor: theme.buttonColor }}
              disabled={!canSubmit}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
