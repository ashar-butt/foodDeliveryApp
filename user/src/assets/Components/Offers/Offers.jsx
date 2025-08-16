import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';
import CartSidebar from '../Cart/CartSidebar';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartState, setCartState] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  const fetchDiscountedProducts = async () => {
    try {
      const [productsRes, restaurantsRes] = await Promise.all([
        axios.get('http://localhost:5001/products'),
        axios.get('http://localhost:5001/Clientauth/restaurants')
      ]);

      const discountedProducts = productsRes.data.filter(product => product.discount > 0);
      const restaurants = restaurantsRes.data.restaurants || [];

      const productsWithRestaurants = discountedProducts.map(product => {
        const restaurant = restaurants.find(r => r._id === product.clientId);
        return {
          ...product,
          restaurantName: restaurant?.restaurantName || 'Unknown Restaurant'
        };
      });

      setProducts(productsWithRestaurants);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.addToast('Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/products/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        toast.addToast('Added to cart!', 'success');
        setCartOpen(true);
      } else {
        toast.addToast('Failed to add to cart', 'error');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.addToast('Failed to add to cart', 'error');
    }
  };

  const getImageUrl = (path) => {
    return path ? `http://localhost:5001${path}` : '/placeholder.png';
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price * (1 - discount / 100)).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading amazing offers...</p>
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
          <i className="bi bi-percent position-absolute" style={{
            fontSize: '60px',
            top: '20%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0s'
          }}></i>
          <i className="bi bi-tag position-absolute" style={{
            fontSize: '50px',
            top: '60%',
            right: '15%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s'
          }}></i>
          <i className="bi bi-gift position-absolute" style={{
            fontSize: '45px',
            top: '30%',
            right: '25%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '4s'
          }}></i>
          <i className="bi bi-lightning position-absolute" style={{
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
            <i className="bi bi-fire" style={{
              fontSize: '4rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}></i>
          </div>
          <h1 className="display-3 fw-bold mb-3" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}>
            Hot Deals & Offers
          </h1>
          <p className="lead mb-0" style={{
            fontSize: '1.3rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out 0.4s both'
          }}>
            Save big on your favorite dishes!
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

      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}><i className="bi bi-bullseye"></i> No offers available right now</h3>
          <p className="text-muted">Check back later for amazing deals!</p>
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-4 mt-3">
          {products.map((product) => {
            const validId = product._id;
            return (
              <div
                key={validId}
                className="admin-card border-0 position-relative overflow-hidden"
                style={{
                  width: '20rem',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(255, 87, 34, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 87, 34, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 87, 34, 0.1)';
                }}
              >
                <div className="position-relative">
                  {product.image && (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        height: '180px',
                        width: '100%',
                        objectFit: 'cover',
                        borderTopLeftRadius: '1rem',
                        borderTopRightRadius: '1rem',
                      }}
                    />
                  )}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge" style={{
                      background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                      fontSize: '14px',
                      padding: '8px 12px',
                      borderRadius: '20px'
                    }}>

                    </span>
                  </div>
                </div>

                <div className="p-4 d-flex flex-column justify-content-between" style={{ minHeight: '200px' }}>
                  <div><h5 className="fw-bold mb-2 text-center" style={{ color: '#FF5722', fontSize: '1.3rem' }}>{product.name}</h5>
                    <div className="text-center mb-3">
                      {product.discount && product.discount > 0 ? (
                        <div>
                          <span className="h4 fw-bold" style={{ color: '#FF5722' }}>
                            PKR {(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="badge ms-2 px-2 py-1" style={{
                            background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                            fontSize: '0.8rem'
                          }}>
                            {product.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="h4 fw-bold" style={{ color: '#FF5722' }}>
                          PKR {product.price}
                        </span>
                      )}
                    </div>

                    <p className="text-muted small mb-2 d-flex align-items-center">
                      <i className="bi bi-shop me-1" style={{ color: '#FF9800' }}></i>
                      {product.restaurantName}
                    </p>
                    <p className="text-secondary mb-3" style={{ minHeight: '48px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {product.description}
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '8px 15px',
                      borderRadius: '25px',
                      width: 'fit-content',
                      margin: '0 auto',
                      border: '2px solid rgba(255, 152, 0, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <button
                        onClick={() => {
                          setCartState(prev => {
                            const currentQty = prev[validId]?.quantity || 0;
                            const newQty = Math.max(0, currentQty - 1);
                            return { ...prev, [validId]: { quantity: newQty } };
                          });
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '2px solid #FF5722',
                          background: 'white',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#FF5722',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#FF5722';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#FF5722';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        minWidth: '30px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#333'
                      }}>
                        {cartState[validId]?.quantity || 0}
                      </span>
                      <button
                        onClick={() => {
                          setCartState(prev => {
                            const currentQty = prev[validId]?.quantity || 0;
                            return { ...prev, [validId]: { quantity: currentQty + 1 } };
                          });
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '2px solid #FF5722',
                          background: 'white',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#FF5722',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#FF5722';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#FF5722';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cool-btn cool-btn-primary cool-btn-md w-100"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const quantity = cartState[validId]?.quantity || 0;

                          if (quantity === 0) {
                            alert('Please select quantity first');
                            return;
                          }

                          for (let i = 0; i < quantity; i++) {
                            const response = await fetch('http://localhost:5001/products/cart/add', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token ? `Bearer ${token}` : '',
                              },
                              body: JSON.stringify({ productId: validId }),
                            });

                            if (!response.ok) {
                              const errorData = await response.json();
                              if (response.status === 400 && errorData.message.includes('restaurant')) {
                                setCartOpen(true);
                              } else {
                                alert(errorData.message || 'Failed to add to cart');
                              }
                              return;
                            }
                          }

                          setCartState(prev => {
                            const newState = { ...prev };
                            delete newState[validId];
                            return newState;
                          });
                          window.dispatchEvent(new Event('cartUpdated'));
                          setCartOpen(true);
                        } catch (error) {
                          console.error('Error adding to cart:', error);
                          alert('Network error. Please try again.');
                        }
                      }}
                    >
                      <i className="bi bi-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setCartState({});
        }}
      />
      </div>
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Offers;
