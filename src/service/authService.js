// src/service/authService.js
import { api } from "./api.js";

// salva sessão no localStorage
function saveSession(data) {
  // backend devolve: token, nome, email, role, biometriaCadastrada
  localStorage.setItem("vanderler_token", data.token);
  localStorage.setItem("vanderler_nome", data.nome);
  localStorage.setItem("vanderler_email", data.email);
  localStorage.setItem("vanderler_role", data.role);
  localStorage.setItem(
    "vanderler_biometria",
    data.biometriaCadastrada ? "true" : "false"
  );
}

// ========= AUTH ==========

// cadastro
export async function registrar({ nome, email, senha }) {
  const resp = await api.post("/auth/register", { nome, email, senha });

  // se você quiser manter o usuário logado logo após o cadastro,
  // pode deixar isso, mas no fluxo atual a gente chama `sair()` na tela Register
  // pra obrigar o login em seguida.
  saveSession(resp.data);

  return resp.data;
}

// login
export async function logar({ email, senha }) {
  const resp = await api.post("/auth/login", { email, senha });

  // guarda token + dados
  saveSession(resp.data);

  return resp.data;
}

// logout
export function sair() {
  localStorage.removeItem("vanderler_token");
  localStorage.removeItem("vanderler_nome");
  localStorage.removeItem("vanderler_email");
  localStorage.removeItem("vanderler_role");
  localStorage.removeItem("vanderler_biometria");
}

// usuário atual da sessão
export function getUsuarioAtual() {
  const token = localStorage.getItem("vanderler_token");
  if (!token) return null;

  return {
    token,
    nome: localStorage.getItem("vanderler_nome"),
    email: localStorage.getItem("vanderler_email"),
    role: localStorage.getItem("vanderler_role"),
    biometriaCadastrada:
      localStorage.getItem("vanderler_biometria") === "true",
  };
}
