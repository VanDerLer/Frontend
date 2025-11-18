import { api } from "./api.js";

export async function listarLivros() {
  const resp = await api.get("/api/books");
  return resp.data;
}

export async function criarLivro(payload) {
  const resp = await api.post("/api/books", payload);
  return resp.data;
}

export async function deletarLivro(id) {
  await api.delete(`/api/books/${id}`);
}

export async function lerLivro(id) {
  const resp = await api.get(`/api/books/${id}/content`);
  return resp.data;
}
