import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
    
    // Setup Socket.IO for real-time updates
    const socket = io('http://localhost:5001');
    
    socket.on('new-complaint', () => {
      fetchComplaints();
    });
    
    socket.on('status-updated', () => {
      fetchComplaints();
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5001/complaints/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, status, priority = null) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5001/complaints/${complaintId}/status`,
        { status, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge bg-warning',
      in_progress: 'badge bg-info',
      resolved: 'badge bg-success',
      closed: 'badge bg-secondary'
    };
    return badges[status] || 'badge bg-secondary';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge bg-success',
      medium: 'badge bg-warning',
      high: 'badge bg-danger'
    };
    return badges[priority] || 'badge bg-secondary';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      product_quality: 'Product Quality',
      missing_item: 'Missing Item',
      damaged_item: 'Damaged Item',
      delivery_issue: 'Delivery Issue',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header Section */}
      <div className="admin-card p-5 mb-5 position-relative overflow-hidden" style={{
        animation: 'slideInUp 0.6s ease-out both'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'linear-gradient(135deg, rgba(220,53,69,0.05) 0%, rgba(255,87,34,0.05) 100%)',
          zIndex: 1
        }}></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="mb-3">
                <i className="bi bi-headset display-4" style={{ 
                  color: '#dc3545',
                  animation: 'icon-bounce 2s ease-in-out infinite'
                }}></i>
              </div>
              <h1 className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(45deg, #dc3545, #FF5722)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '3rem'
              }}>Customer Support Center</h1>
              <p className="lead text-muted mb-0">Manage and resolve customer complaints with real-time chat</p>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <div className="d-flex gap-2">
                {[
                  { value: 'all', label: 'All', icon: 'bi-list-ul', color: '#6c757d' },
                  { value: 'open', label: 'Open', icon: 'bi-exclamation-circle', color: '#ffc107' },
                  { value: 'in_progress', label: 'Progress', icon: 'bi-clock', color: '#0dcaf0' },
                  { value: 'resolved', label: 'Resolved', icon: 'bi-check-circle', color: '#198754' },
                  { value: 'closed', label: 'Closed', icon: 'bi-x-circle', color: '#6c757d' }
                ].map((item, index) => (
                  <button
                    key={item.value}
                    className={`btn position-relative overflow-hidden ${filter === item.value ? 'active' : ''}`}
                    onClick={() => setFilter(item.value)}
                    style={{
                      background: filter === item.value 
                        ? `linear-gradient(45deg, ${item.color}, ${item.color}dd)` 
                        : 'rgba(255,255,255,0.1)',
                      color: filter === item.value ? 'white' : item.color,
                      border: `2px solid ${item.color}`,
                      borderRadius: '25px',
                      padding: '8px 16px',
                      transition: 'all 0.3s ease',
                      animation: `slideInUp 0.6s ease-out ${0.1 + index * 0.1}s both`,
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      if (filter !== item.value) {
                        e.target.style.background = `linear-gradient(45deg, ${item.color}22, ${item.color}11)`;
                        e.target.style.transform = 'translateY(-2px) scale(1.05)';
                        e.target.style.boxShadow = `0 4px 15px ${item.color}33`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filter !== item.value) {
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <i className={`${item.icon} me-2`} style={{
                      animation: filter === item.value ? 'icon-bounce 2s ease-in-out infinite' : 'none'
                    }}></i>
                    {item.label}
                    {filter === item.value && (
                      <span className="position-absolute top-0 start-0 w-100 h-100" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s ease-in-out infinite'
                      }}></span>
                    )}
                  </button>
                ))}
              </div>
              <span className="badge bg-success px-3 py-2 rounded-pill" style={{
                animation: 'pulse 2s infinite'
              }}>
                <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }}></i>
                Live Updates
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="admin-card" style={{
            animation: 'slideInUp 0.8s ease-out 0.2s both'
          }}>
            <div className="card-body p-0">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No complaints found</h4>
                  <p>No complaints match the current filter.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Customer</th>
                        <th>Order ID</th>
                        <th>Restaurant</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Messages</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint, index) => (
                        <tr key={complaint._id} style={{
                          animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                          transition: 'all 0.3s ease'
                        }} onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fff3e0';
                          e.currentTarget.style.transform = 'scale(1.01)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 87, 34, 0.1)';
                        }} onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <td>
                            <strong>{complaint.subject}</strong>
                            <br />
                            <small className="text-muted">
                              {complaint.messages[0]?.message.substring(0, 50)}...
                            </small>
                          </td>
                          <td>
                            <div>
                              <strong>{complaint.userId?.username || complaint.userId?.name}</strong>
                              <br />
                              <small className="text-muted">{complaint.userId?.email}</small>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {complaint.orderId ? 
                                `#${complaint.orderId.orderNumber || complaint.orderId._id?.slice(-6)}` : 
                                'N/A'
                              }
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {complaint.orderId?.items?.[0]?.restaurantName || 
                               (complaint.orderId ? 'Restaurant Info Missing' : 'N/A')}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {getCategoryLabel(complaint.category)}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`form-select form-select-sm ${getPriorityBadge(complaint.priority)}`}
                              value={complaint.priority}
                              onChange={(e) => updateStatus(complaint._id, complaint.status, e.target.value)}
                              style={{ padding: '0.375rem 0.75rem' }}
                            >
                              <option value="low" style={{ padding: '0.5rem' }}>Low</option>
                              <option value="medium" style={{ padding: '0.5rem' }}>Medium</option>
                              <option value="high" style={{ padding: '0.5rem' }}>High</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className={`form-select form-select-sm ${getStatusBadge(complaint.status)}`}
                              value={complaint.status}
                              onChange={(e) => updateStatus(complaint._id, e.target.value, complaint.priority)}
                              style={{ padding: '0.375rem 0.75rem' }}
                            >
                              <option value="open" style={{ padding: '0.5rem' }}>Open</option>
                              <option value="in_progress" style={{ padding: '0.5rem' }}>In Progress</option>
                              <option value="resolved" style={{ padding: '0.5rem' }}>Resolved</option>
                              <option value="closed" style={{ padding: '0.5rem' }}>Closed</option>
                            </select>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {complaint.messages.length}
                            </span>
                          </td>
                          <td>
                            <small>
                              {new Date(complaint.createdAt).toLocaleDateString()}
                              <br />
                              {new Date(complaint.createdAt).toLocaleTimeString()}
                            </small>
                          </td>
                          <td>
                            <button 
                              className="btn"
                              onClick={() => navigate(`/complaints/chat/${complaint._id}`)}
                              title="View Chat"
                              style={{
                                background: 'linear-gradient(45deg, #0c141bff, #21CBF3)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px) scale(1.1)';
                                e.target.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
                              }}
                            >
                              <i className="bi bi-eye-fill" style={{
                                fontSize: '1.2rem',
                                animation: 'eye-blink 3s ease-in-out infinite'
                              }}></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        {[
          { status: 'open', label: 'Open', color: '#ffc107', icon: 'bi-exclamation-circle-fill' },
          { status: 'in_progress', label: 'In Progress', color: '#0dcaf0', icon: 'bi-clock-fill' },
          { status: 'resolved', label: 'Resolved', color: '#198754', icon: 'bi-check-circle-fill' },
          { status: 'closed', label: 'Closed', color: '#6c757d', icon: 'bi-x-circle-fill' }
        ].map((item, index) => (
          <div key={item.status} className="col-md-3" style={{
            animation: `slideInUp 0.6s ease-out ${0.4 + index * 0.1}s both`
          }}>
            <div className="stats-card text-center p-4 h-100 position-relative overflow-hidden" style={{
              background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
              animation: 'stats-float 3s ease-in-out infinite',
              animationDelay: `${index * 0.2}s`
            }}>
              <div className="position-absolute top-0 end-0 opacity-25" style={{
                animation: 'background-rotate 8s linear infinite'
              }}>
                <i className={item.icon} style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.3)' }}></i>
              </div>
              <div className="position-relative" style={{ zIndex: 2 }}>
                <div className="mb-3">
                  <i className={item.icon} style={{ 
                    fontSize: '3rem',
                    color: 'white',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    animation: 'icon-bounce 2s ease-in-out infinite'
                  }}></i>
                </div>
                <h5 className="mb-2 fw-semibold text-white">{item.label}</h5>
                <h2 className="fw-bold mb-0 text-white" style={{
                  fontSize: '2.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  animation: 'number-glow 2s ease-in-out infinite alternate'
                }}>
                  {complaints.filter(c => c.status === item.status).length}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;