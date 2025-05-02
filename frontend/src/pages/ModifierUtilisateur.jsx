import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import './ModifierUtilisateur.css'

export default function ModifierUtilisateur() {
  const { id } = useParams()
  const nav   = useNavigate()

  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    nom: '',
    description_utilisateur: '',
    mot_de_passe: ''
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/utilisateurs/${id}`)
      .then(({ data }) => {
        setUser(data)
        setForm({
          nom: data.nom,
          description_utilisateur: data.description_utilisateur || '',
          mot_de_passe: ''
        })
      })
      .catch(() => setError("Impossible de charger l’utilisateur"))
  }, [id])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = e => { e.preventDefault(); setShowConfirm(true) }
  const onCancel = () => setShowConfirm(false)

  const onConfirm = async () => {
    try {
      await api.put(`/utilisateurs/${id}`, {
        nom: form.nom,
        description_utilisateur: form.description_utilisateur,
        ...(form.mot_de_passe ? { mot_de_passe: form.mot_de_passe } : {})
      })
      setShowConfirm(false)
      nav('/admin/utilisateurs/gestion', { replace: true })
    } catch {
      setShowConfirm(false)
      alert('Erreur lors de la modification')
    }
  }

  if (error) return <div className="mu-error">{error}</div>
  if (!user)  return <div className="mu-loading">Chargement…</div>

  return (
    <div className="mu-container">
      <button className="mu-back" onClick={() => nav(-1)}>← Retour</button>
      <h2 className="mu-title">Modifier l’utilisateur : {user.nom}</h2>

      <form onSubmit={onSubmit} className="mu-form">
        <div className="mu-field">
          <label htmlFor="nom">Nom d’utilisateur</label>
          <input
            id="nom" name="nom" type="text"
            value={form.nom} onChange={handleChange}
            required
          />
        </div>

        <div className="mu-field">
          <label htmlFor="description_utilisateur">Description</label>
          <textarea
            id="description_utilisateur"
            name="description_utilisateur"
            rows={3}
            value={form.description_utilisateur}
            onChange={handleChange}
          />
        </div>

        <div className="mu-field">
          <label htmlFor="mot_de_passe">Nouveau mot de passe</label>
          <input
            id="mot_de_passe" name="mot_de_passe" type="password"
            placeholder="Laissez vide pour ne pas changer"
            value={form.mot_de_passe} onChange={handleChange}
          />
        </div>

        <button type="submit" className="mu-submit">Enregistrer</button>
      </form>

      {showConfirm && (
        <div className="mu-modal-backdrop">
          <div className="mu-modal">
            <p>Confirmez-vous les modifications ?</p>
            <div className="mu-modal-actions">
              <button onClick={onConfirm} className="mu-btn-confirm">Oui</button>
              <button onClick={onCancel}  className="mu-btn-cancel">Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
