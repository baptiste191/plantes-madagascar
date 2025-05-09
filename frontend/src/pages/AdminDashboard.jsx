// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const nav = useNavigate()
  const [plants, setPlants] = useState([])
  const [users,  setUsers]  = useState([])
  const [loading, setLoading] = useState(true)

  // 1) Chargement des données
  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: plantsData }, { data: usersData }] = await Promise.all([
          api.get('/plantes'),
          api.get('/utilisateurs')
        ])
        setPlants(plantsData)
        // ne garder que les "user"
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

  // 2) Stats globales
  const totalPlants      = plants.length
  const totalUsers       = users.length
  const totalConnections = users.reduce((sum, u) => sum + (u.nombre_connexion || 0), 0)

  // 3) Liste de familles « officielles »
  const familiesList = [
    'Amaryllidaceae', 'Anacardiaceae', 'Annonaceae', 'Apiaceae', 'Apocynaceae',
    'Asparagaceae', 'Asteraceae', 'Bignoniaceae', 'Brassicaceae', 'Cactaceae',
    'Canellaceae', 'Cannabaceae', 'Cannelaceae', 'Capparaceae', 'Caricaceae',
    'Celastraceae', 'Combretaceae', 'Convolvulaceae', 'Crassulaceae', 'Cucurbitaceae',
    'Cycadaceae', 'Cyperaceae', 'Dioscoreaceae', 'Ericaceae', 'Erythroxylaceae',
    'Euphorbiaceae', 'Fabaceae', 'Gentianaceae', 'Hypericaceae', 'Lamiaceae',
    'Lauraceae', 'Leeaceae', 'Linaceae', 'Loganiaceae', 'Lythraceae',
    'Malvaceae', 'Melastomataceae', 'Meliaceae', 'Menispermaceae', 'Molluginceae',
    'Moraceae', 'Musaceae', 'Myristicaceae', 'Myrtaceae', 'Opiliaceae',
    'Passifloraceae', 'Phyllanthaceae', 'Piperaceae', 'Poaceae', 'Primulaceae',
    'Pteridaceae', 'Rhamnaceae', 'Rosaceae', 'Rubiaceae', 'Rutaceae',
    'Salicaceae', 'Sapindaceae', 'Scrophulariaceae', 'Sphenocleaceae', 'Stilbaceae',
    'Thymelaeaceae', 'Verbenacae', 'Verbenaceae', 'Vitaceae', 'Xanthorrhoeaceae',
    'Zinziberaceae'
  ]
  // version lowercase pour la comparaison
  const familiesLC = familiesList.map(f => f.toLowerCase())

  // 4) Comptage par famille (inscrit tout ce qui ne matche pas dans "Autres")
  const familyCounts = plants.reduce((acc, p) => {
    const raw = (p.famille || '').trim().toLowerCase()
    const idx = familiesLC.indexOf(raw)
    if (idx >= 0) {
      const key = familiesList[idx]
      acc[key] = (acc[key] || 0) + 1
    } else {
      acc.Autres = (acc.Autres || 0) + 1
    }
    return acc
  }, {})

  // helper pour n’afficher que première lettre en majuscule
  const formatFamille = s =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

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
              <strong>{formatFamille(fam)}</strong>
              <p>{familyCounts[fam] || 0}</p>
            </div>
          ))}
          {/* on ajoute le "Autres" s’il existe */}
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
