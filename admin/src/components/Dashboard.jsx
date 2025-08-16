import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = () => {
      axios.get('http://localhost:5001/admin/stats')
        .then(res => {
          setStats(res.data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
    
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const statsCards = [
    { key: 'totalUsers', label: 'Users', icon: 'bi-people-fill', path: '/users', color: '#FF5722' },
    { key: 'totalClients', label: 'Clients', icon: 'bi-shop', path: '/clients', color: '#FF7043' },
    { key: 'totalOrders', label: 'Orders', icon: 'bi-box-seam', path: '/orders', color: '#FF8A65' },
    { key: 'totalProducts', label: 'Products', icon: 'bi-basket-fill', path: '/products', color: '#FFAB91' },
    { key: 'totalReviews', label: 'Reviews', icon: 'bi-star-fill', path: '/reviews', color: '#FFCC02' },
    { key: 'totalComplaints', label: 'Complaints', icon: 'bi-headset', path: '/complaints', color: '#FF6B6B' }
  ]

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="admin-card p-5 mb-5 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
        color: 'white',
        animation: 'slideInUp 0.6s ease-out both'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'background-rotate 20s linear infinite',
          zIndex: 1
        }}></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="text-center">
            <div className="mb-4 position-relative">
              <div className="position-absolute" style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'pulse 3s infinite'
              }}></div>
              <i className="bi bi-speedometer2 position-relative" style={{ 
                fontSize: '4rem',
                color: 'white',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                animation: 'icon-bounce 2s ease-in-out infinite'
              }}></i>
            </div>
            <h1 className="fw-bold mb-3" style={{ 
              fontSize: '3.5rem',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              animation: 'fadeInDown 0.8s ease-out 0.2s both'
            }}>Admin Dashboard</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              opacity: '0.9',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.8s ease-out 0.4s both'
            }}>Monitor and manage your food delivery platform</p>
            <div className="d-flex justify-content-center align-items-center gap-4" style={{
              animation: 'fadeInDown 0.8s ease-out 0.6s both'
            }}>
              <div className="d-flex align-items-center gap-3">
                <span className="badge px-4 py-3 rounded-pill position-relative overflow-hidden" style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  animation: 'stats-float 3s ease-in-out infinite'
                }}>
                  <i className="bi bi-circle-fill me-2" style={{ 
                    fontSize: '0.6rem',
                    animation: 'pulse 1.5s infinite',
                    color: '#4CAF50'
                  }}></i>
                  <span className="fw-bold">Live Updates</span>
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}></div>
                </span>
                <div className="text-center">
                  <div className="small opacity-75">Last updated</div>
                  <div className="fw-bold" style={{
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100" style={{
          height: '4px',
          background: 'linear-gradient(90deg, #4CAF50, #2196F3, #FF9800, #E91E63)',
          animation: 'shimmer 2s ease-in-out infinite'
        }}></div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {statsCards.map((card, index) => (
          <div key={card.key} className="col-xl-2 col-lg-3 col-md-4 col-sm-6" style={{
            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
          }}>
            <Link to={card.path} className="text-decoration-none">
              <div className="stats-card text-center p-4 h-100 position-relative overflow-hidden" style={{
                animation: 'stats-float 3s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`
              }}>
                <div className="position-absolute top-0 end-0 opacity-25" style={{
                  animation: 'background-rotate 8s linear infinite'
                }}>
                  <i className={`bi ${card.icon}`} style={{ fontSize: '4rem', color: card.color }}></i>
                </div>
                <div className="position-relative" style={{ zIndex: 2 }}>
                  <div className="mb-3">
                    <i className={`bi ${card.icon}`} style={{ 
                      fontSize: '3rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      animation: 'icon-bounce 2s ease-in-out infinite'
                    }}></i>
                  </div>
                  <h5 className="mb-2 fw-semibold">{card.label}</h5>
                  <h2 className="fw-bold mb-0" style={{
                    fontSize: '2.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    animation: 'number-glow 2s ease-in-out infinite alternate'
                  }}>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      stats[card.key] || 0
                    )}
                  </h2>
                  <div className="mt-2">
                    <small className="text-white-50" style={{
                      animation: 'arrow-slide 1.5s ease-in-out infinite'
                    }}>
                      <i className="bi bi-arrow-right me-1"></i>
                      View Details
                    </small>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Customer Support Section */}
      <div className="admin-card p-4 mb-4" style={{
        animation: 'slideInUp 0.8s ease-out 0.6s both'
      }}>
        <h4 className="mb-4" style={{ color: '#FF5722' }}>
          <i className="bi bi-headset me-2" style={{
            animation: 'icon-bounce 2s ease-in-out infinite'
          }}></i>
          Customer Support
        </h4>
        <div className="row g-3">
          <div className="col-md-12">
            <Link to="/complaints" className="btn btn-outline-danger w-100 py-4 rounded-3 position-relative overflow-hidden" style={{
              animation: 'action-pulse 3s ease-in-out infinite',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)',
              border: '2px solid #dc3545'
            }} onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-8px) scale(1.02)';
              e.target.style.boxShadow = '0 15px 35px rgba(220, 53, 69, 0.3)';
              e.target.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
              e.target.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)';
              e.target.style.color = '#dc3545';
            }}>
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-chat-dots-fill me-3" style={{ 
                  fontSize: '2rem',
                  animation: 'icon-wiggle 2s ease-in-out infinite'
                }}></i>
                <div className="text-start">
                  <h5 className="mb-1 fw-bold">Manage Customer Complaints</h5>
                  <p className="mb-0 small opacity-75">Real-time chat support and complaint resolution</p>
                </div>
                <i className="bi bi-arrow-right ms-auto" style={{
                  fontSize: '1.5rem',
                  animation: 'arrow-slide 1.5s ease-in-out infinite'
                }}></i>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card p-4">
        <h4 className="mb-4" style={{ color: '#FF5722' }}>
          <i className="bi bi-lightning-fill me-2"></i>
          Quick Actions
        </h4>
        <div className="row g-3">
          <div className="col-md-3">
            <Link to="/users" className="btn btn-outline-primary w-100 py-3 rounded-3 position-relative overflow-hidden" style={{
              animation: 'action-pulse 3s ease-in-out infinite',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.05)';
              e.target.style.boxShadow = '0 10px 25px rgba(13, 110, 253, 0.3)';
            }} onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
              <i className="bi bi-person-plus-fill d-block mb-2" style={{ 
                fontSize: '1.5rem',
                animation: 'icon-wiggle 2s ease-in-out infinite'
              }}></i>
              Manage Users
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/clients" className="btn btn-outline-success w-100 py-3 rounded-3 position-relative overflow-hidden" style={{
              animation: 'action-pulse 3s ease-in-out infinite 0.2s',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.05)';
              e.target.style.boxShadow = '0 10px 25px rgba(25, 135, 84, 0.3)';
            }} onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
              <i className="bi bi-shop-window d-block mb-2" style={{ 
                fontSize: '1.5rem',
                animation: 'icon-wiggle 2s ease-in-out infinite 0.2s'
              }}></i>
              Restaurant Approvals
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/orders" className="btn btn-outline-warning w-100 py-3 rounded-3 position-relative overflow-hidden" style={{
              animation: 'action-pulse 3s ease-in-out infinite 0.4s',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.05)';
              e.target.style.boxShadow = '0 10px 25px rgba(255, 193, 7, 0.3)';
            }} onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
              <i className="bi bi-clipboard-check d-block mb-2" style={{ 
                fontSize: '1.5rem',
                animation: 'icon-wiggle 2s ease-in-out infinite 0.4s'
              }}></i>
              Monitor Orders
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/reviews" className="btn btn-outline-info w-100 py-3 rounded-3 position-relative overflow-hidden" style={{
              animation: 'action-pulse 3s ease-in-out infinite 0.6s',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.05)';
              e.target.style.boxShadow = '0 10px 25px rgba(13, 202, 240, 0.3)';
            }} onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
              <i className="bi bi-chat-square-heart d-block mb-2" style={{ 
                fontSize: '1.5rem',
                animation: 'icon-wiggle 2s ease-in-out infinite 0.6s'
              }}></i>
              Review Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard