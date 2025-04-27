import React, { useState, useEffect } from 'react'
import { useParams, useNavigate }     from 'react-router-dom'
import { useAuth }                    from '@/hooks/useAuth'
import api                            from '@/services/api'
import NoImage                        from '@/components/NoImage'
import './PlantDetail.css'

export default function PlantDetail() {
  const { id }          = useParams()
  const nav             = useNavigate()
  const { user, logout } = useAuth()

  const [plant, setPlant]   = useState(null)
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    api.get(`/plantes/${id}`).then(({ data }) => setPlant(data))
    api.get(`/photos?plante_id=${id}`).then(({ data }) => setPhotos(data))
  }, [id])

  if (!plant) return <div className="pd-loading">Chargement…</div>

  const {
    nom_scientifique,
    nom_vernaculaire,
    famille,
    regions,
    vertus,
    usages,
    parties_utilisees,
    mode_preparation,
    contre_indications,
    remarques,
    bibliographie
  } = plant

  return (
    <div className="pd-page">
      <header className="pd-header">
        <div className="pd-left">
          <img src="/logo.png" alt="MadaPlants" className="pd-logo" />
            <button className="pd-back" onClick={() => nav(-1)}>
            ← Retour
          </button>
        </div>
        <div className="pd-title">MadaPlants</div>
        <div className="pd-user">
          <span>{user.nom}</span>
          <button className="pd-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="pd-main">
        <h1 className="pd-name1">{nom_scientifique}</h1>
        <h2 className="pd-name2">{nom_vernaculaire}</h2>
        <h3 className="pd-family">{famille}</h3>

        <div className="pd-photos">
          {photos.length > 0
            ? photos.map((p, i) => (
                <img
                  key={p.id}
                  src={`/photos/${p.filename}`}
                  alt={`${nom_scientifique} #${i+1}`}
                  className="pd-photo"
                />
              ))
            : <NoImage />
          }
        </div>

        <section className="pd-details">
          <div><strong>Région :</strong> {regions}</div>
          <div><strong>Vertus :</strong> {vertus}</div>
          <div><strong>Usages :</strong> {usages}</div>
          <div><strong>Parties utilisées :</strong> {parties_utilisees}</div>
          <div><strong>Mode de préparation :</strong> {mode_preparation}</div>
          <div><strong>Contre-indications :</strong> {contre_indications}</div>
          {remarques && <div><strong>Remarques :</strong> {remarques}</div>}
          {bibliographie && (
            <div><strong>Bibliographie :</strong> {bibliographie}</div>
          )}
        </section>
      </main>
    </div>
  )
}
