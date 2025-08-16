import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

function Navbar() {
  const [admin, setAdmin] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [complaintCount, setComplaintCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('updateComplaintCount', (e) => {
      setComplaintCount(e.detail)
    })
    
    // Fetch initial complaint count
    fetchComplaintCount()
    
    // Fetch initial order count
    fetchOrderCount()
    const orderInterval = setInterval(fetchOrderCount, 10000)
    
    // Auto-refresh complaint count every 5 seconds
    const complaintInterval = setInterval(fetchComplaintCount, 5000)
    
    // Setup Socket.IO for real-time updates
    const socket = io('http://localhost:5001')
    socket.on('new-complaint', () => {
      // Increase counter when new complaint is added
      let currentCount = parseInt(localStorage.getItem('complaintCount') || '0')
      currentCount += 1
      localStorage.setItem('complaintCount', currentCount.toString())
      setComplaintCount(currentCount)
    })
    
    socket.on('status-updated', (data) => {
      let currentCount = parseInt(localStorage.getItem('complaintCount') || '0')
      
      // If changing FROM open to resolved/closed, decrease counter
      if (data.oldStatus === 'open' && (data.status === 'resolved' || data.status === 'closed')) {
        currentCount = Math.max(0, currentCount - 1)
      }
      // If changing TO open from resolved/closed, increase counter
      else if ((data.oldStatus === 'resolved' || data.oldStatus === 'closed') && data.status === 'open') {
        currentCount += 1
      }
      
      localStorage.setItem('complaintCount', currentCount.toString())
      setComplaintCount(currentCount)
    })
    
    return () => {
      clearInterval(orderInterval)
      clearInterval(complaintInterval)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('updateComplaintCount', (e) => {
        setComplaintCount(e.detail)
      })
      socket.disconnect()
    }
  }, [])

  const fetchComplaintCount = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) {
        const response = await axios.get('http://localhost:5001/complaints/all', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const openComplaints = response.data.complaints.filter(c => c.status === 'open').length
        setComplaintCount(openComplaints)
        localStorage.setItem('complaintCount', openComplaints.toString())
      }
    } catch (error) {
      console.error('Error fetching complaint count:', error)
    }
  }

  const fetchOrderCount = async () => {
    try {
      const response = await axios.get('http://localhost:5001/admin/orders')
      const upcomingOrders = response.data.filter(order => 
        order.status === 'pending' || 
        order.status === 'confirmed' || 
        order.status === 'preparing' || 
        order.status === 'ready'
      )
      setOrderCount(upcomingOrders.length || 0)
    } catch (error) {
      console.error('Error fetching order count:', error)
      setOrderCount(0)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    window.location.href = '/login'
  }

  const navItems = [
    { path: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/users', icon: 'bi-people-fill', label: 'Users' },
    { path: '/clients', icon: 'bi-shop', label: 'Resturants' },
    { path: '/orders', icon: 'bi-box-seam', label: 'Orders', badge: orderCount },
    { path: '/products', icon: 'bi-basket-fill', label: 'Products' },
    { path: '/reviews', icon: 'bi-star-fill', label: 'Reviews' },
    { path: '/complaints', icon: 'bi-headset', label: 'Complaints' },
    { path: '/profile', icon: 'bi-person-gear', label: admin?.username || 'Profile'}
  ]

  return (
    <nav className={`navbar navbar-expand-lg navbar-light sticky-top transition-all duration-300 ${
      isScrolled ? 'py-2' : 'py-3'
    }`} style={{ 
      background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', 
      boxShadow: isScrolled ? '0 8px 32px rgba(255, 87, 34, 0.4)' : '0 4px 20px rgba(255, 87, 34, 0.3)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center" to="/" style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontSize: isScrolled ? '1.5rem' : '1.8rem',
          transition: 'all 0.3s ease'
        }}>
          <div className="me-3 d-flex align-items-center justify-content-center" style={{
            width: '45px',
            height: '45px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <i className="bi bi-gear-fill" style={{ 
              fontSize: '1.3em',
              animation: 'spin 8s linear infinite'
            }}></i>
          </div>
          <span>Admin Panel</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        >
          <i className="bi bi-list text-white" style={{ fontSize: '1.5rem' }}></i>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">
            {navItems.map((item, index) => (
              <li key={item.path} className="nav-item" style={{
                animation: `fadeInDown 0.6s ease-out ${index * 0.1}s both`
              }}>
                <Link 
                  className={`nav-link px-3 py-2 rounded-pill fw-semibold text-white position-relative overflow-hidden ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  to={item.path} 
                  style={{ 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    textDecoration: 'none',
                    background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                    transition: 'all 0.3s ease',
                    backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.background = 'rgba(255,255,255,0.15)'
                      e.target.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.background = 'transparent'
                      e.target.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                  {item.path === '/complaints' && complaintCount > 0 && (
                    <span className="badge bg-danger ms-2" style={{
                      fontSize: '0.7rem',
                      animation: 'pulse 2s infinite'
                    }}>
                      {complaintCount}
                    </span>
                  )}
                  {item.path === '/orders' && item.badge > 0 && (
                    <span className="badge bg-warning ms-2" style={{
                      fontSize: '0.7rem',
                      animation: 'pulse 2s infinite'
                    }}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            
            {admin && (
              <li className="nav-item ms-2">
                <button 
                  className="btn rounded-pill px-4 py-2 fw-bold position-relative overflow-hidden" 
                  onClick={handleLogout} 
                  style={{ 
                    background: 'white', 
                    color: '#FF5722', 
                    border: 'none', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar