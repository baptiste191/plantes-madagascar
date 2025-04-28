// src/pages/AjouterPlante.jsx
import React, { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import api                  from '../services/api'
import './AjouterPlante.css'

export default function AjouterPlante() {
  const nav = useNavigate()

  // formulaire
  const [form, setForm]   = useState({
    nom_scientifique: '',
    nom_vernaculaire: '',
    regions: '',
    vertus: '',
    usages: '',
    parties_utilisees: '',
    mode_preparation: '',
    contre_indications: '',
    remarques: '',
    references_biblio: ''
  })
  const [files, setFiles] = useState([])

  // modal confirmation visible ?
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFiles = e => {
    const selected = Array.from(e.target.files).slice(0,4)
    setFiles(selected)
  }

  // lance la modal
  const onCreateClick = e => {
    e.preventDefault()
    setShowConfirm(true)
  }

  // annule, retourne au formulaire
  const onCancel = () => {
    setShowConfirm(false)
  }

  // exécute la vraie création
  const onConfirm = async () => {
    try {
      // 1) crée la plante
      const { data: { id } } = await api.post('/plantes', form)
      // 2) upload des photos (une requête par fichier)
      for (let file of files) {
        const fd = new FormData()
        fd.append('photo', file)
        fd.append('plante_id', id)
        await api.post('/photos', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      // 3) redirige et informe
      setShowConfirm(false)
      nav('/admin/plantes/gestion', { replace: true })
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'ajout de la plante")
      setShowConfirm(false)
    }
  }

  return (
    <div className="ap-container">
      <button className="ap-back" onClick={() => nav(-1)}>
        ← Retour
      </button>
      <h2 className="ap-title">Ajouter une plante</h2>

      <form onSubmit={onCreateClick} className="ap-form">
        {[
          ['nom_scientifique','Nom scientifique'],
          ['nom_vernaculaire','Nom vernaculaire'],
          ['regions','Régions (ex : DIANA, SAVA)'],
          ['vertus','Vertus'],
          ['usages','Usages'],
          ['parties_utilisees','Parties utilisées'],
          ['mode_preparation','Mode de préparation'],
          ['contre_indications','Contre-indications'],
          ['remarques','Remarques'],
          ['references_biblio','Bibliographie']
        ].map(([key,label])=>(
          <div key={key} className="ap-field">
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={form[key]}
              onChange={handleChange}
              required={key==='nom_scientifique'}
            />
          </div>
        ))}

        <div className="ap-field">
          <label>Photos (0 à 4)</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={handleFiles}
          />
          <div className="ap-previews">
            {files.map((f,i)=>(
              <img
                key={i}
                src={URL.createObjectURL(f)}
                alt={`preview ${i}`}
                className="ap-thumb"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="ap-submit">
          Créer la plante
        </button>
      </form>

      {showConfirm && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal">
            <p>Êtes-vous sûr·e de vouloir créer la plante ?</p>
            <div className="ap-modal-actions">
              <button onClick={onConfirm} className="ap-btn-confirm">
                Oui
              </button>
              <button onClick={onCancel} className="ap-btn-cancel">
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
