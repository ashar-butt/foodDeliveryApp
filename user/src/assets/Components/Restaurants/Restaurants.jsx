import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(restaurant => {
      const name = (restaurant.restaurantName || '').toLowerCase();
      const owner = (restaurant.username || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || owner.includes(search);
    });
    setFilteredRestaurants(filtered);
  }, [searchTerm, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5001/Clientauth/restaurants');
      if (res.data.success) {
        const restaurantList = res.data.restaurants;
        setRestaurants(restaurantList);
        setFilteredRestaurants(restaurantList);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}/products`);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="admin-card p-4">
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#FF5722' }}></div>
            <p className="mt-3 text-muted">Loading restaurants...</p>
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
              <i className="bi bi-building position-relative" style={{ 
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
            }}>Available Restaurants</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              opacity: '0.9',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.8s ease-out 0.4s both'
            }}>Choose your favorite restaurant and explore their menu</p>
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
                <i className="bi bi-circle-fill me-2" style={{ 
                  fontSize: '0.6rem',
                  animation: 'pulse 1.5s infinite',
                  color: '#4CAF50'
                }}></i>
                <span className="fw-bold">Live Updates</span>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}></div>
              </span>
              <div className="text-center">
                <div className="small opacity-75">Total Restaurants</div>
                <div className="fw-bold" style={{
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'number-glow 2s ease-in-out infinite alternate'
                }}>{restaurants.length}</div>
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

      <div className="admin-card p-4 mb-4">
        <div className="row justify-content-center mb-4" style={{
          animation: 'slideInUp 0.8s ease-out 0.2s both'
        }}>
          <div className="col-md-6">
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
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: '2px solid #FF9800' }}
              />
            </div>
          </div>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="admin-card p-4">
          <div className="text-center py-5">
            <i className="bi bi-search display-4 text-muted mb-3"></i>
            <h3 style={{ color: '#FF9800' }}>{searchTerm ? 'No restaurants match your search' : 'No restaurants available'}</h3>
            <p className="text-muted">{searchTerm ? 'Try a different search term' : 'Check back later for new restaurants!'}</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="col-lg-4 col-md-6">
              <div 
                className="card h-100 border-0 position-relative overflow-hidden" 
                style={{ 
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '25px',
                  boxShadow: '0 8px 32px rgba(255, 87, 34, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  animation: `slideInUp 0.6s ease-out ${filteredRestaurants.indexOf(restaurant) * 0.1}s both`,
                  border: '1px solid rgba(255, 152, 0, 0.2)'
                }}
                onClick={() => handleRestaurantClick(restaurant._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 87, 34, 0.25)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 87, 34, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(135deg, rgba(255,87,34,0.02) 0%, rgba(255,152,0,0.02) 100%)',
                  zIndex: 1
                }}></div>
                <div className="position-relative overflow-hidden" style={{ borderRadius: '25px 25px 0 0', zIndex: 2 }}>
                  {restaurant.restaurantImage ? (
                    <img
                      src={`http://localhost:5001${restaurant.restaurantImage}`}
                      alt={restaurant.restaurantName}
                      className="card-img-top"
                      style={{
                        height: '220px',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div 
                      className="card-img-top d-flex align-items-center justify-content-center"
                      style={{
                        height: '220px',
                        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-utensils" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
                    </div>
                  )}
                  
                  <div className="position-absolute top-3 start-3">
                    <span className="badge px-3 py-2 rounded-pill" style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#FF5722',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <i className="bi bi-star-fill me-1" style={{ color: '#FFD700' }}></i>
                      Restaurant
                    </span>
                  </div>
                </div>

                <div className="card-body p-4 position-relative" style={{ zIndex: 2 }}>
                  <h5 className="card-title text-center mb-3" style={{ 
                    background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}>
                    {restaurant.restaurantName}
                  </h5>
                  <div className="text-center mb-4">
                    <span className="badge px-3 py-2 rounded-pill" style={{
                      background: 'rgba(255, 152, 0, 0.1)',
                      color: '#FF9800',
                      fontSize: '0.9rem',
                      border: '1px solid rgba(255, 152, 0, 0.3)'
                    }}>
                      <i className="bi bi-person-circle me-1"></i>
                      Owner: {restaurant.username}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <button
                      className="btn btn-lg"
                      style={{
                        background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        padding: '12px 35px',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 20px rgba(255, 87, 34, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(255, 87, 34, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(255, 87, 34, 0.3)';
                      }}
                    >
                      <i className="bi bi-utensils me-2"></i>View Menu
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

export default Restaurants;
