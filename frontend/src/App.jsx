// frontend/src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login       from './pages/Login.jsx'
import UserHome    from './pages/UserHome.jsx'
import PlantDetail from './pages/PlantDetail.jsx'
import AdminHome   from './pages/AdminHome.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

console.log('App chargé, route :', window.location.pathname)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/plant/:id" element={<PlantDetail />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute roles={['user','admin']}>
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plant/:id"
        element={
          <ProtectedRoute roles={['user','admin']}>
            <PlantDetail />
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
        {/* ... tes sous-routes admin ... */}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
