import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login             from './pages/Login'
import UserHome          from './pages/UserHome'
import AdminHome         from './pages/AdminHome'
import AdminPlantes      from './pages/AdminPlantes'
import AdminUtilisateurs from './pages/AdminUtilisateurs'
import AdminDashboard    from './pages/AdminDashboard'
import ProtectedRoute    from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute roles={['user','admin']}>
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminHome />
          </ProtectedRoute>
        }
      >
        <Route index               element={<Navigate to="plantes" replace />} />
        <Route path="plantes"      element={<AdminPlantes />} />
        <Route path="utilisateurs" element={<AdminUtilisateurs />} />
        <Route path="dashboard"    element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
