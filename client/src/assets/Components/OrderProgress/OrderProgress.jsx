import React, { useState, useEffect } from 'react';

const OrderProgress = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const TARGET_ORDERS = 35;
  const progressPercentage = Math.min((orderCount / TARGET_ORDERS) * 100, 100);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const res = await fetch(`http://localhost:5001/orders/client/${user._id}/count`);
        if (res.ok) {
          const data = await res.json();
          setOrderCount(data.count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch order count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderCount();
  }, []);

  if (loading) return null;

  return (
    <div className="container mt-3 mb-4">
      <div className="admin-card border-0 position-relative overflow-hidden" style={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
        animation: 'stats-float 4s ease-in-out infinite',
        boxShadow: '0 15px 35px rgba(255, 87, 34, 0.3), 0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'background-rotate 10s linear infinite'
        }}></div>
        <div className="card-body p-4 text-white position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="mb-2 fw-bold" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animation: 'fade-in-up 0.8s ease-out'
              }}>
                <i className="bi bi-bar-chart" style={{ 
                  fontSize: '1.2em', 
                  marginRight: '10px',
                  animation: 'icon-bounce 2s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                }}></i>
                Restaurant Performance
              </h5>
              <p className="mb-3" style={{ 
                opacity: '0.95',
                animation: 'fade-in-up 0.8s ease-out 0.2s both',
                fontSize: '1.1rem'
              }}>
                <span style={{ animation: 'number-glow 2s ease-in-out infinite alternate' }}>
                  {orderCount}
                </span> / {TARGET_ORDERS} orders received this month
              </p>
              <div className="progress position-relative" style={{ 
                height: '16px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(255,255,255,0.2)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div 
                  className="progress-bar position-relative overflow-hidden" 
                  style={{ 
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A, #CDDC39)',
                    borderRadius: '12px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                    animation: 'progress-glow 2s ease-in-out infinite alternate'
                  }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    animation: 'progress-shine 2s ease-in-out infinite'
                  }}></div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="position-relative d-inline-block">
                <div className="position-absolute top-50 start-50 translate-middle" style={{
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'icon-pulse 3s ease-in-out infinite'
                }}></div>
                <div style={{ 
                  fontSize: '4rem',
                  position: 'relative',
                  zIndex: 2,
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
                  animation: orderCount >= 35 ? 'trophy-bounce 2s ease-in-out infinite' : 
                            orderCount >= 30 ? 'star-twinkle 2s ease-in-out infinite' : 
                            orderCount >= 20 ? 'thumbs-wiggle 2s ease-in-out infinite' : 
                            'rocket-launch 2s ease-in-out infinite'
                }}>
                  {orderCount >= 35 ? <i className="bi bi-trophy"></i> : 
                   orderCount >= 30 ? <i className="bi bi-star-fill"></i> : 
                   orderCount >= 20 ? <i className="bi bi-hand-thumbs-up-fill"></i> : 
                   <i className="bi bi-rocket-takeoff"></i>}
                </div>
              </div>
              <p className="mb-0 mt-2 fw-semibold" style={{ 
                opacity: '0.95',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                animation: 'fade-in-up 0.8s ease-out 0.4s both',
                fontSize: '1.1rem'
              }}>
                {orderCount >= 35 ? 'Outstanding Performance!' : 
                 orderCount >= 30 ? 'Excellent!' : 
                 orderCount >= 20 ? 'Great Job!' : 
                 'Keep Growing!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;
