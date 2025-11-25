// src/pages/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { registrar, sair } from "../../service/authService";

import purpleBg from "../../assets/auth/register-bg-purple.png";
import purpleGirl from "../../assets/auth/purple-girl.svg";

import blueBg from "../../assets/auth/register-bg-blue.png";
import blueFamily from "../../assets/auth/blue-family.svg";

import "../../styles/Register/Register.css";

const THEMES = [
  {
    id: "purple",
    bg: purpleBg,
    character: purpleGirl,
    cardColor: "#D599DF",
    buttonColor: "#BC70CB",
  },
  {
    id: "blue",
    bg: blueBg,
    character: blueFamily,
    cardColor: "#96BFE7",
    buttonColor: "#7DB4E5",
  },
];

function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export default function Register() {
  const navigate = useNavigate();

  // Sorteia o tema uma vez só quando o componente monta
  const [theme] = useState(
    () => THEMES[Math.floor(Math.random() * THEMES.length)]
  );

  const [form, setForm] = useState({
    nome: "",
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
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ===== validações =====
  const emailOk = isValidEmail(form.email);

  const hasUpper = /[A-Z]/.test(form.senha);
  const hasNumber = /\d/.test(form.senha);
  const hasLength = form.senha.length >= 8;
  const passwordOk = hasUpper && hasNumber && hasLength;

  const missingPieces = [];
  if (!hasUpper) missingPieces.push("uma letra maiúscula");
  if (!hasNumber) missingPieces.push("um número");
  if (!hasLength) missingPieces.push("no mínimo 8 caracteres");

  let senhaHint = "";
  if (form.senha.length > 0 && !passwordOk) {
    const last = missingPieces[missingPieces.length - 1];
    const initial = missingPieces.slice(0, -1);

    let listText = "";
    if (missingPieces.length === 1) {
      listText = last;
    } else {
      listText = `${initial.join(", ")} e ${last}`;
    }

    senhaHint = `Digite ao menos ${listText}`;
  }

  const canSubmit = form.nome && emailOk && passwordOk && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched((prev) => ({
      ...prev,
      email: true,
      senha: true,
    }));

    if (!canSubmit) return;

    try {
      setLoading(true);
      setErro("");
      setSuccessMsg("");

      // 🔗 Chama o back para registrar
      await registrar({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });

      // Garante que não fica logado após o cadastro
      sair();

      setSuccessMsg("Cadastro realizado com sucesso! Faça login para continuar.");
      // Leva o usuário pro login
      navigate("/login");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        "Erro ao cadastrar. Verifique os dados e tente novamente.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page"
      style={{ backgroundImage: `url(${theme.bg})` }}
    >
      <div className="register-layout">
        {/* ILUSTRAÇÃO */}
        <div className="register-illustration">
          <img
            src={theme.character}
            alt="Ilustração leitura"
            className="register-character-img"
          />
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div
          className="register-card"
          style={{ backgroundColor: theme.cardColor }}
        >
          <header className="register-header">
            <h1 className="register-title">Cadastro</h1>
            <p className="register-subtitle">
              Faça cadastro para reservar seus livros com segurança.
            </p>
          </header>

          <form className="register-form" onSubmit={handleSubmit}>
            {/* NOME */}
            <div className="register-field">
              <label htmlFor="nome">Nome:</label>
              <input
                id="nome"
                type="text"
                placeholder="Digite seu Nome"
                autoComplete="name"
                value={form.nome}
                onChange={handleChange("nome")}
              />
            </div>

            {/* EMAIL */}
            <div className="register-field">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu Email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, email: true }))
                }
                className={
                  !emailOk && touched.email ? "register-input-error" : ""
                }
              />
              {!emailOk && touched.email && (
                <span className="register-error-text">
                  Digite um e-mail válido (ex: voce@dominio.com)
                </span>
              )}
            </div>

            {/* SENHA */}
            <div className="register-field">
              <div className="register-label-row">
                <label htmlFor="senha">Senha:</label>

                {senhaHint && (
                  <span className="register-password-hint">{senhaHint}</span>
                )}
              </div>

              <div className="register-password-wrapper">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua Senha"
                  autoComplete="new-password"
                  value={form.senha}
                  onChange={handleChange("senha")}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, senha: true }))
                  }
                  className={[
                    "register-password-input",
                    !passwordOk && touched.senha
                      ? "register-input-error"
                      : "",
                  ]
                    .join(" ")
                    .trim()}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* ERRO / SUCESSO */}
            {erro && <p className="register-error-global">{erro}</p>}
            {successMsg && (
              <p className="register-success-global">{successMsg}</p>
            )}

            {/* LINK LOGIN */}
            <div className="register-login-link">
              <span>Já tem uma conta?</span>
              <button type="button" onClick={() => navigate("/login")}>
                Entre aqui
              </button>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="register-submit"
              style={{ backgroundColor: theme.buttonColor }}
              disabled={!canSubmit}
            >
              {loading ? "Enviando..." : "Começar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
