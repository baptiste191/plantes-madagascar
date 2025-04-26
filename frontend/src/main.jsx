import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'       // bien inclure l'extension .jsx
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

console.log('main.jsx lancé')   // pour traçage

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
