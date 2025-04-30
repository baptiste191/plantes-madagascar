import React, { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import api                  from '../services/api'
import './AjouterUtilisateur.css'

export default function AjouterUtilisateur() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    nom: '',
    mot_de_passe: '',
    description_utilisateur: ''
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const onCreateClick = e => {
    e.preventDefault()
    setShowConfirm(true)
  }
  const onCancel = () => setShowConfirm(false)

  const onConfirm = async () => {
    try {
      // 1) envoi de la création
      await api.post('/utilisateurs', {
        nom: form.nom,
        mot_de_passe: form.mot_de_passe,
        description_utilisateur: form.description_utilisateur,
        role: 'user'               // on force 'user'
      })
      // 2) redirection
      nav('/admin/utilisateurs/gestion', { replace: true })
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la création de l’utilisateur')
      setShowConfirm(false)
    }
  }

  return (
    <div className="au-container">
      <button className="au-back" onClick={() => nav(-1)}>
        ← Retour
      </button>
      <h2 className="au-title">Ajouter un utilisateur</h2>
      {error && <div className="au-error">{error}</div>}

      <form onSubmit={onCreateClick} className="au-form">
        <div className="au-field">
          <label htmlFor="nom">Nom d’utilisateur</label>
          <input
            id="nom"
            name="nom"
            type="text"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="au-field">
          <label htmlFor="mot_de_passe">Mot de passe</label>
          <input
            id="mot_de_passe"
            name="mot_de_passe"
            type="password"
            value={form.mot_de_passe}
            onChange={handleChange}
            required
          />
        </div>

        <div className="au-field">
          <label htmlFor="description_utilisateur">Description (optionnel)</label>
          <textarea
            id="description_utilisateur"
            name="description_utilisateur"
            rows={3}
            value={form.description_utilisateur}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="au-submit">
          Créer l’utilisateur
        </button>
      </form>

      {showConfirm && (
        <div className="au-modal-backdrop">
          <div className="au-modal">
            <p>Êtes-vous sûr·e de vouloir créer cet utilisateur ?</p>
            <div className="au-modal-actions">
              <button onClick={onConfirm} className="au-btn-confirm">
                Oui
              </button>
              <button onClick={onCancel} className="au-btn-cancel">
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
