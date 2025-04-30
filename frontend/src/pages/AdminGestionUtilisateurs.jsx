import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './AdminGestionUtilisateurs.css'

export default function AdminUtilisateurs() {
  const nav = useNavigate()
  const [allUsers, setAllUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/utilisateurs')
      .then(({ data }) => {
        // N'afficher que les users, pas les admins
        setAllUsers(data.filter(u => u.role === 'user'))
      })
      .catch(console.error)
  }, [])

  const filtered = allUsers.filter(u =>
    u.nom.toLowerCase().includes(search.trim().toLowerCase())
  )

  const formatDate = iso => {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yy = String(d.getFullYear()).slice(-2)
    const hh = String(d.getHours()).padStart(2,'0')
    const mi = String(d.getMinutes()).padStart(2,'0')
    return `${dd}/${mm}/${yy} (${hh}h${mi})`
  }

  return (
    <div className="au-container">
      <button className="au-back" onClick={() => nav(-1)}>
        ← Retour
      </button>

      <h2 className="au-title">Gérer les utilisateurs</h2>

      <div className="au-actions">
        <input
          type="text"
          placeholder="Rechercher par nom…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="au-add"
          onClick={() => nav('/admin/utilisateurs/ajouter')}
        >
          + Ajouter
        </button>
      </div>

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
              <td>
                <button
                  className="au-btn"
                  onClick={() => nav(`/admin/utilisateurs/${u.id}/modifier`)}
                >
                  Modifier
                </button>
                <button
                  className="au-btn au-btn-del"
                  onClick={() => {/* supprime... */}}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
