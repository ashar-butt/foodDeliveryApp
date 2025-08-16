import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5001/reviews/user/${user._id}`);
      setReviews(res.data);
    } catch (err) {
      toast.addToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi bi-star${i < rating ? '-fill' : ''}`}
        style={{ color: i < rating ? '#FFD700' : '#ddd' }}
      ></i>
    ));
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading your reviews...</p>
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
              <i className="bi bi-star-fill position-relative" style={{ 
                fontSize: '4rem',
                color: 'white',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                animation: 'star-twinkle 2s ease-in-out infinite'
              }}></i>
            </div>
            <h1 className="fw-bold mb-3" style={{ 
              fontSize: '3.5rem',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              animation: 'fadeInDown 0.8s ease-out 0.2s both'
            }}>My Reviews</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              opacity: '0.9',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.8s ease-out 0.4s both'
            }}>Your feedback journey and dining experiences</p>
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
                <i className="bi bi-heart-fill me-2" style={{ 
                  fontSize: '0.8rem',
                  animation: 'pulse 1.5s infinite',
                  color: '#E91E63'
                }}></i>
                <span className="fw-bold">Your Reviews</span>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}></div>
              </span>
              <div className="text-center">
                <div className="small opacity-75">Total Reviews</div>
                <div className="fw-bold" style={{
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'number-glow 2s ease-in-out infinite alternate'
                }}>{reviews.length}</div>
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

      {reviews.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <i className="bi bi-chat-square-heart display-1 text-muted mb-4" style={{
            animation: 'float 3s ease-in-out infinite'
          }}></i>
          <h3 style={{ color: '#FF9800' }}>No reviews yet</h3>
          <p className="text-muted">Start reviewing your orders to share your experiences!</p>
        </div>
      ) : (
        <div className="admin-card p-0 border-0">
          <div className="list-group list-group-flush">
            {reviews.map((review, index) => (
              <div key={review._id} className="list-group-item border-0 p-4 position-relative overflow-hidden" style={{
                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 152, 0, 0.02)',
                borderRadius: index === 0 ? '25px 25px 0 0' : index === reviews.length - 1 ? '0 0 25px 25px' : '0',
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff3e0';
                e.currentTarget.style.transform = 'scale(1.01)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 87, 34, 0.1)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 152, 0, 0.02)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ animation: 'star-glow 2s ease-in-out infinite alternate' }}>
                        {renderStars(review.rating)}
                      </div>
                      <span className="badge px-2 py-1 rounded-pill" style={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA000)',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}>
                        {review.rating}/5
                      </span>
                    </div>
                    <small className="text-muted">{new Date(review.reviewDate).toLocaleDateString()}</small>
                  </div>
                  
                  <div className="col-md-2">
                    <h6 className="mb-1" style={{ 
                      background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1rem'
                    }}>#{review.orderId?._id?.slice(-6) || 'N/A'}</h6>
                    <span className="badge bg-success px-2 py-1 rounded-pill" style={{ fontSize: '0.8rem' }}>
                      PKR {review.orderId?.totalAmount || 0}
                    </span>
                  </div>
                  
                  <div className="col-md-3">
                    <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                      {review.orderId.items && review.orderId.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center mb-1">
                          <i className="bi bi-utensils me-2" style={{ color: '#FF5722', fontSize: '0.8rem' }}></i>
                          <div>
                            <small className="fw-bold text-dark">{item.name}</small>
                            <small className="text-muted"> x{item.quantity}</small>
                          </div>
                        </div>
                      ))}
                      {review.orderId.items && review.orderId.items.length > 2 && (
                        <small className="text-muted">+{review.orderId.items.length - 2} more items</small>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <p className="mb-0 text-dark" style={{
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      maxHeight: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      "{review.comment}"
                    </p>
                  </div>
                  
                  <div className="col-md-2">
                    {review.image && (
                      <img
                        src={`http://localhost:5001/uploads/${review.image}`}
                        alt="Review"
                        className="img-fluid rounded"
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          border: '2px solid #FF9800',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(`http://localhost:5001/uploads/${review.image}`, '_blank')}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
