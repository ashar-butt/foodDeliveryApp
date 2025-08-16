import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/products/cart', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);

        if (data.length > 0) {
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
      }
    } catch (err) {
      console.error('Failed to fetch cart');
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const product = productsMap[item.productId];
    if (product) {
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);
      return sum + (discountedPrice * item.quantity);
    }
    return sum;
  }, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!deliveryAddress || !city || !phone) {
      toast.addToast('Please fill all required fields', 'error');
      return;
    }
    if (phone.length !== 11) {
      toast.addToast('Phone number must be exactly 11 digits', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        userId: user._id,
        items: cartItems,
        deliveryAddress,
        city,
        phone,
        allergies,
        paymentMethod
      };

      const res = await axios.post('http://localhost:5001/orders/create', orderData);
      if (res.data.success) {
        // Clear cart after successful order
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5001/products/cart/clear', {
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        // Clear local cart state
        setCartItems([]);
        // Clear cart count in navbar with slight delay
        setTimeout(() => {
          window.dispatchEvent(new Event('cartUpdated'));
        }, 100);
        toast.addToast('Order placed successfully!', 'success');
        navigate('/order-confirmation', { state: { order: res.data.order }, replace: true });
      }
    } catch (err) {
      toast.addToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted"><i className="bi bi-cart"></i> Your cart is empty</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-3">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="admin-card border-0 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="text-center py-5 mb-4 position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                color: 'white',
                borderRadius: '20px 20px 0 0',
                boxShadow: '0 8px 40px rgba(255, 87, 34, 0.4)'
              }}>
                <div className="position-absolute" style={{
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'float 6s ease-in-out infinite'
                }}></div>
                <div className="d-flex justify-content-center mb-3 position-relative">
                  <div className="d-flex align-items-center justify-content-center" style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}>
                    <i className="bi bi-credit-card" style={{ fontSize: '3rem', animation: 'glow 2s ease-in-out infinite alternate' }}></i>
                  </div>
                </div>
                <h2 className="mb-2 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Secure Checkout</h2>
                <p className="mb-0" style={{ opacity: '0.9', fontSize: '1.1rem' }}>Complete your order details</p>
              </div>
              <div className="p-4">
              <form onSubmit={handleCheckout}>
                <div className="row">
                  <div className="col-md-8 mb-4">
                    <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                      <i className="bi bi-geo-alt me-2"></i>Delivery Address
                    </label>
                    <textarea
                      className="form-control"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      rows="3"
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #FF9800', 
                        padding: '15px 20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                      placeholder="House/Building, Street, Area"
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                      <i className="bi bi-building me-2"></i>City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #FF9800', 
                        padding: '15px 20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                      placeholder="Your city"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-telephone"></i> Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        setPhone(value);
                      }
                    }}
                    required
                    maxLength="11"
                    minLength="11"
                    style={{ borderRadius: '15px', border: '2px solid #FFE0B2', padding: '12px 20px' }}
                    placeholder="03xxxxxxxxx"
                  />
                  <small className="text-muted">Enter exactly 11 digits</small>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-exclamation-triangle"></i> Allergies/Special Instructions</label>
                  <textarea
                    className="form-control"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    rows="2"
                    style={{ borderRadius: '15px', border: '2px solid #FFE0B2', padding: '12px 20px' }}
                    placeholder="Any food allergies or special cooking instructions (optional)"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-credit-card"></i> Payment Method</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label fw-bold" htmlFor="cash" style={{ color: '#4CAF50', marginLeft: '8px' }}>
                        <i className="bi bi-cash"></i> Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-lg w-100 fw-bold position-relative overflow-hidden"
                  style={{
                    background: loading ? 'linear-gradient(45deg, #666, #999)' : 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #66BB6A 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '18px',
                    padding: '18px',
                    boxShadow: loading ? '0 4px 15px rgba(0,0,0,0.2)' : '0 10px 30px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-6px) scale(1.02)';
                      e.target.style.boxShadow = '0 20px 50px rgba(76, 175, 80, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #66BB6A 0%, #AED581 50%, #C8E6C9 100%)';
                      e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.target.style.background = 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #66BB6A 100%)';
                      e.target.style.filter = 'none';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px) scale(0.98)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-6px) scale(1.02)';
                    }
                  }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: loading ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' : 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    animation: loading ? 'shimmer 1.5s infinite' : 'none',
                    borderRadius: '25px'
                  }}></div>
                  <div className="position-relative d-flex align-items-center justify-content-center">
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" style={{ 
                          animation: 'spin 1s linear infinite',
                          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))'
                        }}></div>
                        <span style={{ animation: 'pulse-text 1.5s ease-in-out infinite' }}>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-rocket-takeoff me-2" style={{ 
                          animation: 'rocket-bounce 2s infinite',
                          filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
                        }}></i>
                        <span>Place Order</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="admin-card border-0 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="text-center py-3 mb-3" style={{
                background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                color: 'white',
                borderRadius: '20px 20px 0 0',
                boxShadow: '0 4px 20px rgba(255, 87, 34, 0.3)'
              }}>
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-list-ul me-2"></i>
                  Order Summary
                </h4>
              </div>
              <div className="p-3">
              {cartItems.map((item, index) => {
                const product = productsMap[item.productId];
                if (!product) return null;
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <h6 className="mb-0">{product.name}</h6>
                      <small className="text-muted d-block">{item.restaurantName || product.restaurantName}</small>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      {product.discount > 0 ? (
                        <>
                          <div><small className="text-decoration-line-through text-muted">PKR {product.price}</small></div>
                          <div className="text-success fw-bold">PKR {discountedPrice.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-success fw-bold">PKR {product.price}</div>
                      )}
                    </div>
                  </div>
                );
              })}
                <div className="mt-3 pt-3" style={{
                  borderTop: '2px solid rgba(255, 152, 0, 0.2)',
                  background: 'rgba(255, 87, 34, 0.1)',
                  borderRadius: '15px',
                  padding: '15px'
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold" style={{ color: '#FF5722' }}>Total:</h5>
                    <h4 className="mb-0 fw-bold" style={{ color: '#4CAF50' }}>PKR {totalAmount.toFixed(2)}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255,255,255,0.5); }
        }
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
          100% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rocket-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(-4px) rotate(-5deg); }
          60% { transform: translateY(-2px) rotate(3deg); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
