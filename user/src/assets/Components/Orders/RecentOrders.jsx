import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';
import ReviewModal from '../Reviews/ReviewModal';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewedOrders, setReviewedOrders] = useState(new Set());
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
    checkReviewedOrders();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5001/orders/user/${user._id}`);
      const newOrders = res.data;
      
      // Check for status changes and show notifications
      if (orders.length > 0) {
        newOrders.forEach(newOrder => {
          const oldOrder = orders.find(o => o._id === newOrder._id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            const statusMessages = {
              confirmed: 'Your order has been confirmed!',
              preparing: 'Your order is being prepared!',
              ready: 'Your order is ready! Delivery in 15 minutes.',
              delivered: 'Your order has been delivered!',
              cancelled: 'Your order has been cancelled.'
            };
            toast.addToast(statusMessages[newOrder.status] || 'Order status updated', 'info');
          }
        });
      }
      
      setOrders(newOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (loading) toast.addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkReviewedOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5001/reviews/user/${user._id}`);
      const reviewedOrderIds = new Set(res.data.map(review => review.orderId._id));
      setReviewedOrders(reviewedOrderIds);
    } catch (err) {
      console.error('Error checking reviewed orders:', err);
    }
  };

  const handleReviewClick = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    checkReviewedOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF5722';
      case 'ready': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    const iconStyle = {
      animation: getIconAnimation(status),
      transformOrigin: 'center'
    };
    
    switch (status) {
      case 'pending': return <i className="bi bi-clock" style={iconStyle}></i>;
      case 'confirmed': return <i className="bi bi-check-circle" style={iconStyle}></i>;
      case 'preparing': return <i className="bi bi-fire" style={iconStyle}></i>;
      case 'ready': return <i className="bi bi-check2-circle" style={iconStyle}></i>;
      case 'delivered': return <i className="bi bi-truck" style={iconStyle}></i>;
      case 'cancelled': return <i className="bi bi-x-circle" style={iconStyle}></i>;
      default: return <i className="bi bi-list-ul" style={iconStyle}></i>;
    }
  };

  const getIconAnimation = (status) => {
    switch (status) {
      case 'pending': return 'pendingPulse 2s ease-in-out infinite';
      case 'confirmed': return 'confirmedBounce 1s ease-in-out';
      case 'preparing': return 'preparingFlame 1.5s ease-in-out infinite';
      case 'ready': return 'readyGlow 2s ease-in-out infinite alternate';
      case 'delivered': return 'deliveredMove 3s ease-in-out infinite';
      case 'cancelled': return 'cancelledShake 0.5s ease-in-out';
      default: return 'none';
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Animated Header */}
      <div className="position-relative overflow-hidden mb-5" style={{
        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Floating Background Icons */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <i className="bi bi-clock position-absolute" style={{
            fontSize: '60px',
            top: '20%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0s'
          }}></i>
          <i className="bi bi-truck position-absolute" style={{
            fontSize: '50px',
            top: '60%',
            right: '15%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s'
          }}></i>
          <i className="bi bi-check-circle position-absolute" style={{
            fontSize: '45px',
            top: '30%',
            right: '25%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '4s'
          }}></i>
          <i className="bi bi-fire position-absolute" style={{
            fontSize: '55px',
            bottom: '20%',
            left: '20%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1s'
          }}></i>
        </div>
        
        {/* Main Content */}
        <div className="text-center text-white position-relative z-index-1">
          <div className="mb-3" style={{
            animation: 'fadeInUp 1s ease-out'
          }}>
            <i className="bi bi-list-check" style={{
              fontSize: '4rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}></i>
          </div>
          <h1 className="display-3 fw-bold mb-3" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}>
            Recent Orders
          </h1>
          <p className="lead mb-0" style={{
            fontSize: '1.3rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out 0.4s both'
          }}>
            Track your order history
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="position-absolute" style={{
          top: '10px',
          right: '20px',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'pulse 3s ease-in-out infinite'
        }}></div>
        <div className="position-absolute" style={{
          bottom: '15px',
          left: '30px',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'pulse 3s ease-in-out infinite 1.5s'
        }}></div>
      </div>
      
      <div className="container">

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}><i className="bi bi-box"></i> No orders found</h3>
          <p className="text-muted">You haven't placed any orders yet!</p>
        </div>
      ) : (
        <div className="admin-card border-0">
          <div className="list-group list-group-flush">
            {orders.map((order, index) => (
              <div key={order._id} className="list-group-item border-0 p-4" style={{
                background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                borderRadius: index === 0 ? '20px 20px 0 0' : index === orders.length - 1 ? '0 0 20px 20px' : '0'
              }}>
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: `linear-gradient(135deg, ${getStatusColor(order.status)}, ${getStatusColor(order.status)}88)`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ color: '#FF5722' }}>#{order._id.slice(-6)}</h6>
                        <small className="text-muted">{new Date(order.orderDate).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <h6 className="mb-1" style={{ color: '#333' }}>Items ({order.items.length})</h6>
                    <div style={{ maxHeight: '60px', overflowY: 'auto' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="small text-muted">
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="col-md-2">
                    <h6 className="mb-1" style={{ color: '#333' }}>Total</h6>
                    <h5 className="mb-0 text-success fw-bold">PKR {order.totalAmount}</h5>
                  </div>
                  
                  <div className="col-md-2">
                    <h6 className="mb-1" style={{ color: '#333' }}>Status</h6>
                    <span className="badge px-3 py-2" style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <div className="text-end me-3">
                        <small className="text-muted d-block">Delivery to:</small>
                        <small className="text-truncate d-block" style={{ maxWidth: '150px' }}>
                          {order.deliveryAddress}
                        </small>
                      </div>
                      {order.status === 'delivered' && (
                        <div>
                          {reviewedOrders.has(order._id) ? (
                            <button className="btn btn-outline-success btn-sm" disabled>
                              <i className="bi bi-check-circle"></i> Reviewed
                            </button>
                          ) : (
                            <button 
                              className="btn btn-warning btn-sm position-relative overflow-hidden"
                              onClick={() => handleReviewClick(order)}
                              style={{
                                background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 50%, #FF6F00 100%)',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                animation: 'star-glow 2s ease-in-out infinite alternate'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                                e.target.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.5)';
                                e.target.style.background = 'linear-gradient(135deg, #FFD54F 0%, #FFB74D 50%, #FF8F00 100%)';
                                e.target.style.animation = 'none';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.3)';
                                e.target.style.background = 'linear-gradient(135deg, #FFC107 0%, #FF9800 50%, #FF6F00 100%)';
                                e.target.style.animation = 'star-glow 2s ease-in-out infinite alternate';
                              }}
                            >
                              <i className="bi bi-star me-1" style={{
                                animation: 'star-twinkle 1.5s ease-in-out infinite'
                              }}></i> Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <ReviewModal 
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        order={selectedOrder}
        onReviewSubmitted={handleReviewSubmitted}
      />
      
      </div>
      
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pendingPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        @keyframes confirmedBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        @keyframes preparingFlame {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
        
        @keyframes readyGlow {
          0% { transform: scale(1); filter: brightness(1); }
          100% { transform: scale(1.1); filter: brightness(1.3); }
        }
        
        @keyframes deliveredMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes cancelledShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes star-glow {
          0% { box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3); }
          100% { box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5); }
        }
        
        @keyframes star-twinkle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default RecentOrders;
