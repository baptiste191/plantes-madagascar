import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ModifierPlante.css'

export default function ModifierPlante() {
  const nav = useNavigate()
  const { id } = useParams()

  return (
    <div className="mpg-page">
      <button className="mpg-back" onClick={() => nav(-1)}>
        ← Retour
      </button>
      <h1>Modifier la plante #{id}</h1>
      {/* Ton formulaire d’édition ici */}
    </div>
  )
}
