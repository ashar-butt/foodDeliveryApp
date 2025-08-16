import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Users from './components/Users'
import Clients from './components/Clients'
import Orders from './components/Orders'
import Products from './components/Products'
import Reviews from './components/Reviews'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import ResetPassword from './components/ResetPassword'
import Profile from './components/Profile'
import Complaints from './components/Complaints'
import ComplaintChat from './components/ComplaintChat'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

function AppContent() {
  const [admin, setAdmin] = useState(null)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/reset-password'

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  return (
    <div className="app-wrapper">
      {!isLoginPage && <Navbar />}
      <main className="container-fluid">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
          <Route path="/complaints/chat/:id" element={<ProtectedRoute><ComplaintChat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App