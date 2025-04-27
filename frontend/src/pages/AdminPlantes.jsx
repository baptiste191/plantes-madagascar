import React, { useState, useEffect } from 'react'
import { useNavigate }               from 'react-router-dom'
import api                           from '@/services/api'
import SearchBar                     from '@/components/SearchBar'
import PlantCard                     from '@/components/PlantCard'
import './AdminPlantes.css'

export default function AdminPlantes() {
  const navigate = useNavigate()
  const [allPlants, setAllPlants] = useState([])
  const [plants, setPlants]       = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/plantes'),
      api.get('/photos')
    ]).then(([{ data: plantesData }, { data: photosData }]) => {
      const byPlant = photosData.reduce((acc, photo) => {
        acc[photo.plante_id] = acc[photo.plante_id] || []
        acc[photo.plante_id].push(photo)
        return acc
      }, {})
      const enriched = plantesData.map(p => ({
        ...p,
        photos: byPlant[p.id] || []
      }))
      setAllPlants(enriched)
      setPlants(enriched)
    })
  }, [])

  const handleSearch = q => {
    const v = q.trim().toLowerCase()
    if (!v) return setPlants(allPlants)
    setPlants(
      allPlants.filter(p =>
        [
          p.nom_scientifique,
          p.nom_vernaculaire,
          p.regions,
          p.vertus,
          p.usages
        ]
          .join(' ')
          .toLowerCase()
          .includes(v)
      )
    )
  }

  return (
    <div className="ap-page">
      {/* bouton Retour sous le header du layout AdminHome */}
      <button className="ap-back" onClick={() => navigate('/admin')}>
        ← Retour
      </button>

      <SearchBar onSearch={handleSearch} />

      <div className="ap-grid">
        {plants.map(p => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>
    </div>
  )
}
