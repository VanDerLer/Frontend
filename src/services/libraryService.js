import { api } from "./api.js";

export async function listarMinhaBiblioteca() {
  const resp = await api.get("/api/library");
  return resp.data;
}

export async function adicionarNaMinhaBiblioteca(bookId) {
  await api.post(`/api/library/${bookId}`);
}

export async function removerDaMinhaBiblioteca(bookId) {
  await api.delete(`/api/library/${bookId}`);
}
