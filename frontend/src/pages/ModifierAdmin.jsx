// src/pages/ModifierAdmin.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate }                from 'react-router-dom'
import { useAuth }                    from '../hooks/useAuth'
import api                            from '../services/api'
import './ModifierAdmin.css'

export default function ModifierAdmin() {
  const { user } = useAuth()
  const nav      = useNavigate()

  const [form, setForm] = useState({
    description_utilisateur: '',
    mot_de_passe: '',
    confirm_mot_de_passe: ''
  })
  const [error, setError]           = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // charge la description existante
  useEffect(() => {
    api.get(`/utilisateurs/${user.id}`)
      .then(({ data }) => {
        setForm(f => ({
          ...f,
          description_utilisateur: data.description_utilisateur || ''
        }))
      })
      .catch(() => setError("Impossible de charger votre profil"))
  }, [user.id])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const onSubmit = e => {
    e.preventDefault()
    // si on renseigne un mot de passe, vérifier qu’il est confirmé
    if (form.mot_de_passe && form.mot_de_passe !== form.confirm_mot_de_passe) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setError(null)
    setShowConfirm(true)
  }
  const onCancel = () => setShowConfirm(false)

  const onConfirm = async () => {
    try {
      await api.put(`/utilisateurs/${user.id}`, {
        description_utilisateur: form.description_utilisateur,
        ...(form.mot_de_passe
          ? { mot_de_passe: form.mot_de_passe }
          : {})
      })
      setShowConfirm(false)
      nav('/admin', { replace: true })
    } catch {
      setError('Erreur lors de la modification')
      setShowConfirm(false)
    }
  }

  return (
    <div className="ma-container">
      <button
        className="ma-back"
        onClick={() => nav('/admin', { replace: true })}
      >
        ← Retour
      </button>

      <h2 className="ma-title">Modifier mon profil</h2>

      {error && <div className="ma-error">{error}</div>}

      <form onSubmit={onSubmit} className="ma-form">
        <div className="ma-field">
          <label htmlFor="description_utilisateur">Description</label>
          <textarea
            id="description_utilisateur"
            name="description_utilisateur"
            rows={3}
            value={form.description_utilisateur}
            onChange={handleChange}
          />
        </div>

        <div className="ma-field">
          <label htmlFor="mot_de_passe">Nouveau mot de passe</label>
          <input
            id="mot_de_passe"
            name="mot_de_passe"
            type="password"
            placeholder="Laissez vide pour ne pas changer"
            value={form.mot_de_passe}
            onChange={handleChange}
          />
        </div>

        <div className="ma-field">
          <label htmlFor="confirm_mot_de_passe">
            Confirmez le mot de passe
          </label>
          <input
            id="confirm_mot_de_passe"
            name="confirm_mot_de_passe"
            type="password"
            placeholder="Confirmez le mot de passe"
            value={form.confirm_mot_de_passe}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="ma-submit">
          Enregistrer
        </button>
      </form>

      {showConfirm && (
        <div className="ma-modal-backdrop">
          <div className="ma-modal">
            <p>Confirmez-vous les modifications ?</p>
            <div className="ma-modal-actions">
              <button onClick={onConfirm} className="ma-btn-confirm">
                Oui
              </button>
              <button onClick={onCancel} className="ma-btn-cancel">
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
