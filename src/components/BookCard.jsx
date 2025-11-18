import React from "react";

export default function BookCard({
  book,
  onAdd,
  onRemove,
  onRead,
  isInLibrary,
  isAdmin,
  onAdminDelete,
}) {
  return (
    <div className="card">
      <div className="book-card-cover" />
      <div>
        <div className="book-card-title">{book.titulo}</div>
        <div className="book-card-author">{book.autor}</div>
        {book.descricao && (
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
            {book.descricao.length > 90
              ? book.descricao.slice(0, 90) + "..."
              : book.descricao}
          </p>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        {onAdd && !isInLibrary && (
          <button className="btn-primary" onClick={() => onAdd(book.id)}>
            Adicionar à biblioteca
          </button>
        )}

        {onRemove && isInLibrary && (
          <button className="btn-outline" onClick={() => onRemove(book.id)}>
            Remover
          </button>
        )}

        {onRead && (
          <button className="btn-ghost" onClick={() => onRead(book.id)}>
            Ler
          </button>
        )}

        {isAdmin && onAdminDelete && (
          <button
            className="btn-ghost"
            style={{ color: "#b91c1c" }}
            onClick={() => onAdminDelete(book.id)}
          >
            Remover do catálogo
          </button>
        )}
      </div>
    </div>
  );
}
