import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HelpCenter.css';

const HelpCenter = () => {
  const [complaints, setComplaints] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: '',
    category: 'product_quality',
    orderId: '',
    initialMessage: ''
  });

  useEffect(() => {
    fetchComplaints();
    fetchOrders();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/complaints/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/complaints/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        subject: '',
        category: 'product_quality',
        orderId: '',
        initialMessage: ''
      });
      setShowCreateForm(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error creating complaint:', error);
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

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="admin-card p-5 mb-4 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
        color: 'white',
        animation: 'slideInUp 0.6s ease-out both'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'url("data:image/svg+xml,%3Csvg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M25 25m-8 0a8,8 0 1,1 16,0a8,8 0 1,1 -16,0"/%3E%3C/g%3E%3C/svg%3E")',
          animation: 'background-rotate 20s linear infinite',
          zIndex: 1
        }}></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-4">
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
              <i className="bi bi-headset position-relative" style={{ 
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
            }}>Help Center</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              opacity: '0.9',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.8s ease-out 0.4s both'
            }}>Get support and resolve your issues quickly</p>
          </div>
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
                <i className="bi bi-chat-dots-fill me-2" style={{ 
                  fontSize: '0.8rem',
                  animation: 'pulse 1.5s infinite',
                  color: '#2196F3'
                }}></i>
                <span className="fw-bold">24/7 Support</span>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}></div>
              </span>
              <div className="text-center">
                <div className="small opacity-75">Active Complaints</div>
                <div className="fw-bold" style={{
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'number-glow 2s ease-in-out infinite alternate'
                }}>{complaints.filter(c => c.status === 'open' || c.status === 'in_progress').length}</div>
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

      <div className="admin-card p-4 mb-4" style={{
        animation: 'slideInUp 0.8s ease-out 0.2s both'
      }}>
        <div className="text-center">
          <button 
            className="btn btn-lg position-relative overflow-hidden"
            onClick={() => setShowCreateForm(true)}
            style={{
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontWeight: 'bold',
              padding: '15px 40px',
              fontSize: '1.2rem',
              boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
            }}
          >
            <i className="bi bi-plus-circle-fill me-3" style={{
              fontSize: '1.3rem',
              animation: 'icon-bounce 2s ease-in-out infinite'
            }}></i>
            Create New Complaint
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 3s ease-in-out infinite'
            }}></div>
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="modal show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="modal-dialog modal-lg" style={{
            animation: 'slideInUp 0.4s ease-out'
          }}>
            <div className="modal-content border-0 position-relative overflow-hidden" style={{
              borderRadius: '25px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
                zIndex: 1
              }}></div>
              
              <div className="modal-header border-0 position-relative" style={{
                background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                color: 'white',
                borderRadius: '25px 25px 0 0',
                padding: '25px 30px',
                zIndex: 2
              }}>
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite'
                  }}>
                    <i className="bi bi-plus-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h4 className="modal-title mb-0 fw-bold" style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>Create New Complaint</h4>
                    <small style={{ opacity: '0.9' }}>We're here to help resolve your issue</small>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    fontSize: '1.2rem',
                    opacity: '0.8'
                  }}
                ></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 position-relative" style={{ zIndex: 2 }}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                        <i className="bi bi-chat-text me-2"></i>Subject
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                        style={{
                          borderRadius: '15px',
                          border: '2px solid rgba(255, 152, 0, 0.3)',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                        <i className="bi bi-tag me-2"></i>Category
                      </label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        style={{
                          borderRadius: '15px',
                          border: '2px solid rgba(255, 152, 0, 0.3)',
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="product_quality"><i className="bi bi-star"></i> Product Quality</option>
                        <option value="missing_item"><i className="bi bi-box"></i> Missing Item</option>
                        <option value="damaged_item"><i className="bi bi-exclamation-triangle"></i> Damaged Item</option>
                        <option value="delivery_issue"><i className="bi bi-truck"></i> Delivery Issue</option>
                        <option value="other"><i className="bi bi-question-circle"></i> Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                      <i className="bi bi-receipt me-2"></i>Related Order *
                    </label>
                    <select
                      className="form-select"
                      value={formData.orderId}
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                      required
                      style={{
                        borderRadius: '15px',
                        border: '2px solid rgba(255, 152, 0, 0.3)',
                        padding: '12px 16px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select an order</option>
                      {orders.map(order => (
                        <option key={order._id} value={order._id}>
                          Order #{order.orderNumber || order._id.slice(-6)} - {new Date(order.orderDate).toLocaleDateString()} - PKR {order.totalAmount}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                      <i className="bi bi-pencil-square me-2"></i>Description
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.initialMessage}
                      onChange={(e) => setFormData({...formData, initialMessage: e.target.value})}
                      required
                      style={{
                        borderRadius: '15px',
                        border: '2px solid rgba(255, 152, 0, 0.3)',
                        padding: '16px',
                        fontSize: '1rem',
                        resize: 'none'
                      }}
                      placeholder="Please describe your issue in detail..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="modal-footer border-0 p-4 position-relative" style={{ zIndex: 2 }}>
                  <div className="d-flex gap-3 w-100 justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-lg"
                      onClick={() => setShowCreateForm(false)}
                      style={{
                        background: 'rgba(108, 117, 125, 0.1)',
                        color: '#6c757d',
                        border: '2px solid rgba(108, 117, 125, 0.3)',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        padding: '12px 30px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#6c757d';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(108, 117, 125, 0.1)';
                        e.target.style.color = '#6c757d';
                      }}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-lg position-relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        padding: '12px 30px',
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(76, 175, 80, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.3)';
                      }}
                    >
                      <i className="bi bi-send-fill me-2"></i>Submit Complaint
                      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 3s ease-in-out infinite'
                      }}></div>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="admin-card p-5 text-center" style={{
          animation: 'slideInUp 1s ease-out 0.4s both'
        }}>
          <i className="bi bi-chat-square-heart display-1 text-muted mb-4" style={{
            animation: 'float 3s ease-in-out infinite'
          }}></i>
          <h3 style={{ color: '#FF9800' }}>No complaints yet</h3>
          <p className="text-muted">Create your first complaint to get help with any issues.</p>
        </div>
      ) : (
        <div className="row g-4">
          {complaints.map((complaint, index) => (
            <div key={complaint._id} className="col-lg-6" style={{
              animation: `slideInUp 0.6s ease-out ${0.4 + index * 0.1}s both`
            }}>
              <div className="card h-100 border-0 position-relative overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px',
                boxShadow: '0 8px 32px rgba(255, 87, 34, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                border: '1px solid rgba(255, 152, 0, 0.2)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 87, 34, 0.25)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 87, 34, 0.1)';
              }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(135deg, rgba(255,87,34,0.02) 0%, rgba(255,152,0,0.02) 100%)',
                  zIndex: 1
                }}></div>
                
                <div className="card-body p-4 position-relative" style={{ zIndex: 2 }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="mb-0" style={{ 
                      background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.3rem',
                      fontWeight: 'bold'
                    }}>{complaint.subject}</h5>
                    <span className={`badge px-3 py-2 rounded-pill ${getStatusBadge(complaint.status).replace('badge ', '')}`} style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {complaint.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge px-3 py-2 rounded-pill" style={{
                      background: 'rgba(255, 152, 0, 0.1)',
                      color: '#FF9800',
                      border: '1px solid rgba(255, 152, 0, 0.3)'
                    }}>
                      <i className="bi bi-tag me-1"></i>{getCategoryLabel(complaint.category)}
                    </span>
                    <span className="badge px-3 py-2 rounded-pill" style={{
                      background: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3',
                      border: '1px solid rgba(33, 150, 243, 0.3)'
                    }}>
                      <i className="bi bi-calendar me-1"></i>{new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span className="badge px-3 py-2 rounded-pill" style={{
                      background: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      border: '1px solid rgba(76, 175, 80, 0.3)'
                    }}>
                      <i className="bi bi-chat-dots me-1"></i>{complaint.messages.length} messages
                    </span>
                  </div>
                  
                  <p className="text-muted mb-4" style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                  }}>
                    "{complaint.messages[0]?.message.substring(0, 100)}..."
                  </p>
                  
                  <div className="text-center">
                    <button 
                      className="btn btn-lg"
                      onClick={() => navigate(`/help-center/chat/${complaint._id}`)}
                      style={{
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        padding: '12px 30px',
                        fontSize: '1rem',
                        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(33, 150, 243, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(33, 150, 243, 0.3)';
                      }}
                    >
                      <i className="bi bi-chat-fill me-2"></i>View Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
