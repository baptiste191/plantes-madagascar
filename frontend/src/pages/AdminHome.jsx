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
        <h1 className="admin-title">MadaPlants</h1>
        <div className="admin-user-area">
          <span className="admin-username">{user.nom}</span>
          <button className="admin-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* bouton “Mon profil” */}
      <div className="admin-profile">
        <Link
          to={`profil/${user.id}/modifier`}
          className="admin-profile-btn"
        >
          🛠 Mon profil
        </Link>
      </div>

      <main className="admin-content">
        {/*** C’est ici que s’affichent les pages imbriquées ***/}
        <Outlet />
      </main>
    </div>
  )
}
