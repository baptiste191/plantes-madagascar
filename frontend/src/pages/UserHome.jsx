import React, { useState, useEffect } from 'react'
import axios          from 'axios'
import { useAuth }    from '../hooks/useAuth'
import PlantCard      from '../components/PlantCard'
import './UserHome.css'

export default function UserHome() {
  const { token, logout } = useAuth()
  const [plantes, setPlantes] = useState([])
  const [search, setSearch]   = useState('')

  useEffect(() => {
    axios.get(`/api/plantes?nom=${search}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => setPlantes(data))
  }, [search, token])

  return (
    <div className="user-home">
      <header>
        <h2>MadaPlants</h2>
        <button onClick={logout}>Déconnexion</button>
      </header>
      <input
        className="search-bar"
        placeholder="Rechercher par nom, région ou utilisation"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="plant-list">
        {plantes.map(p => (
          <PlantCard key={p.id} plante={p} />
        ))}
      </div>
    </div>
  )
}
