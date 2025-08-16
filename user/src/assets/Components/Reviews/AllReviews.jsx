import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5001/reviews/all');
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bi bi-star${i < rating ? '-fill' : ''}`} style={{ color: i < rating ? '#FFD700' : '#ddd' }}></i>
    ));
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{ color: '#FF5722' }}>
          <i className="bi bi-chat-square-text"></i> All Reviews
        </h1>
        <p className="lead" style={{ color: '#666' }}>See what customers are saying</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}>No reviews yet</h3>
          <p className="text-muted">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review._id} className="col-lg-6">
              <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div className="card-header py-3" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">
                        <i className="bi bi-person-circle"></i> {review.userId.username}
                      </h6>
                      <small>{new Date(review.reviewDate).toLocaleDateString()}</small>
                    </div>
                    <div className="text-end">
                      <div>{renderStars(review.rating)}</div>
                      <small>{review.rating}/5</small>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <p className="text-muted mb-3">{review.comment}</p>
                  
                  {review.image && (
                    <div className="mb-3">
                      <img
                        src={`http://localhost:5001/uploads/${review.image}`}
                        alt="Review"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  
                  <div className="border-top pt-3">
                    <small className="text-muted">
                      Order #{review.orderId._id.slice(-6)} • 
                      <span className="text-success fw-bold"> PKR {review.orderId.totalAmount}</span>
                    </small>
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

export default AllReviews;
