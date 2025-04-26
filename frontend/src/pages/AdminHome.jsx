import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import './AdminHome.css'  // tu pourras y mettre ton style

export default function AdminHome() {
  return (
    <div className="admin-home">
      <h1>Interface Admin</h1>
      <nav>
        <Link to="plantes">Gérer les plantes</Link> |{' '}
        <Link to="utilisateurs">Gérer les utilisateurs</Link> |{' '}
        <Link to="dashboard">Tableau de bord</Link>
      </nav>
      <Outlet />
    </div>
  )
}
