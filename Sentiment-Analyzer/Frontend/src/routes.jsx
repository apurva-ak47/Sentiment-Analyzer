import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { auth } from './lib/api'

function ProtectedRoute({ children }) {
  return auth.isAuthenticated() ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  return auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : children
}

export default function RouterConfig({ darkMode, toggleDarkMode }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnly>
            <Signup />
          </PublicOnly>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
