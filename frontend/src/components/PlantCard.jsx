import React from 'react'
import { Link } from 'react-router-dom'
import NoImage       from '@/components/NoImage'
import './PlantCard.css'

export default function PlantCard({ plant }) {
  const url =
    plant.photos && plant.photos.length > 0
      ? `/photos/${plant.photos[0].filename}`
      : null

  return (
    <Link to={`/plant/${plant.id}`} className="pc-card">
      {url ? (
        <img src={url} alt={plant.nom_vernaculaire} className="pc-img" />
      ) : (
        <NoImage />
      )}
      <div className="pc-body">
        <h3 className="pc-title">{plant.nom_scientifique}</h3>
        <p className="pc-sub">{plant.nom_vernaculaire}</p>
      </div>
    </Link>
  )
}
