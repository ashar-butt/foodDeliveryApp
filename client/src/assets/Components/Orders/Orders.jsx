import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5001/orders/client/${user._id}`);
      const ordersData = res.data;
      setOrders(ordersData);
      
      // Fetch reviews for delivered orders
      const deliveredOrders = ordersData.filter(order => order.status === 'delivered');
      const reviewPromises = deliveredOrders.map(async (order) => {
        try {
          const reviewRes = await axios.get(`http://localhost:5001/reviews/all`);
          const orderReview = reviewRes.data.find(review => review.orderId._id === order._id);
          return { orderId: order._id, review: orderReview };
        } catch (err) {
          return { orderId: order._id, review: null };
        }
      });
      
      const reviewResults = await Promise.all(reviewPromises);
      const reviewsMap = {};
      reviewResults.forEach(result => {
        if (result.review) {
          reviewsMap[result.orderId] = result.review;
        }
      });
      setReviews(reviewsMap);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bi bi-star${i < rating ? '-fill' : ''}`} style={{ color: i < rating ? '#FFD700' : '#ddd', fontSize: '14px' }}></i>
    ));
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
    switch (status) {
      case 'pending': return <i className="bi bi-clock"></i>;
      case 'confirmed': return <i className="bi bi-check-circle"></i>;
      case 'preparing': return <i className="bi bi-fire"></i>;
      case 'ready': return <i className="bi bi-check2-circle"></i>;
      case 'delivered': return <i className="bi bi-truck"></i>;
      case 'cancelled': return <i className="bi bi-x-circle"></i>;
      default: return <i className="bi bi-list-ul"></i>;
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading orders...</p>
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
          <p className="text-muted">No customer orders yet!</p>
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', color: 'white' }}>
                <tr>
                  <th className="border-0 py-3 px-4">Order ID</th>
                  <th className="border-0 py-3">Customer</th>
                  <th className="border-0 py-3">Items</th>
                  <th className="border-0 py-3">Total</th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3">Date</th>
                  <th className="border-0 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} style={{ 
                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(248, 249, 250, 0.8)',
                    transition: 'all 0.3s ease'
                  }}>
                    <td className="py-3 px-4">
                      <div>
                        <strong style={{ color: '#FF5722' }}>#{order._id.slice(-6)}</strong>
                        {reviews[order._id] && (
                          <div className="mt-1">
                            <small className="text-muted d-flex align-items-center">
                              <i className="bi bi-star-fill me-1" style={{ color: '#FFD700', fontSize: '12px' }}></i>
                              {reviews[order._id].rating}/5
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <strong>{order.customerName || 'N/A'}</strong>
                        <br />
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i>{order.phone}
                        </small>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="badge" style={{ 
                        backgroundColor: '#FF9800', 
                        color: 'white',
                        borderRadius: '12px',
                        padding: '6px 12px'
                      }}>
                        {order.items.length} items
                      </span>
                    </td>
                    <td className="py-3">
                      <strong className="text-success">PKR {order.totalAmount}</strong>
                    </td>
                    <td className="py-3">
                      <span 
                        className="badge px-3 py-2" 
                        style={{ 
                          backgroundColor: getStatusColor(order.status), 
                          color: 'white',
                          borderRadius: '15px',
                          fontSize: '12px'
                        }}
                      >
                        {getStatusIcon(order.status)} {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      <small className="text-muted">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => navigate(`/order-details/${order._id}`)}
                        className="btn btn-sm"
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
                        <i className="bi bi-eye" style={{
                          animation: 'eye-blink 3s ease-in-out infinite'
                        }}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Orders;
