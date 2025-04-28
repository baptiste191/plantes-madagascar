import React, { useState, useEffect } from 'react'
import { useNavigate, Link }         from 'react-router-dom'
import api                           from '../services/api'
import './AdminGestionPlantes.css'

export default function AdminGestionPlantes() {
  const navigate = useNavigate()
  const [allPlants, setAllPlants] = useState([])
  const [plants, setPlants]       = useState([])
  const [search, setSearch]       = useState('')
  const [toDelete, setToDelete]   = useState(null)

  // Chargement initial
  useEffect(() => {
    Promise.all([
      api.get('/plantes'),
      api.get('/photos')
    ]).then(([{ data: P }, { data: Ph }]) => {
      const byPlant = Ph.reduce((acc, x) => {
        acc[x.plante_id] = acc[x.plante_id] || []
        acc[x.plante_id].push(x)
        return acc
      }, {})
      const enriched = P.map(p => ({
        ...p,
        photos: byPlant[p.id] || []
      })).sort((a,b) =>
        a.nom_scientifique.localeCompare(b.nom_scientifique)
      )
      setAllPlants(enriched)
      setPlants(enriched)
    })
  }, [])

  // Recherche dynamique
  useEffect(() => {
    const q = search.trim().toLowerCase()
    setPlants(
      !q ? allPlants
         : allPlants.filter(p =>
             [p.nom_scientifique, p.nom_vernaculaire, p.regions]
               .join(' ')
               .toLowerCase()
               .includes(q)
           )
    )
  }, [search, allPlants])

  const confirmDelete = id => setToDelete(id)
  const cancelDelete  = () => setToDelete(null)

  // 3) Suppression
  const doDelete = async () => {
    await api.delete(`/plantes/${toDelete}`)
    const updated = allPlants.filter(p => p.id !== toDelete)
    setAllPlants(updated)
    setPlants(updated)
    setToDelete(null)
  }

  return (
    <div className="gp-container">
      <button className="gp-back" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <h2 className="gp-title">Gestion des plantes</h2>

      <div className="gp-actions">
        <Link to="ajouter" className="gp-add">
          + Ajouter une plante
        </Link>
        <input
          type="text"
          placeholder="Rechercher par nom, région…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="gp-search"
        />
      </div>

      <table className="gp-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom scientifique</th>
            <th>Nom vernaculaire</th>
            <th>Régions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map(p => (
            <tr key={p.id}>
              <td>
                {p.photos[0] ? (
                  <img
                    src={`/photos/${p.photos[0].filename}`}
                    alt={p.nom_scientifique}
                    className="gp-thumb"
                  />
                ) : (
                  <div className="gp-noimg">Pas d’image disponible</div>
                )}
              </td>
              <td>{p.nom_scientifique}</td>
              <td>{p.nom_vernaculaire}</td>
              <td>{p.regions}</td>
              <td>
                <Link to={`${p.id}/modifier`} className="gp-btn">
                  Modifier
                </Link>
                <button
                  onClick={() => confirmDelete(p.id)}
                  className="gp-btn gp-btn-del"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {toDelete !== null && (
        <div className="gp-modal">
          <div className="gp-modal-content">
            <p>Confirmez-vous la suppression de cette plante ?</p>
            <div className="gp-modal-actions">
              <button onClick={doDelete} className="gp-btn">
                Oui, supprimer
              </button>
              <button onClick={cancelDelete} className="gp-btn">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
