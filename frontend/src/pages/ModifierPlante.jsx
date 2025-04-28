// src/pages/ModifierPlante.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import api                          from '../services/api'
import './ModifierPlante.css'

export default function ModifierPlante() {
  const { id } = useParams()
  const nav   = useNavigate()

  const [form, setForm] = useState({
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

  const [existingPhotos, setExistingPhotos] = useState([])   // { id, filename }
  const [toDeletePhotos, setToDeletePhotos] = useState([])   // ids à supprimer
  const [newFiles, setNewFiles] = useState([])               // File[]

  const [showConfirm, setShowConfirm] = useState(false)

  // charge plante + photos
  useEffect(() => {
    async function load() {
      try {
        const { data: plant }  = await api.get(`/plantes/${id}`)
        const { data: photos } = await api.get(`/photos?plante_id=${id}`)
        setForm({
          nom_scientifique:   plant.nom_scientifique,
          nom_vernaculaire:   plant.nom_vernaculaire || '',
          regions:            plant.regions || '',
          vertus:             plant.vertus || '',
          usages:             plant.usages || '',
          parties_utilisees:  plant.parties_utilisees || '',
          mode_preparation:   plant.mode_preparation || '',
          contre_indications: plant.contre_indications || '',
          remarques:          plant.remarques || '',
          references_biblio:  plant.bibliographie || ''
        })
        setExistingPhotos(photos)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [id])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFiles = e => {
    const added = Array.from(e.target.files)
    setNewFiles(prev => {
      const all = [...prev, ...added]
      // unique par nom, max 4
      const uniq = all.filter((f,i,a) =>
        a.findIndex(x=>x.name===f.name)===i
      ).slice(0, 4)
      return uniq
    })
    e.target.value = null
  }

  const removeExisting = pid => {
    setToDeletePhotos(prev => [...prev, pid])
    setExistingPhotos(prev => prev.filter(p => p.id !== pid))
  }

  const removeNew = idx => {
    setNewFiles(prev => prev.filter((_,i)=>i!==idx))
  }

  const onUpdateClick = e => {
    e.preventDefault()
    setShowConfirm(true)
  }
  const onCancel = () => setShowConfirm(false)

  const onConfirm = async () => {
    try {
      // 1) update plante
      await api.put(`/plantes/${id}`, {
        nom_scientifique: form.nom_scientifique,
        nom_vernaculaire: form.nom_vernaculaire,
        regions:          form.regions,
        vertus:           form.vertus,
        usages:           form.usages,
        parties_utilisees:form.parties_utilisees,
        mode_preparation: form.mode_preparation,
        contre_indications: form.contre_indications,
        remarques:        form.remarques,
        bibliographie:    form.references_biblio
      })
      // 2) delete photos cochées
      for (let pid of toDeletePhotos) {
        await api.delete(`/photos/${pid}`)
      }
      // 3) upload new
      for (let file of newFiles) {
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
      alert('Erreur lors de la modification')
      setShowConfirm(false)
    }
  }

  return (
    <div className="mp-container">
      <button className="mp-back" onClick={() => nav(-1)}>← Retour</button>
      <h2 className="mp-title">Modifier la plante</h2>

      <form onSubmit={onUpdateClick} className="mp-form">
        {[
          ['nom_scientifique','Nom scientifique'],
          ['nom_vernaculaire','Nom vernaculaire'],
          ['regions','Régions'],
          ['vertus','Vertus'],
          ['usages','Usages'],
          ['parties_utilisees','Parties utilisées'],
          ['mode_preparation','Mode de préparation'],
          ['contre_indications','Contre-indications'],
          ['remarques','Remarques'],
          ['references_biblio','Bibliographie']
        ].map(([key,label])=>(
          <div key={key} className="mp-field">
            <label htmlFor={key}>{label}</label>
            <input
              id={key} name={key} type="text"
              value={form[key]}
              onChange={handleChange}
              required={key==='nom_scientifique'}
            />
          </div>
        ))}

        <div className="mp-field">
          <label>Photos existantes</label>
          <div className="mp-previews">
            {existingPhotos.map((p,i)=>(
              <div key={p.id} className="mp-preview-wrapper">
                <img
                  src={`/photos/${p.filename}`}
                  alt=""
                  className="mp-thumb"
                />
                <button
                  type="button"
                  className="mp-remove-btn"
                  onClick={() => removeExisting(p.id)}
                >×</button>
              </div>
            ))}
            {existingPhotos.length===0 && <div className="mp-noimg">Aucune photo</div>}
          </div>
        </div>

        <div className="mp-field">
          <label>Ajouter des photos (max 4)</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={handleFiles}
          />
          <div className="mp-previews">
            {newFiles.map((f,i)=>(
              <div key={i} className="mp-preview-wrapper">
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="mp-thumb"
                />
                <button
                  type="button"
                  className="mp-remove-btn"
                  onClick={()=>removeNew(i)}
                >×</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="mp-submit">
          Enregistrer les modifications
        </button>
      </form>

      {showConfirm && (
        <div className="mp-modal-backdrop">
          <div className="mp-modal">
            <p>Confirmez-vous les modifications ?</p>
            <div className="mp-modal-actions">
              <button onClick={onConfirm} className="mp-btn-confirm">Oui</button>
              <button onClick={onCancel} className="mp-btn-cancel">Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
