import React, { useState, useEffect }     from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import api                                 from '../services/api'
import './AdminGestionPlantes.css'

export default function AdminGestionPlantes() {
  const navigate                               = useNavigate()
  const [searchParams, setSearchParams]        = useSearchParams()
  const search                                 = searchParams.get('q') || ''

  const [allPlants, setAllPlants] = useState([])
  const [plants,    setPlants]    = useState([])
  const [toDelete,  setToDelete]  = useState(null)

  // 1) Chargement initial
  useEffect(() => {
    Promise.all([ api.get('/plantes'), api.get('/photos') ])
      .then(([{ data: P }, { data: Ph }]) => {
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

  // 2) Filtrage dès que `search` ou `allPlants` change
  useEffect(() => {
    const q = search.trim().toLowerCase()
    setPlants(
      !q
        ? allPlants
        : allPlants.filter(p =>
            [p.nom_scientifique, p.nom_vernaculaire, p.famille]
              .join(' ')
              .toLowerCase()
              .includes(q)
          )
    )
  }, [search, allPlants])

  const handleSearch = q => {
    if (q) setSearchParams({ q })
    else  setSearchParams({})
  }

  const confirmDelete = id => setToDelete(id)
  const cancelDelete  = () => setToDelete(null)
  const doDelete      = async () => {
    await api.delete(`/plantes/${toDelete}`)
    const updated = allPlants.filter(p => p.id !== toDelete)
    setAllPlants(updated)
    setPlants(updated)
    setToDelete(null)
  }

  return (
    <div className="gp-container">
      <button
        className="gp-back"
        onClick={() => navigate('/admin', { replace: true })}
      >
        ← Retour
      </button>

      <h2 className="gp-title">Gestion des plantes</h2>

      <div className="gp-actions">
        {/* on propage les query-params vers la page “ajouter” */}
        <Link to={`ajouter?${searchParams.toString()}`} className="gp-add">
          + Ajouter une plante
        </Link>
        <input
          type="text"
          className="gp-search"
          placeholder="Rechercher par nom, famille…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      <table className="gp-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom scientifique</th>
            <th>Nom vernaculaire</th>
            <th>Famille</th>
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
              <td>{p.famille}</td>
              <td>
                {/* même chose pour la page modifier : on garde `?q=…` */}
                <Link
                  to={`${p.id}/modifier?${searchParams.toString()}`}
                  className="gp-btn"
                >
                  Modifier
                </Link>
                <button
                  className="gp-btn gp-btn-del"
                  onClick={() => confirmDelete(p.id)}
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
              <button onClick={doDelete}   className="gp-btn">Oui, supprimer</button>
              <button onClick={cancelDelete} className="gp-btn">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
