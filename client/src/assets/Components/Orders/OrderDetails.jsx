import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/orders/details/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      toast.addToast('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      await axios.put(`http://localhost:5001/orders/update/${orderId}`, { status });
      setOrder({ ...order, status });
      toast.addToast(`Order ${status} successfully!`, 'success');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.addToast('Failed to update order status', 'error');
    }
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

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted">Order not found</h3>
        <button onClick={() => navigate('/orders')} className="btn btn-primary mt-3">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="admin-card border-0 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="text-center py-5 mb-4 position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                color: 'white',
                borderRadius: '20px 20px 0 0',
                boxShadow: '0 8px 40px rgba(255, 87, 34, 0.4)'
              }}>
                <div className="position-absolute" style={{
                  top: '-30px',
                  left: '-30px',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'celebrate 4s ease-in-out infinite'
                }}></div>
                <div className="position-absolute" style={{
                  bottom: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'celebrate 6s ease-in-out infinite reverse'
                }}></div>
                <div className="d-flex justify-content-center mb-3 position-relative">
                  <div className="d-flex align-items-center justify-content-center" style={{
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    backdropFilter: 'blur(15px)',
                    border: '3px solid rgba(255, 255, 255, 0.4)',
                    animation: 'success-pulse 2s ease-in-out infinite'
                  }}>
                    <i className="bi bi-cup-straw" style={{ 
                      fontSize: '4rem', 
                      animation: 'check-bounce 1s ease-out',
                      filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                    }}></i>
                  </div>
                </div>
                <h2 className="mb-2 fw-bold" style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  animation: 'fade-in-up 0.8s ease-out 0.5s both'
                }}>Order Details</h2>
                <p className="mb-0" style={{ 
                  opacity: '0.9', 
                  fontSize: '1.1rem',
                  animation: 'fade-in-up 0.8s ease-out 0.7s both'
                }}>Order #{order._id.slice(-6)}</p>
              </div>
            
              <div className="p-4">
                <div className="text-center mb-4 p-4" style={{
                  background: `rgba(${getStatusColor(order.status).replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.1)`,
                  borderRadius: '20px',
                  border: `2px solid rgba(${getStatusColor(order.status).replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`
                }}>
                  <h4 className="fw-bold" style={{ color: getStatusColor(order.status) }}>Order Status: {order.status.toUpperCase()}</h4>
                  <div className="mt-3 p-3" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <p className="mb-0 text-muted">Order Date: <strong style={{ color: '#FF5722' }}>{new Date(order.orderDate).toLocaleDateString()}</strong></p>
                  </div>
                </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-person"></i> Customer Information:</h6>
                  <p className="text-muted"><strong>Name:</strong> {order.customerName || 'N/A'}</p>
                  <p className="text-muted"><strong>Phone:</strong> {order.phone}</p>
                </div>
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-geo-alt"></i> Delivery Address:</h6>
                  <p className="text-muted">{order.deliveryAddress}</p>
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-building"></i> City:</h6>
                  <p className="text-muted">{order.city || 'N/A'}</p>
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-credit-card"></i> Payment:</h6>
                  <p className="text-muted">{order.paymentMethod === 'cash' ? <><i className="bi bi-cash"></i> Cash on Delivery</> : order.paymentMethod || 'Cash on Delivery'}</p>
                  {order.allergies && (
                    <>
                      <h6 style={{ color: '#FF5722' }}><i className="bi bi-exclamation-triangle"></i> Special Instructions:</h6>
                      <p className="text-muted">{order.allergies}</p>
                    </>
                  )}
                </div>
              </div>
              
              <h6 style={{ color: '#FF5722' }}><i className="bi bi-list-ul"></i> Order Items:</h6>
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      {item.discount > 0 ? (
                        <>
                          <div><small className="text-decoration-line-through text-muted">PKR {item.price}</small></div>
                          <div className="text-success fw-bold">PKR {item.finalPrice.toFixed(2)} each</div>
                          <div><small className="text-danger">{item.discount}% OFF</small></div>
                        </>
                      ) : (
                        <div className="text-success fw-bold">PKR {item.price} each</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-4 p-3" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                <h5 className="mb-0">Total Amount:</h5>
                <h4 className="mb-0 text-success">PKR {order.totalAmount}</h4>
              </div>
              
                <div className="text-center">
                {order.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus('confirmed')}
                      className="btn btn-lg me-3 fw-bold position-relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #AED581 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 35px',
                        boxShadow: '0 10px 30px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        animation: 'pulse 2s infinite, glow-green 2s ease-in-out infinite alternate'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px) scale(1.05)';
                        e.target.style.boxShadow = '0 20px 50px rgba(76, 175, 80, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                        e.target.style.background = 'linear-gradient(135deg, #66BB6A 0%, #AED581 50%, #DCEDC8 100%)';
                        e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                        e.target.style.animation = 'none';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                        e.target.style.background = 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #AED581 100%)';
                        e.target.style.filter = 'none';
                        e.target.style.animation = 'pulse 2s infinite, glow-green 2s ease-in-out infinite alternate';
                      }}
                      onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                      onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                    >
                      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        borderRadius: '25px'
                      }}></div>
                      <div className="position-relative d-flex align-items-center justify-content-center">
                        <i className="bi bi-check-circle me-2" style={{ 
                          filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
                        }}></i>
                        <span>Accept Order</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => updateOrderStatus('cancelled')}
                      className="btn btn-lg me-3 fw-bold position-relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #f44336 0%, #e53935 50%, #ef5350 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 35px',
                        boxShadow: '0 10px 30px rgba(244, 67, 54, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        animation: 'pulse 2s infinite, glow-red 2s ease-in-out infinite alternate'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px) scale(1.05)';
                        e.target.style.boxShadow = '0 20px 50px rgba(244, 67, 54, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                        e.target.style.background = 'linear-gradient(135deg, #e57373 0%, #ef5350 50%, #ffcdd2 100%)';
                        e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                        e.target.style.animation = 'none';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 10px 30px rgba(244, 67, 54, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                        e.target.style.background = 'linear-gradient(135deg, #f44336 0%, #e53935 50%, #ef5350 100%)';
                        e.target.style.filter = 'none';
                        e.target.style.animation = 'pulse 2s infinite, glow-red 2s ease-in-out infinite alternate';
                      }}
                      onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                      onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                    >
                      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        borderRadius: '25px'
                      }}></div>
                      <div className="position-relative d-flex align-items-center justify-content-center">
                        <i className="bi bi-x-circle me-2" style={{ 
                          filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
                        }}></i>
                        <span>Decline Order</span>
                      </div>
                    </button>
                  </>
                )}
                
                {order.status === 'confirmed' && (
                  <button 
                    onClick={() => updateOrderStatus('preparing')}
                    className="btn btn-lg me-3 fw-bold position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      boxShadow: '0 10px 30px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      animation: 'fire-glow 2s ease-in-out infinite alternate'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(255, 87, 34, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #FF7043 0%, #FFB74D 50%, #FFCC02 100%)';
                      e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.target.style.background = 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)';
                      e.target.style.filter = 'none';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                    onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                  >
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      borderRadius: '25px'
                    }}></div>
                    <div className="position-relative d-flex align-items-center justify-content-center">
                      <i className="bi bi-fire me-2" style={{ 
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))',
                        animation: 'fire-flicker 1.5s ease-in-out infinite'
                      }}></i>
                      <span>Start Preparing</span>
                    </div>
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button 
                    onClick={() => updateOrderStatus('ready')}
                    className="btn btn-lg me-3 fw-bold position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 50%, #F48FB1 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      boxShadow: '0 10px 30px rgba(156, 39, 176, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      animation: 'ready-pulse 2.5s ease-in-out infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(156, 39, 176, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #BA68C8 0%, #F48FB1 50%, #FCE4EC 100%)';
                      e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(156, 39, 176, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.target.style.background = 'linear-gradient(135deg, #9C27B0 0%, #E91E63 50%, #F48FB1 100%)';
                      e.target.style.filter = 'none';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                    onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                  >
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      borderRadius: '25px'
                    }}></div>
                    <div className="position-relative d-flex align-items-center justify-content-center">
                      <i className="bi bi-check2-circle me-2" style={{ 
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))',
                        animation: 'ready-spin 3s linear infinite'
                      }}></i>
                      <span>Mark as Ready</span>
                    </div>
                  </button>
                )}
                
                {order.status === 'ready' && (
                  <button 
                    onClick={() => updateOrderStatus('delivered')}
                    className="btn btn-lg me-3 fw-bold position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 50%, #81D4FA 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      boxShadow: '0 10px 30px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      animation: 'delivery-bounce 2s ease-in-out infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(33, 150, 243, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #64B5F6 0%, #81D4FA 50%, #E1F5FE 100%)';
                      e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.target.style.background = 'linear-gradient(135deg, #2196F3 0%, #03A9F4 50%, #81D4FA 100%)';
                      e.target.style.filter = 'none';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                    onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                  >
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      borderRadius: '25px'
                    }}></div>
                    <div className="position-relative d-flex align-items-center justify-content-center">
                      <i className="bi bi-truck me-2" style={{ 
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))',
                        animation: 'truck-move 2s ease-in-out infinite'
                      }}></i>
                      <span>Mark as Delivered</span>
                    </div>
                  </button>
                )}
                
                <button 
                  onClick={() => navigate('/orders')}
                  className="btn btn-lg fw-bold position-relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #666 0%, #999 50%, #bbb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '15px 35px',
                    boxShadow: '0 10px 30px rgba(102, 102, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px) scale(1.05)';
                    e.target.style.boxShadow = '0 20px 50px rgba(102, 102, 102, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                    e.target.style.background = 'linear-gradient(135deg, #777 0%, #aaa 50%, #ddd 100%)';
                    e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 10px 30px rgba(102, 102, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                    e.target.style.background = 'linear-gradient(135deg, #666 0%, #999 50%, #bbb 100%)';
                    e.target.style.filter = 'none';
                  }}
                  onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                  onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    borderRadius: '25px'
                  }}></div>
                  <div className="position-relative d-flex align-items-center justify-content-center">
                    <i className="bi bi-arrow-left me-2" style={{ 
                      filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
                    }}></i>
                    <span>Back to Orders</span>
                  </div>
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes celebrate {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-15px) rotate(5deg) scale(1.1); }
          75% { transform: translateY(-10px) rotate(-3deg) scale(0.95); }
        }
        @keyframes success-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255,255,255,0.3); }
          50% { transform: scale(1.08); box-shadow: 0 0 50px rgba(255,255,255,0.6); }
        }
        @keyframes check-bounce {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-90deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fire-glow {
          0% { box-shadow: 0 10px 30px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
          100% { box-shadow: 0 10px 30px rgba(255, 87, 34, 0.7), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(255, 87, 34, 0.5); }
        }
        @keyframes fire-flicker {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-2deg); }
          75% { transform: scale(0.95) rotate(2deg); }
        }
        @keyframes ready-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(156, 39, 176, 0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { transform: scale(1.02); box-shadow: 0 15px 40px rgba(156, 39, 176, 0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 25px rgba(156, 39, 176, 0.4); }
        }
        @keyframes ready-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes delivery-bounce {
          0%, 100% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(33, 150, 243, 0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 25px rgba(33, 150, 243, 0.4); }
        }
        @keyframes truck-move {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;
