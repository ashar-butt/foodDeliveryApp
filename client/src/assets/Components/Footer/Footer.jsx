import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: 'Management',
      icon: 'bi-list-ul',
      links: [
        { path: '/products', label: 'Products', icon: 'bi-utensils' },
        { path: '/orders', label: 'Orders', icon: 'bi-box-seam' },
        { path: '/addproduct', label: 'Add Product', icon: 'bi-plus-circle' }
      ]
    },
    {
      title: 'Restaurant',
      icon: 'bi-building',
      links: [
        { path: '/profile', label: 'Profile', icon: 'bi-person' },
        { path: '/reviews', label: 'Reviews', icon: 'bi-star' }
      ]
    }
  ];

  return (
    <footer className="mt-5 pt-5 pb-3 position-relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #2E2E2E 0%, #1A1A1A 100%)', 
      color: 'white'
    }}>
      {/* Animated Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
        <div className="position-absolute" style={{
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, #FF5722, #FF9800)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="position-absolute" style={{
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, #FF9800, #FFC107)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
      </div>

      <div className="container position-relative">
        <div className="row">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)'
              }}>
                <i className="bi bi-shop text-white" style={{ 
                  fontSize: '1.5rem',
                  animation: 'pulse 2s infinite'
                }}></i>
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>
                  <span style={{ 
                    background: 'linear-gradient(45deg, #FF5722, #FF9800)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}>Restaurant Panel</span>
                </h5>
                <small style={{ color: '#CCCCCC' }}>Food Delivery Platform</small>
              </div>
            </div>
            <p className="mb-4" style={{ color: '#CCCCCC' }}>
              Complete restaurant management solution. Manage your menu, orders, and customer feedback with real-time analytics.
            </p>
            <div className="d-flex gap-2">
              <span className="badge px-3 py-2 rounded-pill" style={{
                background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                boxShadow: '0 2px 10px rgba(255, 87, 34, 0.3)'
              }}>
                <i className="bi bi-speedometer2 me-1"></i>
                Live Dashboard
              </span>
              <span className="badge bg-success px-3 py-2 rounded-pill">
                <i className="bi bi-shield-check me-1"></i>
                Secure
              </span>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="col-lg-2 col-md-3 col-sm-6 mb-4">
              <h6 className="fw-semibold mb-3 d-flex align-items-center" style={{ color: '#FF9800' }}>
                <i className={`bi ${section.icon} me-2`}></i>
                {section.title}
              </h6>
              <ul className="list-unstyled">
                {section.links.map((link) => (
                  <li key={link.path} className="mb-2">
                    <Link 
                      to={link.path} 
                      className="text-decoration-none d-flex align-items-center py-1" 
                      style={{ 
                        color: '#CCCCCC',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#FF9800'
                        e.target.style.transform = 'translateX(5px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#CCCCCC'
                        e.target.style.transform = 'translateX(0)'
                      }}
                    >
                      <i className={`bi ${link.icon} me-2 small`}></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stats & Status */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="fw-semibold mb-3 d-flex align-items-center" style={{ color: '#FF9800' }}>
              <i className="bi bi-bar-chart me-2"></i>
              System Status
            </h6>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 87, 34, 0.1)' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="small" style={{ color: '#CCCCCC' }}>Server</span>
                    <span className="badge bg-success rounded-pill">Online</span>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded-3" style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="small" style={{ color: '#CCCCCC' }}>Database</span>
                    <span className="badge bg-success rounded-pill">Active</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(255, 87, 34, 0.05)' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small" style={{ color: '#CCCCCC' }}>Last Update</span>
                <span className="small" style={{ color: '#FF9800' }}>
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="progress" style={{ height: '4px' }}>
                <div className="progress-bar" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  width: '100%'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <hr className="my-4" style={{ borderColor: '#444', opacity: 0.5 }} />
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-2" style={{ color: '#CCCCCC' }}>
              &copy; {currentYear} FoodExpress Restaurant Panel. All rights reserved.
            </p>
            <p className="mb-0 small" style={{ color: '#FF9800' }}>
              Built with <i className="bi bi-heart-fill mx-1" style={{ 
                color: '#FF5722',
                animation: 'pulse 2s infinite'
              }}></i> for restaurant owners
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3">
              <span className="small" style={{ color: '#CCCCCC' }}>Powered by</span>
              <div className="d-flex gap-2">
                <span className="badge bg-dark px-2 py-1 rounded-2">React</span>
                <span className="badge bg-dark px-2 py-1 rounded-2">Node.js</span>
                <span className="badge bg-dark px-2 py-1 rounded-2">MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
