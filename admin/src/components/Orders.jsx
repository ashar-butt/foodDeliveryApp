import { useState, useEffect } from 'react'
import axios from 'axios'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = () => {
    axios.get('http://localhost:5001/admin/orders')
      .then(res => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-success'
      case 'preparing': return 'bg-warning text-dark'
      case 'confirmed': return 'bg-info'
      case 'pending': return 'bg-secondary'
      case 'cancelled': return 'bg-danger'
      default: return 'bg-light text-dark'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return 'bi-check-circle'
      case 'preparing': return 'bi-clock'
      case 'confirmed': return 'bi-check'
      case 'pending': return 'bi-hourglass'
      case 'cancelled': return 'bi-x-circle'
      default: return 'bi-question-circle'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = 
      (order.userId?.username || order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.items?.[0]?.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container mt-4">
      <div className="admin-card p-5 mb-4 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
          zIndex: 1
        }}></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)'
              }}>
                <i className="bi bi-box-seam text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h2 className="mb-0 fw-bold" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Orders Management</h2>
                <p className="text-muted mb-0 small">Real-time order monitoring and tracking</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-success px-3 py-2 rounded-pill">
                <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }}></i>
                Live Updates
              </span>
              <span className="badge px-3 py-2 rounded-pill" style={{
                background: 'linear-gradient(45deg, #FF5722, #FF9800)'
              }}>
                {orders.length} Total Orders
              </span>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  border: 'none',
                  color: 'white'
                }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: '2px solid #FF9800' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ border: '2px solid #FF9800' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="col-md-2">
                <div className="p-3 rounded-3 text-center" style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #FF9800'
                }}>
                  <i className={`bi ${getStatusIcon(status)} mb-2`} style={{ 
                    fontSize: '1.5rem',
                    color: '#FF5722'
                  }}></i>
                  <div className="fw-bold">{count}</div>
                  <small className="text-muted text-capitalize">{status}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#FF5722' }}></div>
            <p className="mt-3 text-muted">Loading orders...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th><i className="bi bi-hash me-2"></i>Order ID</th>
                  <th><i className="bi bi-person me-2"></i>Customer</th>
                  <th><i className="bi bi-shop me-2"></i>Restaurant</th>
                  <th>Amount</th>
                  <th><i className="bi bi-clock me-2"></i>Date</th>
                  <th><i className="bi bi-bar-chart me-2"></i>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.05}s both`
                  }}>
                    <td>
                      <code className="small text-muted">#{order._id.slice(-8)}</code>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-2 d-flex align-items-center justify-content-center" style={{
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                          borderRadius: '50%',
                          color: 'white',
                          fontSize: '0.9rem'
                        }}>
                          {(order.userId?.username || order.customerName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold">{order.userId?.username || order.customerName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shop-window me-2" style={{ color: '#FF5722' }}></i>
                        <span>{order.items?.[0]?.restaurantName || 'Multiple'}</span>
                      </div>
                    </td>
                    <td className="fw-bold" style={{ color: '#28a745' }}>
                      PKR {order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="text-muted small">
                      {order.orderDate ? (
                        <div>
                          <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                          <small className="text-muted">{new Date(order.orderDate).toLocaleTimeString()}</small>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${getStatusColor(order.status)}`}>
                        <i className={`bi ${getStatusIcon(order.status)} me-1`}></i>
                        {order.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <p className="text-muted">No orders found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders