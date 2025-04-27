import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AjouterPlante.css'

export default function AjouterPlante() {
  const nav = useNavigate()

  return (
    <div className="apg-page">
      <button className="apg-back" onClick={() => nav(-1)}>
        ← Retour
      </button>
      <h1>Ajouter une nouvelle plante</h1>
      {/* Ton formulaire d’ajout ici */}
    </div>
  )
}
