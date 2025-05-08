import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import './ModifierPlante.css'

export default function ModifierPlante() {
  const { id } = useParams()
  const nav   = useNavigate()

  const [form, setForm] = useState({
    nom_scientifique:   '',
    famille:            '',
    nom_vernaculaire:   '',
    regions:            '',
    vertus:             '',
    usages:             '',
    parties_utilisees:  '',
    mode_preparation:   '',
    contre_indications: '',
    remarques:          '',
    references_biblio:  '',
    endemique:          false
  })

  const [existingPhotos, setExistingPhotos] = useState([])   // { id, filename }
  const [toDeletePhotos, setToDeletePhotos]   = useState([]) // ids à supprimer
  const [newFiles, setNewFiles]               = useState([]) // File[]
  const [showConfirm, setShowConfirm]         = useState(false)

  // 1) charger la plante + ses photos
  useEffect(() => {
    async function load() {
      try {
        const { data: plant }  = await api.get(`/plantes/${id}`)
        const { data: photos } = await api.get(`/photos?plante_id=${id}`)
        setForm({
          nom_scientifique:   plant.nom_scientifique,
          famille:            plant.famille            || '',
          nom_vernaculaire:   plant.nom_vernaculaire   || '',
          regions:            plant.regions            || '',
          vertus:             plant.vertus             || '',
          usages:             plant.usages             || '',
          parties_utilisees:  plant.parties_utilisees  || '',
          mode_preparation:   plant.mode_preparation   || '',
          contre_indications: plant.contre_indications || '',
          remarques:          plant.remarques          || '',
          references_biblio:  plant.bibliographie      || '',
          endemique:          Boolean(plant.endemique)
        })
        setExistingPhotos(photos)
      } catch (err) {
        console.error('Impossible de charger la plante', err)
      }
    }
    load()
  }, [id])

  // gère tous les champs (text, radio, checkbox…)
  const handleChange = e => {
    const { name, type, value, checked } = e.target
    const val = type === 'checkbox'
      ? checked
      : type === 'radio'
        ? (value === 'true')
        : value
    setForm(f => ({ ...f, [name]: val }))
  }

  // sélection des nouveaux fichiers (max 4 au total)
  const handleFiles = e => {
    const added = Array.from(e.target.files)
    setNewFiles(prev => {
      const maxNew = 4 - existingPhotos.length
      if (added.length > maxNew) {
        alert(`Vous ne pouvez ajouter que ${maxNew} photo(s) supplémentaire(s).`)
      }
      const all = [...prev, ...added]
      const uniq = all.filter((f,i,a) => a.findIndex(x => x.name === f.name) === i)
      return uniq.slice(0, maxNew)
    })
    e.target.value = null
  }

  const removeExisting = pid => {
    setToDeletePhotos(prev => [...prev, pid])
    setExistingPhotos(prev => prev.filter(p => p.id !== pid))
  }
  const removeNew = idx => setNewFiles(prev => prev.filter((_,i) => i !== idx))

  const onUpdateClick = e => {
    e.preventDefault()
    setShowConfirm(true)
  }
  const onCancel = () => setShowConfirm(false)

  // 3) confirmation → envoi
  const onConfirm = async () => {
    try {
      // a) mise à jour de la plante
      await api.put(`/plantes/${id}`, {
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

      // b) suppression des photos cochées
      for (let pid of toDeletePhotos) {
        await api.delete(`/photos/${pid}`)
      }

      // c) upload des nouvelles photos
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
      console.error('Erreur lors de la modification', err)
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
        ].map(([key,label]) => (
          <div key={key} className="mp-field">
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              type="text"
              value={form[key]}
              onChange={handleChange}
              required={key === 'nom_scientifique'}
            />
          </div>
        ))}

        <div className="mp-field">
          {/* Plante endémique en gras comme les autres labels */}
          <label className="mp-label">Plante endémique</label>
          <div className="mp-radio-group">
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

        <div className="mp-field">
          <label>Photos existantes (max. 4)</label>
          <div className="mp-previews">
            {existingPhotos.map(p => (
              <div key={p.id} className="mp-preview-wrapper">
                <img src={`/photos/${p.filename}`} alt="" className="mp-thumb" />
                <button
                  type="button"
                  className="mp-remove-btn"
                  onClick={() => removeExisting(p.id)}
                >×</button>
              </div>
            ))}
            {existingPhotos.length === 0 && (
              <div className="mp-noimg">Aucune photo</div>
            )}
          </div>
        </div>

        <div className="mp-field">
          <label>Ajouter des photos (max. {4 - existingPhotos.length})</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={handleFiles}
            disabled={existingPhotos.length >= 4}
          />
          <div className="mp-previews">
            {newFiles.map((f,i) => (
              <div key={i} className="mp-preview-wrapper">
                <img src={URL.createObjectURL(f)} alt="" className="mp-thumb" />
                <button
                  type="button"
                  className="mp-remove-btn"
                  onClick={() => removeNew(i)}
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
              <button onClick={onCancel}  className="mp-btn-cancel">Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
