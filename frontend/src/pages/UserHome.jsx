import React, { useState, useEffect } from 'react'
import { useAuth }                   from '@/hooks/useAuth'
import api                           from '@/services/api'
import { useSearchParams, Link }     from 'react-router-dom'
import SearchBar                     from '@/components/SearchBar'
import PlantCard                     from '@/components/PlantCard'
import './UserHome.css'

export default function UserHome() {
  const { user, logout }                = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const search                          = searchParams.get('q') || ''

  const [allPlants, setAllPlants] = useState([])
  const [plants,    setPlants]    = useState([])

  // 1) Chargement initial
  useEffect(() => {
    Promise.all([ api.get('/plantes'), api.get('/photos') ])
      .then(([{ data: plantesData }, { data: photosData }]) => {
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

  // 2) Filtrage à chaque changement de `search` ou de la liste brute
  useEffect(() => {
    const q = search.trim().toLowerCase()
    setPlants(
      !q
        ? allPlants
        : allPlants.filter(p =>
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
              .includes(q)
          )
    )
  }, [search, allPlants])

  // 3) Quand l’utilisateur tape dans la barre, on met à jour l’URL
  const handleSearch = q => {
    if (q) setSearchParams({ q })
    else  setSearchParams({})
  }

  return (
    <div className="user-home">
      <header className="uh-header">
        <div className="uh-left">
          <img src="/logo.png" alt="MadaPlants" className="uh-logo" />
        </div>

        <div className="uh-title">
          <span style={{ color: '#97bf0d' }}>GREEN</span>
          <span style={{ color: '#464547' }}>MADAG</span>
        </div>

        <div className="uh-user">
          <span className="uh-username">{user.nom}</span>
          <button className="uh-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      <SearchBar value={search} onSearch={handleSearch} />

      <div className="uh-grid">
        {plants.map(p => (
          <Link to={`/plant/${p.id}?${searchParams.toString()}`} key={p.id}>
            <PlantCard plant={p} />
          </Link>
        ))}
      </div>
    </div>
  )
}
