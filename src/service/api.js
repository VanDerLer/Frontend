// src/service/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://vanderler.azurewebsites.net",
});

// Interceptor pra mandar o JWT em TODAS as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vanderler_token");

  if (token) {
    if (!config.headers) {
      config.headers = {};
    }

    config.headers.Authorization = `Bearer ${token}`;

     console.log("Enviando Authorization:", config.headers.Authorization);
  } else {
    console.log("Sem token no localStorage ao chamar", config.url);
  }

  return config;
});
