import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { imageService } from '../../../services/imageService';

const RestaurantReviews = ({ clientId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    if (clientId) fetchReviews();
  }, [clientId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/reviews/client/${clientId}`);
      const reviewsData = res.data;
      console.log('Reviews data:', reviewsData); // Debug log
      
      // Fetch product details for each review
      const reviewsWithProducts = await Promise.all(
        reviewsData.map(async (review) => {
          if (review.orderId.items && review.orderId.items[0]) {
            try {
              const productId = review.orderId.items[0].productId?._id || review.orderId.items[0].productId;
              if (productId) {
                const productRes = await axios.get(`http://localhost:5001/products/getproduct/${productId}`);
                return {
                  ...review,
                  productImage: productRes.data.image,
                  productName: productRes.data.name
                };
              }
            } catch (err) {
              return review;
            }
          }
          return review;
        })
      );
      
      setReviews(reviewsWithProducts);
      calculateStats(reviewsWithProducts);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const calculateStats = (reviewsData) => {
    if (reviewsData.length === 0) return;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    setStats({ 
      average: (sum / reviewsData.length).toFixed(1), 
      total: reviewsData.length 
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bi bi-star${i < rating ? '-fill' : ''}`} style={{ color: i < rating ? '#FFD700' : '#ddd' }}></i>
    ));
  };

  if (reviews.length === 0) return null;

  return (
    <div className="mt-5">
      <div className="d-flex align-items-center mb-4">
        <h4 style={{ color: '#FF5722' }}>
          <i className="bi bi-star"></i> Reviews ({stats.total})
        </h4>
        <div className="ms-3">
          {renderStars(Math.round(stats.average))}
          <span className="ms-2 text-muted">{stats.average}/5</span>
        </div>
      </div>
      
      <div className="row g-4">
        {reviews.map((review) => (
          <div key={review._id} className="col-md-6">
            <div className="card border-0 position-relative overflow-hidden" style={{ 
              borderRadius: '25px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
              boxShadow: '0 8px 32px rgba(255, 87, 34, 0.1)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 87, 34, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 87, 34, 0.1)';
            }}>
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,87,34,0.02) 0%, rgba(255,152,0,0.02) 100%)',
                zIndex: 1
              }}></div>
              <div className="card-body p-4 position-relative" style={{ zIndex: 2 }}>
                <div className="d-flex align-items-start mb-3">
                  <div className="me-3">
                    {review.productImage ? (
                      <img 
                        src={imageService.getImageUrl(review.productImage)}
                        alt={review.productName || 'Product'}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                  
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-0">{review.userId.username}</h6>
                        <small className="text-muted">{new Date(review.reviewDate).toLocaleDateString()}</small>
                        {review.orderId?.items && review.orderId.items.length > 0 && (
                          <div className="mt-1">
                            <small className="badge bg-light text-dark px-2 py-1 rounded-pill">
                              <i className="bi bi-utensils me-1"></i>
                              {review.orderId.items[0].name} {review.orderId.items.length > 1 && `+${review.orderId.items.length - 1} more`}
                            </small>
                          </div>
                        )}
                      </div>
                      <div>{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-muted mb-2">{review.comment}</p>
                    {review.image && (
                      <div className="mt-2">
                        <img
                          src={imageService.getImageUrl(`/uploads/${review.image}`)}
                          alt="Review"
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px', width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => window.open(imageService.getImageUrl(`/uploads/${review.image}`), '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;
