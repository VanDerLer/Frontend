// src/components/SaveBookButton.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { addToLibrary } from "../service/libraryService";
import { getUsuarioAtual } from "../service/authService";

export default function SaveBookButton({ bookId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    setErrorMsg("");

    const usuario = getUsuarioAtual();
    if (!usuario) {
      // se não estiver logado, manda pro login
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    try {
      setLoading(true);
      await addToLibrary(bookId);
      setSaved(true);
    } catch (err) {
      console.error("[SaveBookButton] erro ao salvar livro:", err);

      if (err.response?.status === 409) {
        setErrorMsg("Esse livro já está na sua biblioteca.");
        setSaved(true);
      } else {
        setErrorMsg("Não foi possível salvar o livro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: "10px 18px",
          borderRadius: 999,
          border: "none",
          cursor: loading ? "default" : "pointer",
          fontWeight: 600,
          fontSize: 14,
          background: saved ? "#16a34a" : "#4f46e5",
          color: "#fff",
          boxShadow: "0 8px 18px rgba(79,70,229,0.35)",
          transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {loading
          ? "Salvando..."
          : saved
          ? "Salvo na sua biblioteca"
          : "Salvar na minha biblioteca"}
      </button>

      {errorMsg && (
        <span
          style={{
            fontSize: 12,
            color: "#b91c1c",
          }}
        >
          {errorMsg}
        </span>
      )}
    </div>
  );
}
