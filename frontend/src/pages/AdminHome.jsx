import React from 'react'
import { Navigate, Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import './AdminHome.css'

const features = [
  { title: 'Afficher la base',    to: '/search',           icon: '📚' },
  { title: 'Gérer plantes',        to: '/admin/plants',     icon: '🌿' },
  { title: 'Gérer utilisateurs',   to: '/admin/users',      icon: '👥' },
  { title: 'Tableau de bord',      to: '/admin/dashboard',  icon: '📊' },
]

export default function AdminHome() {
  const { user, token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/user" replace />

  return (
    <div className="admin-home-page">
      <div className="admin-cards">
        {features.map(f => (
          <Link key={f.to} to={f.to} className="admin-card">
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <button className="admin-card-btn">→</button>
          </Link>
        ))}
      </div>
      <Outlet/> {/* pour render les sous-pages */}
    </div>
  )
}
