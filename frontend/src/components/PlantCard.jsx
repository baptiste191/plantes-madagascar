import React from 'react'
import './PlantCard.css'

export default function PlantCard({ plante }) {
  return (
    <div className="plant-card">
      <div className="plant-card-header">
        <img
          src={
            plante.photos?.[0]?.filename
              ? `/photos/${plante.photos[0].filename}`
              : '/placeholder.png'
          }
          alt={plante.nom_vernaculaire}
        />
      </div>
      <h3>{plante.nom_scientifique}</h3>
      <p>{plante.nom_vernaculaire}</p>
      <small>{plante.regions}</small>
    </div>
  )
}
