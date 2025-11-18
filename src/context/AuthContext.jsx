import React, { createContext, useContext, useEffect, useState } from "react";
import {
  logar,
  registrar,
  sair,
  getUsuarioAtual,
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUsuarioAtual();
    if (u) setUser(u);
    setLoading(false);
  }, []);

  async function login(email, senha) {
    const data = await logar({ email, senha });
    setUser(data);
    return data;
  }

  async function register(nome, email, senha) {
    const data = await registrar({ nome, email, senha });
    setUser(data);
    return data;
  }

  function logout() {
    sair();
    setUser(null);
  }

  function updateNameLocally(nome) {
    if (!user) return;
    const updated = { ...user, nome };
    localStorage.setItem("vanderler_nome", nome);
    setUser(updated);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateNameLocally }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
