import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const nav = useNavigate()
  const [plants, setPlants] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: plantsData }, { data: usersData }] = await Promise.all([
          api.get('/plantes'),
          api.get('/utilisateurs')
        ])
        setPlants(plantsData)
        setUsers(usersData.filter(u => u.role === 'user'))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="db-loading">Chargement...</div>

  // Statistiques
  const totalPlants = plants.length
  const totalUsers = users.length
  const totalConnections = users.reduce((sum, u) => sum + (u.nombre_connexion || 0), 0)

  // Régions
  const regionCounts = plants.reduce((acc, p) => {
    (p.regions || '')
      .split(',')
      .map(r => r.trim())
      .filter(r => r)
      .forEach(r => { acc[r] = (acc[r] || 0) + 1 })
    return acc
  }, {})

  // Vertus ciblées
  const virtuesList = [
    'antioxydante',
    'nutritive',
    'anti-inflammatoire',
    'cicatrisante',
    'antiseptique',
    'tonique',
    'astringent'
  ]
  const virtueCounts = plants.reduce((acc, p) => {
    (p.vertus || '')
      .split(',')
      .map(v => v.trim())
      .filter(v => v)
      .forEach(v => {
        if (virtuesList.includes(v)) acc[v] = (acc[v] || 0) + 1
      })
    return acc
  }, {})

  return (
    <div className="db-container">
      <button className="db-back" onClick={() => nav(-1)}>
        ← Retour
      </button>

      <h2 className="db-title">Tableau de bord</h2>

      <div className="db-stats-centered">
        <div className="db-card">
          <h3>Total de plantes</h3>
          <p>{totalPlants}</p>
        </div>
        <div className="db-card">
          <h3>Total d’utilisateurs</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="db-card">
          <h3>Total de connexions</h3>
          <p>{totalConnections}</p>
        </div>
      </div>

      <section>
        <h3>Plantes par région : </h3>
        <div className="db-grid">
          {Object.entries(regionCounts).map(([region, count]) => (
            <div key={region} className="db-card">
              <strong>{region}</strong>
              <p>{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Plantes par vertus : </h3>
        <div className="db-grid">
          {virtuesList.map(v => (
            <div key={v} className="db-card">
              <strong>
                {v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
              </strong>
              <p>{virtueCounts[v] || 0}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
