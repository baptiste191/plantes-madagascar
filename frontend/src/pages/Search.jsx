import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Navbar    from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import PlantCard from '@/components/PlantCard'
import { useAuth } from '@/hooks/useAuth'
import api from '@/services/api'
import './Search.css'

export default function Search() {
  const { token } = useAuth()
  const nav = useNavigate()
  const [plants, setPlants] = useState([])
  const [searching, setSearching] = useState(false)

  if (!token) return <Navigate to="/login" replace />

  const handleSearch = query => {
    setSearching(true)
    api.get(`/plantes?nom=${encodeURIComponent(query)}`)
      .then(({ data }) => setPlants(data))
      .catch(console.error)
      .finally(() => setSearching(false))
  }

  return (
    <div className="search-page">
      <Navbar />
      <main className="search-main">
        <button className="back-btn" onClick={() => nav(-1)}>
          ← Retour
        </button>
        <h1>Recherche avancée</h1>
        <SearchBar onSearch={handleSearch} />
        {searching ? (
          <div className="loading">Recherche en cours…</div>
        ) : plants.length ? (
          <div className="grid">
            {plants.map(p => <PlantCard key={p.id} plant={p} />)}
          </div>
        ) : (
          <div className="no-result">Aucune plante trouvée.</div>
        )}
      </main>
    </div>
  )
}
