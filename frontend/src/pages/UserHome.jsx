import React, { useState, useEffect } from 'react'
import { useAuth }           from '@/hooks/useAuth'
import api                   from '@/services/api'
import SearchBar             from '@/components/SearchBar'
import PlantCard             from '@/components/PlantCard'
import './UserHome.css'

export default function UserHome() {
  const { user, logout } = useAuth()
  const [allPlants, setAllPlants] = useState([])
  const [plants, setPlants]       = useState([])

  useEffect(() => {
    // Charge plantes + photos
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
    <div className="user-home">
      <header className="uh-header">
        <img src="/logo.png" alt="MadaPlants" className="uh-logo" />
        <div className="uh-title">MadaPlants</div>
        <div className="uh-user">
          <span className="uh-username">{user.nom}</span>
          <button className="uh-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} />

      <div className="uh-grid">
        {plants.map(p => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>
    </div>
  )
}
