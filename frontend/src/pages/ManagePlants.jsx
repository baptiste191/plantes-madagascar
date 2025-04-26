import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AdminNavbar from '@/components/AdminNavbar'
import api from '@/services/api'
import './ManagePlants.css'

export default function ManagePlants() {
  const { token, user } = useAuth()
  const nav = useNavigate()
  const [plants, setPlants] = useState([])

  useEffect(() => {
    api.get('/plantes').then(({ data }) => setPlants(data))
  }, [])

  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/user" replace />

  const deletePlant = id => {
    if (!window.confirm('Supprimer cette plante ?')) return
    api.delete(`/plantes/${id}`)
       .then(() => setPlants(p => p.filter(x => x.id !== id)))
       .catch(console.error)
  }

  return (
    <div className="manage-plants">
      <AdminNavbar />
      <main className="manage-main">
        <button className="back-btn" onClick={() => nav(-1)}>
          ← Retour
        </button>
        <h2>Gérer les plantes</h2>
        <table className="plants-table">
          <thead>
            <tr>
              <th>Nom scientifique</th><th>Vernaculaire</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map(p => (
              <tr key={p.id}>
                <td>{p.nom_scientifique}</td>
                <td>{p.nom_vernaculaire}</td>
                <td>
                  <button onClick={() => deletePlant(p.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
