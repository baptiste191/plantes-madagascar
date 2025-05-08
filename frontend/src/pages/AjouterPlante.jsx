// src/pages/AjouterPlante.jsx
import React, { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import api                  from '../services/api'
import './AjouterPlante.css'

export default function AjouterPlante() {
  const nav = useNavigate()

  const [form, setForm] = useState({
    nom_scientifique: '',
    famille:          '',
    nom_vernaculaire: '',
    regions:          '',
    vertus:           '',
    usages:           '',
    parties_utilisees:'',
    mode_preparation: '',
    contre_indications:'',
    remarques:        '',
    references_biblio:'',
    endemique:        false
  })
  const [files, setFiles] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = e => {
    const { name, type, value, checked } = e.target
    const val = type === 'checkbox'
      ? checked
      : type === 'radio'
        ? (value === 'true')
        : value
    setForm(f => ({ ...f, [name]: val }))
  }

  const handleFiles = e => {
    const added = Array.from(e.target.files)
    setFiles(prev => {
      const combined = [...prev, ...added]
      const unique   = combined.filter(
        (f,i,a) => a.findIndex(x=>x.name===f.name)===i
      )
      return unique.slice(0, 4)
    })
    e.target.value = null
  }

  const removeFile = idx => {
    setFiles(prev => prev.filter((_,i)=>i!==idx))
  }

  const onCreateClick = e => {
    e.preventDefault()
    setShowConfirm(true)
  }
  const onCancel = () => setShowConfirm(false)

  const onConfirm = async () => {
    try {
      // 1) création de la plante
      const { data: { id } } = await api.post('/plantes', {
        nom_scientifique:   form.nom_scientifique,
        famille:            form.famille,
        nom_vernaculaire:   form.nom_vernaculaire,
        regions:            form.regions,
        vertus:             form.vertus,
        usages:             form.usages,
        parties_utilisees:  form.parties_utilisees,
        mode_preparation:   form.mode_preparation,
        contre_indications: form.contre_indications,
        remarques:          form.remarques,
        bibliographie:      form.references_biblio,
        endemique:          form.endemique
      })
      // 2) upload des photos
      for (let file of files) {
        const fd = new FormData()
        fd.append('photo', file)
        fd.append('plante_id', id)
        await api.post('/photos', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
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
          ['famille','Famille'],
          ['nom_vernaculaire','Nom vernaculaire'],
          ['regions','Régions'],
          ['vertus','Maladie traitée ou Indication thérapeutique'],
          ['usages','Posologie'],
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
          <label className="ap-label">Plante endémique</label>
          <div className="ap-radio-group">
            <label>
              <input
                type="radio"
                name="endemique"
                value="true"
                checked={form.endemique === true}
                onChange={handleChange}
              /> Oui
            </label>
            <label>
              <input
                type="radio"
                name="endemique"
                value="false"
                checked={form.endemique === false}
                onChange={handleChange}
              /> Non
            </label>
          </div>
        </div>

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
              <div key={i} className="ap-preview-wrapper">
                <img
                  src={URL.createObjectURL(f)}
                  alt={`preview ${i}`}
                  className="ap-thumb"
                />
                <button
                  type="button"
                  className="ap-remove-btn"
                  onClick={() => removeFile(i)}
                >
                  ×
                </button>
              </div>
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
