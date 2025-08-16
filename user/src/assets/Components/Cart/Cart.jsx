import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [productsMap, setProductsMap] = useState({});
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/products/cart', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to fetch cart');
        setCartItems([]);
        return;
      }
      const data = await res.json();
      setCartItems(data);

      // Fetch product details for each productId in cart
      const productIds = data.map(item => item.productId);
      if (productIds.length > 0) {
        const [productsRes, restaurantsRes] = await Promise.all([
          fetch('http://localhost:5001/products', {
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
          }),
          fetch('http://localhost:5001/Clientauth/restaurants')
        ]);
        
        if (productsRes.ok && restaurantsRes.ok) {
          const productsData = await productsRes.json();
          const restaurantsData = await restaurantsRes.json();
          const restaurants = restaurantsData.restaurants || [];
          
          const map = {};
          productsData.forEach(p => {
            const restaurant = restaurants.find(r => r._id === p.clientId);
            map[p._id] = {
              ...p,
              restaurantName: restaurant?.restaurantName || 'Unknown Restaurant'
            };
          });
          setProductsMap(map);
        }
      }
    } catch (err) {
      setError('Failed to fetch cart');
      setCartItems([]);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/products/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        fetchCart(); // Refresh cart
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Error removing item from cart');
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/products/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ productId, action }),
      });
      if (res.ok) {
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Error updating quantity');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (error) {
    return <div className="container my-5"><div className="alert alert-danger text-center">{error}</div></div>;
  }

  if (cartItems.length === 0) {
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
            <div className="text-center">
              <div className="mb-4 position-relative">
                <div className="position-absolute" style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '150px',
                  height: '150px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  animation: 'pulse 3s infinite'
                }}></div>
                <i className="bi bi-cart-x position-relative" style={{ 
                  fontSize: '5rem',
                  color: 'white',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  animation: 'icon-bounce 2s ease-in-out infinite'
                }}></i>
              </div>
              <h1 className="fw-bold mb-3" style={{ 
                fontSize: '3rem',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                animation: 'fadeInDown 0.8s ease-out 0.2s both'
              }}>Your Cart is Empty</h1>
              <p className="lead mb-4" style={{ 
                fontSize: '1.2rem',
                opacity: '0.9',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                animation: 'fadeInDown 0.8s ease-out 0.4s both'
              }}>Looks like you haven't added any delicious items yet!</p>
              <button 
                onClick={() => navigate('/restaurants')}
                className="btn btn-lg px-5 py-3" 
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  animation: 'fadeInUp 0.8s ease-out 0.6s both'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <i className="bi bi-shop me-2"></i>Browse Restaurants
              </button>
            </div>
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
              <i className="bi bi-cart-fill position-relative" style={{ 
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
            }}>Your Cart</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              opacity: '0.9',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.8s ease-out 0.4s both'
            }}>Review your delicious selections</p>
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
                <i className="bi bi-bag-heart-fill me-2" style={{ 
                  fontSize: '0.8rem',
                  animation: 'pulse 1.5s infinite',
                  color: '#E91E63'
                }}></i>
                <span className="fw-bold">Ready to Order</span>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}></div>
              </span>
              <div className="text-center">
                <div className="small opacity-75">Items in Cart</div>
                <div className="fw-bold" style={{
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'number-glow 2s ease-in-out infinite alternate'
                }}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
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

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="admin-card border-0 position-relative overflow-hidden" style={{
            animation: 'slideInUp 0.8s ease-out 0.2s both'
          }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="p-0">
                {cartItems.map((item, index) => {
                  const product = productsMap[item.productId];
                  return (
                    <div key={index} className="p-4 mb-3 mx-3" style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 152, 0, 0.2)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 87, 34, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                    }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        {product ? (
                          <>
                            <img
                              src={product.image ? `http://localhost:5001${product.image}` : ''}
                              alt={product.name}
                              className="rounded shadow-sm"
                              style={{ 
                                width: '90px', 
                                height: '90px', 
                                objectFit: 'cover', 
                                marginRight: '20px',
                                borderRadius: '15px',
                                border: '3px solid rgba(255, 152, 0, 0.3)',
                                transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                            <div>
                              <h5 className="mb-2 fw-bold" style={{ color: '#FF5722' }}>{product.name}</h5>
                              <small className="text-muted d-block mb-2 d-flex align-items-center">
                                <i className="bi bi-shop me-1" style={{ color: '#FF9800' }}></i>
                                {product.restaurantName}
                              </small>
                              <div className="d-flex align-items-center gap-3 mb-1">
                                <span className="text-muted">Quantity:</span>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  padding: '8px 15px',
                                  borderRadius: '25px',
                                  width: 'fit-content',
                                  border: '2px solid rgba(255, 152, 0, 0.2)',
                                  backdropFilter: 'blur(10px)'
                                }}>
                                  <button 
                                    onClick={() => updateQuantity(item.productId, 'decrement')}
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
                                  }}>{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.productId, 'increment')}
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
                              </div>
                              {product.discount > 0 ? (
                                <div>
                                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>PKR {product.price}</span>
                                  <span className="text-success fw-bold ms-2">PKR {(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                                  <span className="badge bg-danger ms-2">{product.discount}% OFF</span>
                                </div>
                              ) : (
                                <p className="mb-0 text-success fw-bold">PKR {product.price}</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-muted">
                            Product ID: {item.productId} - Quantity: {item.quantity}
                          </div>
                        )}
                      </div>
                      <button 
                        className="btn btn-sm"
                        onClick={() => removeFromCart(item.productId)}
                        style={{ 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#c82333';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#dc3545';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
              <div className="text-center py-4 mx-3 mb-3" style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '20px',
                border: '2px solid rgba(255, 152, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-muted mb-0">Total Items: <span className="text-dark">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></h5>
                </div>
                <div className="col-md-6">
                  <h4 className="mb-0 fw-bold" style={{ color: '#FF5722' }}>
                    Total: PKR {cartItems.reduce((sum, item) => {
                      const product = productsMap[item.productId];
                      if (product) {
                        const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
                        return sum + (discountedPrice * item.quantity);
                      }
                      return sum;
                    }, 0).toFixed(2)}
                  </h4>
                </div>
              </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="cool-btn cool-btn-primary cool-btn-lg w-100 mt-3"
                >
                  <i className="bi bi-credit-card me-2"></i>Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
