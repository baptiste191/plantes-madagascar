// src/pages/AdminPlantes.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '@/services/api'
import SearchBar from '@/components/SearchBar'
import PlantCard from '@/components/PlantCard'
import './AdminPlantes.css'

export default function AdminPlantes() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''

  const [allPlants, setAllPlants] = useState([])
  const [plants,    setPlants]    = useState([])
  const [query,     setQuery]     = useState(initialQ)

  // 1. Chargement initial
  useEffect(() => {
    Promise.all([api.get('/plantes'), api.get('/photos')])
      .then(([{ data: P }, { data: Ph }]) => {
        const byPlant = Ph.reduce((acc, photo) => {
          acc[photo.plante_id] = acc[photo.plante_id] || []
          acc[photo.plante_id].push(photo)
          return acc
        }, {})
        const enriched = P.map(p => ({
          ...p,
          photos: byPlant[p.id] || []
        }))
        setAllPlants(enriched)
        // on applique immédiatement le filtrage si q existe
        filter(enriched, initialQ)
      })
  }, [])

  // 2. Fonction de filtrage + URL
  function filter(source, q) {
    const v = (q || '').trim().toLowerCase()
    setSearchParams(v ? { q: v } : {})   // met ?q=v dans l’URL ou l’enlève
    setQuery(q)
    if (!v) {
      setPlants(source)
    } else {
      setPlants(
        source.filter(p =>
          [
            p.nom_scientifique,
            p.nom_vernaculaire,
            p.regions,
            p.vertus,
            p.usages,
            p.famille
          ]
            .join(' ')
            .toLowerCase()
            .includes(v)
        )
      )
    }
  }

  // 3. Passe filter au SearchBar
  const handleSearch = q => filter(allPlants, q)

  return (
    <div className="ap-page">
      <button className="ap-back" onClick={() => navigate('/admin')}>
        ← Retour
      </button>

      <SearchBar
        value={query}        // on pré-remplit l’input avec query
        onSearch={handleSearch}
      />

      <div className="ap-grid">
        {plants.map(p => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>
    </div>
  )
}
