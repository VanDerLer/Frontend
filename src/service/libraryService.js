import { api } from "./api";


export async function addToLibrary(bookId) {
  const resp = await api.post(`/api/library/${bookId}`);
  return resp.data;
}


export async function listMyLibrary() {
  const resp = await api.get("/api/library");
  return resp.data; 
}


export async function removeFromLibrary(bookId) {
  await api.delete(`/api/library/${bookId}`);
}
