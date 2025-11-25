// src/service/userService.js
import { api } from "./api";

// GET /api/users/me -> usado para montar a tela de perfil
export async function getMyProfile() {
  const resp = await api.get("/api/users/me");
  return resp.data;
}

// PUT /api/users/me -> atualizar nome + email
export async function updateMyProfile({ nome, email }) {
  const resp = await api.put("/api/users/me", {
    nome,
    email,
  });

  return resp.data;
}
