import React from 'react'
import LoginForm from '../components/Auth/LoginForm'
import logo from '../assets/logos/logo.png'
import './Login.css'

export default function Login() {
  const onSuccess = ({ token, user }) => {
    // stocker token/user (localStorage ou contexte)
    // rediriger selon user.role
    console.log(token, user)
  }

  return (
    <div className="login-page">
      <img src={logo} alt="MadaPlants" className="login-logo" />
      <h1>MadaPlants</h1>
      <LoginForm onSuccess={onSuccess} />
    </div>
  )
}
