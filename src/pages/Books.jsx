import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'

export default function Books(){
  const [books, setBooks] = useState([])

  useEffect(()=>{
    api.get('/books/public').then(r=>setBooks(r.data))
  }, [])

  return (
    <div className="card">
      <h2>Acervo</h2>
      <p>Usuários autenticados via face podem abrir o conteúdo.</p>
      <div className="list">
        {books.map(b => (
          <div className="book" key={b.id}>
            <div className="muted">#{b.id}</div>
            <h4>{b.title}</h4>
            <div className="muted">{b.author}</div>
            <div style={{height:8}} />
            <Link className="link" to={`/reader/${b.id}`}>Ler</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
