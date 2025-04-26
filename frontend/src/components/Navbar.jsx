// frontend/src/components/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { SearchIcon } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, token } = useAuth()
  const isAuth = !!token

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="MadaPlants" />
        </Link>
        <div className="navbar-links">
          {isAuth ? (
            <>
              <Link to="/user">Accueil</Link>
              <Link to="/search" className="navbar-search">
                <SearchIcon size={18} /> Rechercher
              </Link>
              <span className="navbar-user">{user.nom}</span>
              <button onClick={logout} className="navbar-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-btn">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
