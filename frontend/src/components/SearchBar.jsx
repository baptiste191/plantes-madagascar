import React, { useState, useEffect } from 'react'
import './SearchBar.css'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')

  useEffect(() => {
    const id = setTimeout(() => onSearch(q), 200)
    return () => clearTimeout(id)
  }, [q, onSearch])

  return (
    <div className="sb-container">
      <input
        type="text"
        className="sb-input"
        placeholder="Rechercher par nom, région, vertu, usage…"
        value={q}
        onChange={e => setQ(e.target.value)}
      />
    </div>
  )
}
