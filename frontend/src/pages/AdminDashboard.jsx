import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AdminNavbar from '@/components/AdminNavbar'
import api from '@/services/api'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { token, user } = useAuth()
  const nav = useNavigate()
  const [stats, setStats] = useState({ total:0, byRegion:{}, byVertu:{} })

  useEffect(() => {
    Promise.all([
      api.get('/stats/total-plantes'),
      api.get('/stats/par-region'),
      api.get('/stats/par-vertu'),
    ]).then(([a, b, c]) => {
      setStats({ total: a.data.total, byRegion: b.data, byVertu: c.data })
    })
  }, [])

  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/user" replace />

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />
      <main className="manage-main">
        <button className="back-btn" onClick={() => nav(-1)}>
          ← Retour
        </button>
        <h2>Tableau de bord</h2>
        <p>Total plantes : {stats.total}</p>
        <div className="stats-grid">
          <div>
            <h3>Par région</h3>
            <pre>{JSON.stringify(stats.byRegion, null, 2)}</pre>
          </div>
          <div>
            <h3>Par vertu</h3>
            <pre>{JSON.stringify(stats.byVertu, null, 2)}</pre>
          </div>
        </div>
      </main>
    </div>
  )
}
