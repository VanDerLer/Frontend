import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'

export default function Reader(){
  const { id } = useParams()
  const [content, setContent] = useState('')

  useEffect(()=>{
    api.get(`/books/${id}/content`).then(r=>setContent(r.data)).catch(()=>{
      setContent('❌ Você precisa estar autenticado para ler este livro.')
    })
  }, [id])

  return (
    <div className="card">
      <h2>Leitor</h2>
      <pre className="mono" style={{whiteSpace:'pre-wrap'}}>{content}</pre>
    </div>
  )
}
