import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/offers', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOffers(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch offers');
      }
    } catch (err) {
      setError('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" style={{ borderRadius: '15px' }}>
          <h4>❌ Error</h4>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <span style={{ fontSize: '1.2em', marginRight: '15px' }}>🎉</span>
          <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Special Offers</span>
        </h1>
        <p className="lead" style={{ color: '#666' }}>Manage your restaurant's promotional offers</p>
      </div>

      <div className="text-center mb-4">
        <button 
          className="btn btn-lg px-4 py-3"
          onClick={() => navigate('/addoffer')}
          style={{
            background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
        >
          ➕ Add New Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="text-center">
          <div className="card shadow border-0 mx-auto" style={{ maxWidth: '400px', borderRadius: '20px' }}>
            <div className="card-body py-5">
              <div style={{ fontSize: '64px', opacity: '0.5', marginBottom: '20px' }}>🎁</div>
              <h3 className="text-muted mb-3">No offers yet</h3>
              <p className="text-muted">Create your first promotional offer to attract customers!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer._id} className="col-lg-4 col-md-6">
              <div className="offer-card card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="offer-badge">{offer.discount}% OFF</div>
                  <h5 className="offer-title">{offer.title}</h5>
                  <p className="offer-description flex-grow-1">{offer.description}</p>
                  <div className="offer-validity">
                    <small className="text-muted">Valid until: {new Date(offer.validUntil).toLocaleDateString()}</small>
                  </div>
                  <div className="offer-actions mt-3">
                    <button 
                      className="btn btn-edit flex-fill me-2"
                      onClick={() => navigate(`/editoffer/${offer._id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-delete flex-fill"
                      onClick={() => {/* Add delete functionality */}}
                    >
                      🗑️ Delete
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

export default Offers;
