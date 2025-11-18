import { api } from "./api.js";

export async function atualizarNome(nome) {
  const resp = await api.put("/api/users/me", { nome });
  return resp.data;
}
