import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth }      from '../hooks/useAuth'
import './AdminHome.css'

export default function AdminHome() {
  const { user, logout } = useAuth()

  return (
    <div className="admin-page">
      <header className="admin-header">
        <img src="/logo.png" alt="MadaPlants" className="admin-logo" />
        <h1 className="admin-title">
          <span style={{ color: '#97bf0d' }}>GREEN</span>
          <span style={{ color: '#464547' }}>MADAG</span>
        </h1>
        <div className="admin-user-area">
          <span className="admin-username">{user.nom}</span>
          <button className="admin-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="admin-profile">
        <Link
          to={`profil/${user.id}/modifier`}
          className="admin-profile-btn"
        >
          🛠 Mon profil
        </Link>
      </div>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
