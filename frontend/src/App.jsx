import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login               from './pages/Login.jsx'
import UserHome            from './pages/UserHome.jsx'
import PlantDetail         from './pages/PlantDetail.jsx'

import AdminHome           from './pages/AdminHome.jsx'
import AdminWelcome        from './pages/AdminWelcome.jsx'
import AdminPlantes        from './pages/AdminPlantes.jsx'
import AdminGestionPlantes from './pages/AdminGestionPlantes.jsx'
import AjouterPlante       from './pages/AjouterPlante.jsx'
import ModifierPlante      from './pages/ModifierPlante.jsx'
import AdminUtilisateurs   from './pages/AdminUtilisateurs.jsx'
import AdminDashboard      from './pages/AdminDashboard.jsx'

import ProtectedRoute      from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* ====== USER ====== */}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <UserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plant/:id"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <PlantDetail />
          </ProtectedRoute>
        }
      />

      {/* ====== ADMIN LAYOUT + NESTED ====== */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminHome />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminWelcome />} />
        <Route path="plantes" element={<AdminPlantes />} />
        <Route path="plantes/gestion" element={<AdminGestionPlantes />} />
        <Route path="plantes/gestion/ajouter" element={<AjouterPlante />} />
        <Route path="plantes/gestion/:id/modifier" element={<ModifierPlante />} />
        <Route path="utilisateurs" element={<AdminUtilisateurs />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
