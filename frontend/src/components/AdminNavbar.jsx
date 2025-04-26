// frontend/src/components/AdminNavbar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import './AdminNavbar.css'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const loc = useLocation().pathname

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <Link to="/admin" className="admin-logo">
          <img src="/logo.png" alt="MadaPlants" />
          <span>MadaPlants</span>
        </Link>
        <div className="admin-links">
          {[
            { to: '/admin',    label: 'Accueil' },
            { to: '/admin/plants', label: 'Plantes' },
            { to: '/admin/users',  label: 'Utilisateurs' },
            { to: '/admin/dashboard', label: 'Stats' }
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={loc.startsWith(link.to) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="admin-user">
          <span>{user.nom}</span>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </div>
    </nav>
  )
}
