import { useState, useEffect } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import ConfirmModal from './ConfirmModal'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingClient, setEditingClient] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(null)

  useEffect(() => {
    fetchClients()
    const interval = setInterval(fetchClients, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchClients = () => {
    axios.get('http://localhost:5001/admin/clients')
      .then(res => {
        setClients(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const deleteClient = (client) => {
    setClientToDelete(client)
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    axios.delete(`http://localhost:5001/admin/clients/${clientToDelete._id}`)
      .then(() => {
        fetchClients()
        setShowConfirm(false)
        setClientToDelete(null)
      })
      .catch(err => console.error(err))
  }

  const editClient = (client) => {
    setEditingClient(client._id)
    setEditForm({ 
      username: client.username, 
      email: client.email, 
      restaurantName: client.restaurantName,
      password: ''
    })
  }

  const saveClient = async () => {
    setPasswordError('')
    if (editForm.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(editForm.password)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, number, and special character')
      return
    }
    const updateData = { ...editForm }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    } else {
      delete updateData.password
    }
    axios.put(`http://localhost:5001/admin/clients/${editingClient}`, updateData)
      .then(() => {
        fetchClients()
        setEditingClient(null)
        setEditForm({})
        setPasswordError('')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('adminUpdate', { detail: { type: 'client', action: 'update' } }))
        }, 500)
      })
      .catch(err => console.error(err))
  }

  const filteredClients = clients.filter(client => 
    (client.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <i className="bi bi-shop text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h2 className="mb-0 fw-bold" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Restaurant Management</h2>
                <p className="text-muted mb-0 small">Monitor and manage restaurant partners</p>
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
                {clients.length} Restaurants
              </span>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-6">
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
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: '2px solid #FF9800' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#FF5722' }}></div>
            <p className="mt-3 text-muted">Loading restaurants...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th><i className="bi bi-person me-2"></i>Owner</th>
                  <th><i className="bi bi-image me-2"></i>Image</th>
                  <th><i className="bi bi-shop me-2"></i>Restaurant</th>
                  <th><i className="bi bi-envelope me-2"></i>Email</th>
                  <th><i className="bi bi-check-circle me-2"></i>Status</th>
                  <th><i className="bi bi-calendar me-2"></i>Joined</th>
                  <th><i className="bi bi-gear me-2"></i>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={client._id} style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                  }}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-3 d-flex align-items-center justify-content-center" style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                          borderRadius: '50%',
                          color: 'white',
                          fontSize: '1.2rem'
                        }}>
                          {(client.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold">{client.username || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="position-relative">
                        <img
                          src={`http://localhost:5001${client.restaurantImage}`}
                          alt={client.restaurantName}
                          className="rounded"
                          style={{
                            width: '60px',
                            height: '45px',
                            objectFit: 'cover',
                            border: '2px solid #FF5722',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => window.open(`http://localhost:5001${client.restaurantImage}`, '_blank')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(255, 87, 34, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shop-window me-2" style={{ color: '#FF5722' }}></i>
                        <span className="fw-semibold">{client.restaurantName || 'Unknown Restaurant'}</span>
                      </div>
                    </td>
                    <td className="text-muted">
                      <i className="bi bi-envelope me-2" style={{ color: '#FF9800' }}></i>
                      {client.email || 'No email'}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${
                        client.isVerified ? 'bg-success' : 'bg-warning'
                      }`}>
                        <i className={`bi ${client.isVerified ? 'bi-check-circle' : 'bi-clock'} me-1`}></i>
                        {client.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {client.createdAt ? (
                        <div>
                          <div>{new Date(client.createdAt).toLocaleDateString()}</div>
                          <small className="text-muted">{new Date(client.createdAt).toLocaleTimeString()}</small>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm position-relative overflow-hidden"
                          onClick={() => editClient(client)}
                          style={{
                            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '8px 12px',
                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px) scale(1.05)'
                            e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)'
                            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)'
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className="btn-delete btn-sm position-relative overflow-hidden"
                          onClick={() => deleteClient(client)}
                          title="Delete Restaurant"
                          style={{
                            animation: 'delete-pulse 2s ease-in-out infinite'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px) scale(1.05)';
                            e.target.style.animation = 'none';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.animation = 'delete-pulse 2s ease-in-out infinite';
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredClients.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <p className="text-muted">No restaurants found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {editingClient && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999
        }}>
          <div className="bg-white rounded-4 shadow-lg position-relative overflow-hidden" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="p-5 position-relative" style={{ zIndex: 2 }}>
              <div className="text-center mb-4">
                <div className="mb-3 d-flex align-items-center justify-content-center" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  borderRadius: '15px',
                  margin: '0 auto',
                  boxShadow: '0 8px 25px rgba(255, 87, 34, 0.3)'
                }}>
                  <i className="bi bi-shop-window text-white" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Edit Restaurant</h4>
                <p className="text-muted mb-0 small">Update restaurant information</p>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                    <i className="bi bi-person me-2"></i>Owner Username
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.username || ''}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    style={{ 
                      borderRadius: '15px',
                      border: '2px solid #FFE0B2',
                      padding: '12px 16px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter owner username"
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                    <i className="bi bi-shop me-2"></i>Restaurant Name
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.restaurantName || ''}
                    onChange={(e) => setEditForm({...editForm, restaurantName: e.target.value})}
                    style={{ 
                      borderRadius: '15px',
                      border: '2px solid #FFE0B2',
                      padding: '12px 16px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter restaurant name"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                  <i className="bi bi-envelope me-2"></i>Email
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={editForm.email || ''}
                  readOnly
                  style={{ 
                    borderRadius: '15px',
                    border: '2px solid #FFE0B2',
                    padding: '12px 16px',
                    fontSize: '16px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                  <i className="bi bi-shield-lock me-2"></i>New Password (optional)
                </label>
                <div className="input-group">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="form-control" 
                    value={editForm.password || ''}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    placeholder="Leave blank to keep current password"
                    style={{
                      borderRadius: '15px 0 0 15px',
                      border: '2px solid #FFE0B2',
                      borderRight: 'none',
                      padding: '12px 16px',
                      fontSize: '16px'
                    }}
                  />
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                      border: '2px solid #FFE0B2',
                      borderLeft: 'none',
                      borderRadius: '0 15px 15px 0',
                      color: 'white',
                      padding: '0 18px'
                    }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {passwordError && (
                  <div className="text-danger mt-2 small">{passwordError}</div>
                )}
                <small className="text-muted mt-1 d-block">
                  <i className="bi bi-info-circle me-1"></i>
                  Must contain: 8+ chars, uppercase, lowercase, number, special character
                </small>
              </div>
              
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-outline-secondary flex-fill"
                  onClick={() => setEditingClient(null)}
                  style={{ 
                    borderRadius: '15px',
                    border: '2px solid #6c757d',
                    fontWeight: 'bold',
                    padding: '12px 20px'
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button 
                  className="btn flex-fill"
                  onClick={saveClient}
                  style={{
                    background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: 'bold',
                    padding: '12px 20px',
                    boxShadow: '0 8px 25px rgba(255, 87, 34, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 12px 35px rgba(255, 87, 34, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.3)'
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Restaurant"
        message={`Are you sure you want to delete restaurant "${clientToDelete?.restaurantName}" owned by "${clientToDelete?.username}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  )
}

export default Clients