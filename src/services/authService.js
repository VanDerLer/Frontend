import { api } from "./api.js";

function salvarSessao(data) {
  localStorage.setItem("vanderler_token", data.token);
  localStorage.setItem("vanderler_nome", data.nome);
  localStorage.setItem("vanderler_email", data.email);
  localStorage.setItem("vanderler_role", data.role);
}

export async function registrar({ nome, email, senha }) {
  const resp = await api.post("/auth/register", { nome, email, senha });
  salvarSessao(resp.data);
  return resp.data;
}

export async function logar({ email, senha }) {
  const resp = await api.post("/auth/login", { email, senha });
  salvarSessao(resp.data);
  return resp.data;
}

export function sair() {
  localStorage.removeItem("vanderler_token");
  localStorage.removeItem("vanderler_nome");
  localStorage.removeItem("vanderler_email");
  localStorage.removeItem("vanderler_role");
}

export function getUsuarioAtual() {
  const token = localStorage.getItem("vanderler_token");
  if (!token) return null;
  return {
    token,
    nome: localStorage.getItem("vanderler_nome"),
    email: localStorage.getItem("vanderler_email"),
    role: localStorage.getItem("vanderler_role"),
  };
}
