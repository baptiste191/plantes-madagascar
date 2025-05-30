import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login                      from './pages/Login.jsx'
import UserHome                   from './pages/UserHome.jsx'
import PlantDetail                from './pages/PlantDetail.jsx'

import AdminHome                  from './pages/AdminHome.jsx'
import AdminWelcome               from './pages/AdminWelcome.jsx'
import AdminPlantes               from './pages/AdminPlantes.jsx'
import AdminGestionPlantes        from './pages/AdminGestionPlantes.jsx'
import AjouterPlante              from './pages/AjouterPlante.jsx'
import ModifierPlante             from './pages/ModifierPlante.jsx'

import AdminGestionUtilisateurs   from './pages/AdminGestionUtilisateurs.jsx'
import AjouterUtilisateur         from './pages/AjouterUtilisateur.jsx'
import ModifierUtilisateur        from './pages/ModifierUtilisateur.jsx'

import AdminDashboard             from './pages/AdminDashboard.jsx'
import ModifierAdmin              from './pages/ModifierAdmin.jsx'

import ProtectedRoute             from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* USER */}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={['user','admin']}>
            <UserHome/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plant/:id"
        element={
          <ProtectedRoute roles={['user','admin']}>
            <PlantDetail/>
          </ProtectedRoute>
        }
      />

      {/* ADMIN layout + nested */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminHome/>
          </ProtectedRoute>
        }
      >
        {/* page d’accueil admin */}
        <Route index element={<AdminWelcome/>} />

        {/* gestion plantes */}
        <Route path="plantes" element={<AdminPlantes/>} />
        <Route path="plantes/gestion" element={<AdminGestionPlantes/>} />
        <Route path="plantes/gestion/ajouter" element={<AjouterPlante/>} />
        <Route path="plantes/gestion/:id/modifier" element={<ModifierPlante/>} />

        {/* gestion utilisateurs */}
        <Route path="utilisateurs/gestion" element={<AdminGestionUtilisateurs/>} />
        <Route path="utilisateurs/gestion/ajouter" element={<AjouterUtilisateur/>} />
        <Route path="utilisateurs/:id/modifier" element={<ModifierUtilisateur/>} />

        {/* dashboard */}
        <Route path="dashboard" element={<AdminDashboard/>} />

        {/* profil admin */}
        <Route path="profil/:id/modifier" element={<ModifierAdmin/>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
