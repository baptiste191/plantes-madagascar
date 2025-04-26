import React, { useState } from 'react'
import axios from 'axios'
import './LoginForm.css'

export default function LoginForm({ onSuccess }) {
  const [nom, setNom] = useState('')
  const [mdp, setMdp] = useState('')
  const [error, setError] = useState('')

  const submit = async e => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await axios.post('/api/utilisateurs/login', {
        nom,
        mot_de_passe: mdp
      })
      onSuccess(data)  // token + user
    } catch {
      setError('Identifiants incorrects')
    }
  }

  return (
    <form className="login-form" onSubmit={submit}>
      {error && <div className="error">{error}</div>}
      <label>
        Identifiant
        <input
          value={nom}
          onChange={e => setNom(e.target.value)}
          required
        />
      </label>
      <label>
        Mot de passe
        <input
          type="password"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
          required
        />
      </label>
      <button type="submit">Se connecter</button>
    </form>
  )
}
