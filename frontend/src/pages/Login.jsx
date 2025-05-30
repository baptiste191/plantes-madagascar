import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }    from '../hooks/useAuth'
import LoginForm      from '../components/Auth/LoginForm'
import logo           from '../assets/logos/logo.png'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const onSuccess = ({ token, user }) => {
    login({ user, token })
    if (user.role === 'admin')  navigate('/admin',             { replace: true })
    else                  navigate('/user',        { replace: true })
  }

  return (
    <div className="login-page">
      <img src={logo} alt="GREENMADAG" className="login-logo" />
      <LoginForm onSuccess={onSuccess} />
    </div>
  )
}
