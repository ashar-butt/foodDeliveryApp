import { useState, useEffect } from 'react'
import axios from 'axios'
import ConfirmModal from './ConfirmModal'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  const [showConfirm, setShowConfirm] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)

  useEffect(() => {
    fetchReviews()
    const interval = setInterval(fetchReviews, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchReviews = () => {
    axios.get('http://localhost:5001/admin/reviews')
      .then(res => {
        setReviews(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const deleteReview = (review) => {
    setReviewToDelete(review)
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    axios.delete(`http://localhost:5001/admin/reviews/${reviewToDelete._id}`)
      .then(() => {
        fetchReviews()
        setShowConfirm(false)
        setReviewToDelete(null)
      })
      .catch(err => console.error(err))
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.userId?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.clientId?.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating
    return matchesSearch && matchesRating
  })

  const averageRating = reviews.length > 0 ? 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0

  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {})

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        {Array.from({length: 5}, (_, i) => (
          <i key={i} className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`} 
             style={{ color: i < rating ? '#FFD700' : '#ddd', fontSize: '1.1rem' }}></i>
        ))}
        <span className="ms-2 fw-bold" style={{ color: '#FF5722' }}>({rating}/5)</span>
      </div>
    )
  }

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
                <i className="bi bi-star-fill text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h2 className="mb-0 fw-bold" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Reviews Management</h2>
                <p className="text-muted mb-0 small">Monitor customer feedback and ratings</p>
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
                {reviews.length} Reviews
              </span>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4">
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
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: '2px solid #FF9800' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{ border: '2px solid #FF9800' }}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="col-md-5">
              <div className="d-flex align-items-center justify-content-end">
                <div className="text-center me-4">
                  <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#FF5722' }}>
                    {averageRating}
                  </div>
                  <small className="text-muted">Avg Rating</small>
                </div>
                <div className="d-flex align-items-center">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-2 mb-4">
            {[5,4,3,2,1].map(rating => (
              <div key={rating} className="col">
                <div className="p-2 rounded-3 text-center" style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #FF9800'
                }}>
                  <div className="d-flex align-items-center justify-content-center mb-1">
                    <span className="fw-bold me-1">{rating}</span>
                    <i className="bi bi-star-fill" style={{ color: '#FFD700', fontSize: '0.9rem' }}></i>
                  </div>
                  <div className="fw-bold" style={{ color: '#FF5722' }}>{ratingCounts[rating] || 0}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#FF5722' }}></div>
            <p className="mt-3 text-muted">Loading reviews...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th><i className="bi bi-person me-2"></i>Customer</th>
                  <th><i className="bi bi-shop me-2"></i>Restaurant</th>
                  <th><i className="bi bi-star me-2"></i>Rating</th>
                  <th><i className="bi bi-chat-text me-2"></i>Review</th>
                  <th><i className="bi bi-calendar me-2"></i>Date</th>
                  <th><i className="bi bi-gear me-2"></i>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review, index) => (
                  <tr key={review._id} style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.05}s both`
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
                          {(review.userId?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold">{review.userId?.username}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shop-window me-2" style={{ color: '#FF5722' }}></i>
                        <span>{review.clientId?.restaurantName}</span>
                      </div>
                    </td>
                    <td>
                      {renderStars(review.rating)}
                    </td>
                    <td>
                      <div style={{ maxWidth: '250px' }}>
                        <p className="mb-1 text-muted small">{review.comment}</p>
                        {review.image && (
                          <img 
                            src={`http://localhost:5001/uploads/${review.image}`}
                            alt="Review"
                            className="rounded"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="text-muted small">
                      {review.reviewDate ? (
                        <div>
                          <div>{new Date(review.reviewDate).toLocaleDateString()}</div>
                          <small className="text-muted">{new Date(review.reviewDate).toLocaleTimeString()}</small>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <button 
                        className="btn-delete btn-sm"
                        onClick={() => deleteReview(review)}
                        title="Delete Review"
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReviews.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <p className="text-muted">No reviews found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message={`Are you sure you want to delete this ${reviewToDelete?.rating}-star review by "${reviewToDelete?.userId?.username}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  )
}

export default Reviews