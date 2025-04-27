// frontend/src/pages/AdminGestionPlantes.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate }               from 'react-router-dom'
import api                           from '@/services/api'
import './AdminGestionPlantes.css'

export default function AdminGestionPlantes() {
  const navigate = useNavigate()
  const [allPlants, setAllPlants] = useState([])
  const [filter, setFilter]       = useState('')
  const [toDelete, setToDelete]   = useState(null)

  // Charge toutes les plantes + photos
  useEffect(() => {
    Promise.all([ api.get('/plantes'), api.get('/photos') ])
      .then(([{ data: plantes }, { data: photos }]) => {
        const byPlant = photos.reduce((acc, ph) => {
          acc[ph.plante_id] = acc[ph.plante_id] || []
          acc[ph.plante_id].push(ph)
          return acc
        }, {})
        const enriched = plantes
          .map(p => ({ ...p, photos: byPlant[p.id] || [] }))
          .sort((a, b) =>
            a.nom_scientifique.localeCompare(b.nom_scientifique)
          )
        setAllPlants(enriched)
      })
      .catch(console.error)
  }, [])

  // Filtrage en temps réel
  const plants = allPlants.filter(p =>
    [p.nom_scientifique, p.nom_vernaculaire, p.regions]
      .join(' ')
      .toLowerCase()
      .includes(filter.toLowerCase().trim())
  )

  // Confirme et exécute la suppression
  const confirmDelete = () => {
    api.delete(`/plantes/${toDelete.id}`)
      .then(() => {
        setAllPlants(allPlants.filter(p => p.id !== toDelete.id))
        setToDelete(null)
      })
      .catch(() => {
        alert('Erreur lors de la suppression')
        setToDelete(null)
      })
  }

  return (
    <div className="agp-page">
      {/* Bouton Retour seul */}
      <button className="agp-back" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      {/* Titre et toolbar */}
      <h1 className="agp-title">Gestion des plantes</h1>
      <div className="agp-toolbar">
        <input
          type="search"
          placeholder="Rechercher par nom, région ou usage"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button
          className="agp-add"
          onClick={() => navigate('/admin/plantes/ajouter')}
        >
          Ajouter une plante
        </button>
      </div>

      {/* Tableau des plantes */}
      <table className="agp-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom scientifique</th>
            <th>Nom vernaculaire</th>
            <th>Région(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map(p => (
            <tr key={p.id}>
              <td>
                {p.photos[0]
                  ? <img
                      src={`/photos/${p.photos[0].filename}`}
                      alt={p.nom_scientifique}
                    />
                  : <div className="agp-placeholder">Pas d’image</div>
                }
              </td>
              <td>{p.nom_scientifique}</td>
              <td>{p.nom_vernaculaire || '-'}</td>
              <td>{p.regions}</td>
              <td>
                <button
                  className="agp-btn edit"
                  onClick={() => navigate(`/admin/plantes/${p.id}/modifier`)}
                >
                  Modifier
                </button>
                <button
                  className="agp-btn delete"
                  onClick={() => setToDelete(p)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmation de suppression */}
      {toDelete && (
        <div className="agp-modal-backdrop">
          <div className="agp-modal">
            <p>Veux-tu vraiment supprimer</p>
            <p><strong>{toDelete.nom_scientifique}</strong> ?</p>
            <div className="agp-modal-actions">
              <button onClick={() => setToDelete(null)}>Annuler</button>
              <button className="delete" onClick={confirmDelete}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
