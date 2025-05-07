// src/pages/AdminDashboard.jsx
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

  // Statistiques globales
  const totalPlants = plants.length
  const totalUsers = users.length
  const totalConnections = users.reduce((sum, u) => sum + (u.nombre_connexion || 0), 0)

  // Familles fixées
  const familiesList = [
    'Anacardiaceae','Annonaceae','Apocynaceae','Asteraceae','Bignoniaceae',
    'Cannelaceae','Caricaceae','Combretaceae','Crassulaceae','Cucurbitaceae',
    'Cycadaceae','Erythroxylaceae','Euphorbiaceae','Fabaceae','Lauraceae',
    'Leeaceae','Loganiaceae','Lythraceae','Malvaceae','Meliaceae',
    'Menispermaceae','Moraceae','Musaceae','Myristicaceae','Myrtaceae',
    'Opiliaceae','Phyllanthaceae','Piperaceae','Poaceae','Rhamnaceae',
    'Rubiaceae','Rutaceae','Salicaceae','Sapindaceae','Thymelaeaceae',
    'Verbenacae','Xanthorrhoeaceae'
  ]

  // Compte le nombre de plantes par famille (classe celles qui ne figurent pas dans la liste dans "Autres")
  const familyCounts = plants.reduce((acc, p) => {
    const fam = p.famille || 'Inconnue'
    if (familiesList.includes(fam)) {
      acc[fam] = (acc[fam] || 0) + 1
    } else {
      acc.Autres = (acc.Autres || 0) + 1
    }
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
        <h3>Plantes par famille :</h3>
        <div className="db-grid">
          {familiesList.map(fam => (
            <div key={fam} className="db-card">
              <strong>{fam}</strong>
              <p>{familyCounts[fam] || 0}</p>
            </div>
          ))}
          {familyCounts.Autres != null && (
            <div className="db-card">
              <strong>Autres</strong>
              <p>{familyCounts.Autres}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
