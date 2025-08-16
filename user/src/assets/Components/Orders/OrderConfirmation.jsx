import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    const handlePopState = () => {
      navigate('/restaurants', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted">No order information found</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-3">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="admin-card border-0 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(139,195,74,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="text-center py-5 mb-4 position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                color: 'white',
                borderRadius: '20px 20px 0 0',
                boxShadow: '0 8px 40px rgba(76, 175, 80, 0.4)'
              }}>
                <div className="position-absolute" style={{
                  top: '-30px',
                  left: '-30px',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'celebrate 4s ease-in-out infinite'
                }}></div>
                <div className="position-absolute" style={{
                  bottom: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'celebrate 6s ease-in-out infinite reverse'
                }}></div>
                <div className="d-flex justify-content-center mb-3 position-relative">
                  <div className="d-flex align-items-center justify-content-center" style={{
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    backdropFilter: 'blur(15px)',
                    border: '3px solid rgba(255, 255, 255, 0.4)',
                    animation: 'success-pulse 2s ease-in-out infinite'
                  }}>
                    <i className="bi bi-check-circle" style={{ 
                      fontSize: '4rem', 
                      animation: 'check-bounce 1s ease-out',
                      filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                    }}></i>
                  </div>
                </div>
                <h2 className="mb-2 fw-bold" style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  animation: 'fade-in-up 0.8s ease-out 0.5s both'
                }}>Order Confirmed!</h2>
                <p className="mb-0" style={{ 
                  opacity: '0.9', 
                  fontSize: '1.1rem',
                  animation: 'fade-in-up 0.8s ease-out 0.7s both'
                }}>Thank you for your order</p>
              </div>
            
              <div className="p-4">
                <div className="text-center mb-4 p-4" style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '20px',
                  border: '2px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <h4 className="fw-bold" style={{ color: '#4CAF50' }}>Your order has been placed successfully!</h4>
                  <div className="mt-3 p-3" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <p className="mb-0 text-muted">Order ID: <strong style={{ color: '#FF5722' }}>{order._id}</strong></p>
                  </div>
                </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-geo-alt"></i> Delivery Address:</h6>
                  <p className="text-muted">{order.deliveryAddress}</p>
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-building"></i> City:</h6>
                  <p className="text-muted">{order.city}</p>
                </div>
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-telephone"></i> Phone:</h6>
                  <p className="text-muted">{order.phone}</p>
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-credit-card"></i> Payment:</h6>
                  <p className="text-muted">{order.paymentMethod === 'cash' ? <><i className="bi bi-cash"></i> Cash on Delivery</> : order.paymentMethod || 'Cash on Delivery'}</p>
                  {order.allergies && (
                    <>
                      <h6 style={{ color: '#FF5722' }}><i className="bi bi-exclamation-triangle"></i> Special Instructions:</h6>
                      <p className="text-muted">{order.allergies}</p>
                    </>
                  )}
                </div>
              </div>
              
              <h6 style={{ color: '#FF5722' }}><i className="bi bi-list-ul"></i> Order Items:</h6>
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      {item.restaurantName && (
                        <small className="text-muted d-block">{item.restaurantName}</small>
                      )}
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      {item.discount > 0 ? (
                        <>
                          <div><small className="text-decoration-line-through text-muted">PKR {item.price}</small></div>
                          <div className="text-success fw-bold">PKR {item.finalPrice.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-success fw-bold">PKR {item.price}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-4 p-3" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                <h5 className="mb-0">Total Amount:</h5>
                <h4 className="mb-0 text-success">PKR {order.totalAmount}</h4>
              </div>
              
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/recent-orders')}
                    className="btn btn-lg me-3 fw-bold position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      boxShadow: '0 10px 30px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(255, 87, 34, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #FF7043 0%, #FFB74D 50%, #FFCC02 100%)';
                      e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.target.style.background = 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)';
                      e.target.style.filter = 'none';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                    onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                  >
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      borderRadius: '25px'
                    }}></div>
                    <div className="position-relative d-flex align-items-center justify-content-center">
                      <i className="bi bi-list-ul me-2" style={{ 
                        animation: 'list-wiggle 3s ease-in-out infinite',
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
                      }}></i>
                      <span>View Orders</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate('/products')}
                    className="btn btn-lg fw-bold position-relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #AED581 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '15px 35px',
                      boxShadow: '0 10px 30px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(76, 175, 80, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.target.style.background = 'linear-gradient(135deg, #66BB6A 0%, #AED581 50%, #DCEDC8 100%)';
                      e.target.style.filter = 'brightness(1.1) saturate(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.target.style.background = 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #AED581 100%)';
                      e.target.style.filter = 'none';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                    onMouseUp={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
                  >
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      borderRadius: '25px'
                    }}></div>
                    <div className="position-relative d-flex align-items-center justify-content-center">
                      <i className="bi bi-cart me-2" style={{ 
                        animation: 'cart-shake 2.5s ease-in-out infinite',
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))'
                      }}></i>
                      <span>Continue Shopping</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes celebrate {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-15px) rotate(5deg) scale(1.1); }
          75% { transform: translateY(-10px) rotate(-3deg) scale(0.95); }
        }
        @keyframes success-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255,255,255,0.3); }
          50% { transform: scale(1.08); box-shadow: 0 0 50px rgba(255,255,255,0.6); }
        }
        @keyframes check-bounce {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-90deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes list-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        @keyframes cart-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
