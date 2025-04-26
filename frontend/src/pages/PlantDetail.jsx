import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import api    from '@/services/api'
import './PlantDetail.css'

export default function PlantDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/plantes/${id}`)
      .then(({ data }) => setPlant(data))
      .catch(() => setPlant(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="pd-loading">Chargement…</div>
  if (!plant)  return <div className="pd-notfound">Plante non trouvée</div>

  return (
    <div className="pd-page">
      <Navbar />
      <button className="pd-back" onClick={() => nav(-1)}>← Retour</button>
      <div className="pd-content">
        <h1>{plant.nom_scientifique}</h1>
        <h2>{plant.nom_vernaculaire}</h2>
        <div className="pd-photos">
          {plant.photos.length
            ? plant.photos.map(f => (
                <img key={f.id} src={`/photos/${f.filename}`} alt="" />
              ))
            : <div className="pd-noimg">Aucune image</div>
          }
        </div>
        <div className="pd-details">
          <p><strong>Régions :</strong> {plant.regions}</p>
          <p><strong>Vertus :</strong> {plant.vertus}</p>
          <p><strong>Usages :</strong> {plant.usages}</p>
          <p><strong>Préparation :</strong> {plant.mode_preparation}</p>
          {/* ajoute les autres champs ici */}
        </div>
      </div>
    </div>
  )
}
