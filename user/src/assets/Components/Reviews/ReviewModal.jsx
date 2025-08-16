import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const ReviewModal = ({ show, onHide, order, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const productId = order.items[0]?.productId?._id || order.items[0]?.productId;
      const clientId = productId ? await getClientIdFromProduct(productId) : null;

      if (!clientId) {
        toast.addToast('Unable to submit review', 'error');
        return;
      }

      await axios.post('http://localhost:5001/reviews/create', {
        orderId: order._id,
        userId: user._id,
        clientId,
        rating,
        comment
      });

      toast.addToast('Review submitted successfully!', 'success');
      onReviewSubmitted();
      onHide();
      setRating(5);
      setComment('');
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getClientIdFromProduct = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:5001/products/getproduct/${productId}`);
      return res.data.clientId;
    } catch (err) {
      return null;
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '20px' }}>
          <div className="modal-header" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
            <h5 className="modal-title">
              <i className="bi bi-star"></i> Review Order
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: '#FF5722' }}>Rating</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn p-0"
                      onClick={() => setRating(star)}
                      style={{ fontSize: '2rem', color: star <= rating ? '#FFD700' : '#ddd' }}
                    >
                      <i className="bi bi-star-fill"></i>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: '#FF5722' }}>Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  required
                  maxLength="500"
                  style={{ borderRadius: '10px' }}
                />
                <small className="text-muted">{comment.length}/500 characters</small>
              </div>
              

            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn text-white" 
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
