import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AdminNavbar from '@/components/AdminNavbar'
import api from '@/services/api'
import './ManageUsers.css'

export default function ManageUsers() {
  const { token, user } = useAuth()
  const nav = useNavigate()
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/utilisateurs')
       .then(({ data }) => setUsers(data))
       .catch(console.error)
  }, [])

  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/user" replace />

  const deleteUser = id => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    api.delete(`/utilisateurs/${id}`)
       .then(() => setUsers(u => u.filter(x => x.id !== id)))
       .catch(console.error)
  }

  return (
    <div className="manage-users">
      <AdminNavbar />
      <main className="manage-main">
        <button className="back-btn" onClick={() => nav(-1)}>
          ← Retour
        </button>
        <h2>Gérer les utilisateurs</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th><th>Rôle</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.nom}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => deleteUser(u.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
