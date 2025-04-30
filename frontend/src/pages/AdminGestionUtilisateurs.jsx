import React, { useState, useEffect } from 'react'
import { useNavigate }               from 'react-router-dom'
import api                           from '../services/api'
import './AdminGestionUtilisateurs.css'

export default function AdminGestionUtilisateurs() {
  const nav = useNavigate()
  const [allUsers, setAllUsers]     = useState([])
  const [search, setSearch]         = useState('')
  const [toDelete, setToDelete]     = useState(null)
  const [error, setError]           = useState(null)

  useEffect(() => {
    api.get('/utilisateurs')
      .then(({ data }) => {
        // N'afficher que les users, pas les admins
        setAllUsers(data.filter(u => u.role === 'user'))
      })
      .catch(err => {
        console.error(err)
        setError("Impossible de charger la liste des utilisateurs")
      })
  }, [])

  const filtered = allUsers.filter(u =>
    u.nom.toLowerCase().includes(search.trim().toLowerCase())
  )

  const formatDate = iso => {
    if (!iso) return '-'
    const d  = new Date(iso)
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yy = String(d.getFullYear()).slice(-2)
    const hh = String(d.getHours()).padStart(2,'0')
    const mi = String(d.getMinutes()).padStart(2,'0')
    return `${dd}/${mm}/${yy} (${hh}h${mi})`
  }

  const confirmDelete = id => setToDelete(id)
  const cancelDelete  = () => setToDelete(null)
  const doDelete      = async () => {
    try {
      await api.delete(`/utilisateurs/${toDelete}`)
      setAllUsers(us => us.filter(u => u.id !== toDelete))
      setToDelete(null)
    } catch (err) {
      console.error(err)
      setError("Erreur lors de la suppression")
      setToDelete(null)
    }
  }

  return (
    <div className="au-container">
      <button className="au-back" onClick={() => nav(-1)}>
        ← Retour
      </button>

      <h2 className="au-title">Gérer les utilisateurs</h2>
      {error && <div className="au-error">{error}</div>}

      <div className="au-actions">
        <input
          type="text"
          placeholder="Rechercher par nom…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="au-add"
          onClick={() => nav('/admin/utilisateurs/gestion/ajouter')}
        >
          + Ajouter
        </button>
      </div>

      <div className="au-table-wrapper">
        <table className="au-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Dernière connexion</th>
              <th># Connexions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.nom}</td>
                <td>{u.description_utilisateur || '-'}</td>
                <td>{formatDate(u.derniere_connexion)}</td>
                <td>{u.nombre_connexion}</td>
                <td className="au-actions-cell">
                  <button
                    className="au-btn"
                    onClick={() => nav(`/admin/utilisateurs/${u.id}/modifier`)}
                  >
                    Modifier
                  </button>
                  <button
                    className="au-btn au-btn-del"
                    onClick={() => confirmDelete(u.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toDelete !== null && (
        <div className="au-modal-backdrop">
          <div className="au-modal">
            <p>Confirmez-vous la suppression de cet utilisateur ?</p>
            <div className="au-modal-actions">
              <button onClick={doDelete}    className="au-btn-confirm">
                Oui, supprimer
              </button>
              <button onClick={cancelDelete} className="au-btn-cancel">
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
