import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchOrderCount = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const res = await fetch(`http://localhost:5001/orders/client/${userData._id}`);
        if (res.ok) {
          const orders = await res.json();
          const upcomingOrders = orders.filter(order => 
            order.status === 'pending' || 
            order.status === 'confirmed' || 
            order.status === 'preparing' || 
            order.status === 'ready'
          );
          setOrderCount(upcomingOrders.length || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch order count:', err);
      setOrderCount(0);
    }
  };

  const refreshUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const userData = JSON.parse(storedUser);
        const res = await fetch(`http://localhost:5001/client/profile/${userData._id}`);
        if (res.ok) {
          const updatedUser = await res.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } else {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  };

  const fetchUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    fetchUser();
    window.addEventListener("userLogin", fetchUser);
    window.addEventListener("userLogout", fetchUser);
    window.addEventListener("storage", fetchUser);
    window.addEventListener("adminUpdate", refreshUserData);
    window.addEventListener('scroll', handleScroll);
    
    fetchOrderCount();
    const interval = setInterval(fetchOrderCount, 10000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("userLogin", fetchUser);
      window.removeEventListener("userLogout", fetchUser);
      window.removeEventListener("storage", fetchUser);
      window.removeEventListener("adminUpdate", refreshUserData);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("userLogout"));
    setUser(null);
    window.location.href = "/login";
  };

  const navItems = [
    { path: '/products', icon: 'bi-basket-fill', label: 'Products' },
    { path: '/addproduct', icon: 'bi-plus-circle', label: 'Add Product' },
    { path: '/orders', icon: 'bi-list-ul', label: 'Orders', badge: orderCount },
    { path: '/reviews', icon: 'bi-star-fill', label: 'Reviews' },
    { path: '/profile', icon: 'bi-person-gear', label: user?.username || 'Profile' },
  ];

  return (
    <nav className={`navbar navbar-expand-lg navbar-light sticky-top transition-all duration-300 ${
      isScrolled ? 'py-2' : 'py-3'
    }`} style={{ 
      background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', 
      boxShadow: isScrolled ? '0 8px 32px rgba(255, 87, 34, 0.4)' : '0 4px 20px rgba(255, 87, 34, 0.3)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center" to="/products" style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontSize: isScrolled ? '1.5rem' : '1.8rem',
          transition: 'all 0.3s ease'
        }}>
          <i className="bi bi-shop me-3" style={{ 
            fontSize: '1.3em'
          }}></i>
          <span>{user?.restaurantName || 'Restaurant Panel'}</span>
        </Link>

        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        >
          <i className="bi bi-list text-white" style={{ fontSize: '1.5rem' }}></i>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">
            {user ? (
              <>
                {navItems.map((item, index) => (
                  <li key={item.path} className="nav-item" style={{
                    animation: `fadeInDown 0.6s ease-out ${index * 0.1}s both`
                  }}>
                    <Link 
                      className={`nav-link px-3 py-2 rounded-pill fw-semibold text-white position-relative overflow-visible d-flex flex-column align-items-center ${
                        location.pathname === item.path ? 'active' : ''
                      }`}
                      to={item.path}
                      onClick={() => {
                        if (item.path === '/orders') {
                          setOrderCount(0);
                        }
                      }}
                      style={{ 
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        textDecoration: 'none',
                        background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                        transition: 'all 0.3s ease',
                        backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
                        minWidth: '70px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== item.path) {
                          e.target.style.background = 'rgba(255,255,255,0.15)'
                          e.target.style.transform = 'translateY(-2px)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== item.path) {
                          e.target.style.background = 'transparent'
                          e.target.style.transform = 'translateY(0)'
                        }
                      }}
                    >
                      <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', marginBottom: '2px' }}></i>
                      <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                      {item.badge > 0 && (
                        <span 
                          className="position-absolute badge rounded-pill bg-danger d-flex align-items-center justify-content-center" 
                          style={{ 
                            fontSize: '0.65rem',
                            top: '-5px',
                            right: '-5px',
                            minWidth: '20px',
                            height: '20px',
                            zIndex: 10,
                            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)',
                            border: '2px solid white'
                          }}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                
                <li className="nav-item ms-2">
                  <button 
                    className="cool-btn cool-btn-danger cool-btn-md" 
                    onClick={handleLogout}
                    style={{ background: 'white', color: '#FF5722' }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link fw-semibold text-white" href="/login" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Login</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-semibold text-white" href="/signup" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Signup</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
