import React, { useState, useEffect } from 'react'
import './SearchBar.css'

export default function SearchBar({ value = '', onSearch }) {
  // 1) initialise q avec la prop `value`
  const [q, setQ] = useState(value)

  // 2) si la prop `value` change (par exemple via l’URL),
  //    on remet q à jour
  useEffect(() => {
    setQ(value)
  }, [value])

  // 3) votre debounce existant
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
