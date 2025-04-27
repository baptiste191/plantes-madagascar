import React from 'react'
import { Link } from 'react-router-dom'
import { Database, Edit, Users, BarChart2 } from 'lucide-react'
import './AdminHome.css'  // réutilise le même CSS que AdminHome

export default function AdminWelcome() {
  return (
    <div className="admin-grid">
      <Link to="plantes" className="admin-card">
        <div className="admin-card-icon"><Database size={32} /></div>
        <h2>Afficher la base de données</h2>
        <p>Accéder à la liste complète des plantes en lecture seule</p>
      </Link>

      <Link to="plantes" className="admin-card">
        <div className="admin-card-icon"><Edit size={32} /></div>
        <h2>Gérer les plantes</h2>
        <p>Ajouter, modifier ou supprimer des fiches plantes</p>
      </Link>

      <Link to="utilisateurs" className="admin-card">
        <div className="admin-card-icon"><Users size={32} /></div>
        <h2>Gérer les utilisateurs</h2>
        <p>Créer, modifier ou supprimer des comptes d’utilisateurs</p>
      </Link>

      <Link to="dashboard" className="admin-card">
        <div className="admin-card-icon"><BarChart2 size={32} /></div>
        <h2>Afficher les statistiques</h2>
        <p>Ouvrir le tableau de bord avec les visualisations des données clés</p>
      </Link>
    </div>
  )
}
