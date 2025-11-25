// src/service/bookService.js
import { api } from "./api";

/**
 * Lista todos os livros disponíveis (BookSummary)
 * GET /api/books
 */
export async function listBooks() {
  const resp = await api.get("/api/books");
  return Array.isArray(resp.data) ? resp.data : [];
}

/**
 * Busca o resumo de um único livro, em cima da lista de /api/books.
 * Como o back hoje não tem GET /api/books/{id} de resumo,
 * a gente filtra no front.
 */
export async function getBookSummary(id) {
  const books = await listBooks();
  return books.find((b) => String(b.id) === String(id)) || null;
}

/**
 * Busca o CONTEÚDO do livro.
 * GET /api/books/{id}/content
 *
 * ⚠️ Requer:
 * - Usuário logado
 * - Livro estar na biblioteca, se não for ADMIN (regra do seu BookService)
 */
export async function getBookContent(id) {
  const resp = await api.get(`/api/books/${id}/content`);
  return resp.data;
}

/**
 * Minha biblioteca (lista de BookSummary)
 * GET /api/library
 */
export async function listMyLibrary() {
  const resp = await api.get("/api/library");
  return Array.isArray(resp.data) ? resp.data : [];
}

/**
 * Adiciona um livro à minha biblioteca
 * POST /api/library/{bookId}
 */
export async function addToLibrary(bookId) {
  await api.post(`/api/library/${bookId}`);
}

/**
 * Remove um livro da minha biblioteca
 * DELETE /api/library/{bookId}
 */
export async function removeFromLibrary(bookId) {
  await api.delete(`/api/library/${bookId}`);
}
