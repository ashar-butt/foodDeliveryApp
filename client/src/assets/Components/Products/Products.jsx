import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteProduct from './DeleteProduct';
import API_BASE_URL from '../../../config/api';
import { imageService } from '../../../services/imageService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_BASE_URL}/products/client/${user._id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) {
        if (res.status >= 500) {
          // Server error, assume backend down, logout user
          localStorage.clear();
          setError('Server unavailable. You have been logged out.');
          setProducts([]);
          setLoading(false);
          navigate('/login');
          return;
        }
        if (res.status === 404) {
          // Client not found, clear localStorage and logout
          localStorage.clear();
          setError('Account not found. You have been logged out.');
          setProducts([]);
          setLoading(false);
          navigate('/login');
          return;
        }
        // Prevent infinite loop if response is not JSON
        let errorMessage = 'Failed to fetch products.';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonErr) {
          // Not JSON, keep default message
        }
        setError(`${errorMessage}`);
        setProducts([]);
      } else {
        const data = await res.json();
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      }
    } catch (err) {
      // Network or other error, assume backend down, logout user
      localStorage.clear();
      setError('Server unavailable. You have been logged out.');
      setProducts([]);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      const name = (product.name || product.title || '').toLowerCase();
      const description = (product.description || product.desc || product.details || '').toLowerCase();
      const image = (product.image || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || description.includes(search);
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Helper to get a valid product ID for edit
  const getValidProductId = (id) => {
    if (!id) return '';
    // Accept string or object, fallback to string conversion
    if (typeof id === 'object') {
      if (id.$oid) return id.$oid;
      if (id.oid) return id.oid;
      // If object, try to stringify
      return String(Object.values(id)[0] || '');
    }
    // Accept any string, fallback to string conversion
    return String(id);
  };

  // const getImageUrl = (imagePath) => {
  //   if (!imagePath) return null;
  //   if (imagePath.startsWith('http')) return imagePath;
  //   return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  // };
  
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
              <i className="bi bi-utensils position-relative" style={{ 
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
            }}>Product Management</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.3rem',
              opacity: '0.9',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeInDown 0.8s ease-out 0.4s both'
            }}>Manage your restaurant's delicious offerings</p>
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
                <div className="small opacity-75">Total Products</div>
                <div className="fw-bold" style={{
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'number-glow 2s ease-in-out infinite alternate'
                }}>{products.length}</div>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: '2px solid #FF9800' }}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-card p-4">
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#FF5722' }}></div>
            <p className="mt-3 text-muted">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="admin-card p-4">
          <div className="text-center py-5">
            <i className="bi bi-exclamation-triangle display-4 text-danger mb-3"></i>
            <p className="text-danger">{error}</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-card p-4">
          <div className="text-center py-5">
            <i className="bi bi-search display-4 text-muted mb-3"></i>
            <p className="text-muted">{searchTerm ? 'No products match your search.' : 'No products found.'}</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => {
            const validId = getValidProductId(product._id);
            const displayName = product.name || product.title;
            if (!validId || !displayName) return null;

            return (
              <div key={validId} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 border-0 position-relative overflow-hidden" 
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 225, 0.9))',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '30px',
                    boxShadow: '0 15px 45px rgba(255, 87, 34, 0.15), 0 5px 15px rgba(255, 152, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    animation: `slideInUp 0.6s ease-out ${filteredProducts.indexOf(product) * 0.1}s both`,
                    border: '2px solid rgba(255, 152, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-20px) scale(1.03) rotateX(5deg)';
                    e.currentTarget.style.boxShadow = '0 25px 80px rgba(255, 87, 34, 0.3), 0 10px 30px rgba(255, 152, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 1)';
                    e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 248, 225, 0.95))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                    e.currentTarget.style.boxShadow = '0 15px 45px rgba(255, 87, 34, 0.15), 0 5px 15px rgba(255, 152, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 225, 0.9))';
                  }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,87,34,0.03) 0%, rgba(255,152,0,0.03) 50%, rgba(255,193,7,0.02) 100%)',
                    zIndex: 1
                  }}></div>
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(255,152,0,0.1) 0%, transparent 50%)',
                    zIndex: 1
                  }}></div>
                  
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    <div className="position-relative overflow-hidden" style={{ borderRadius: '25px 25px 0 0' }}>
                      {product.image ? (
                        <img
                          src={imageService.getImageUrl(product.image)}
                          alt={displayName}
                          className="card-img-top"
                          style={{
                            height: '220px',
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
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
                      
                      {product.discount && product.discount > 0 && (
                        <div className="position-absolute top-3 end-3">
                          <span className="badge px-3 py-2 rounded-pill" style={{
                            background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)'
                          }}>
                            {product.discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column p-4">
                      <h5 className="card-title fw-bold mb-3 text-center" style={{ 
                        background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.4rem'
                      }}>
                        {displayName}
                      </h5>
                      <p className="card-text text-muted mb-3 flex-grow-1 text-center" style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6',
                        minHeight: '60px'
                      }}>
                        {product.description || product.desc || product.details || 'No description available'}
                      </p>
                      
                      <div className="text-center mb-4">
                        {product.discount && product.discount > 0 ? (
                          <div>
                            <div className="fw-bold" style={{ color: '#FF5722', fontSize: '1.3rem' }}>
                              PKR {(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </div>
                            <div className="text-muted" style={{ textDecoration: 'line-through', fontSize: '1rem' }}>
                              PKR {product.price}
                            </div>
                          </div>
                        ) : (
                          <div className="fw-bold" style={{ color: '#FF5722', fontSize: '1.3rem' }}>
                            PKR {product.price}
                          </div>
                        )}
                      </div>
                      
                      <div className="d-flex gap-3 mt-auto">
                        <button
                          className="btn flex-fill"
                          onClick={() => navigate(`/editproduct/${validId}`)}
                          style={{
                            background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFC107 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            padding: '12px 20px',
                            boxShadow: '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'translateY(0)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 12px 35px rgba(255, 87, 34, 0.5), 0 6px 20px rgba(255, 152, 0, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)';
                          }}
                        >
                          <i className="bi bi-pencil me-2"></i>Edit
                        </button>
                        <DeleteProduct
                          productId={validId}
                          onDeleteSuccess={(deletedId) => {
                            const updatedProducts = products.filter((p) => getValidProductId(p._id) !== deletedId);
                            setProducts(updatedProducts);
                            setFilteredProducts(updatedProducts.filter(product => {
                              const name = (product.name || product.title || '').toLowerCase();
                              const description = (product.description || product.desc || product.details || '').toLowerCase();
                              const search = searchTerm.toLowerCase();
                              return name.includes(search) || description.includes(search);
                            }));
                          }}
                          buttonClassName="btn"
                          buttonStyle={{
                            background: 'linear-gradient(45deg, #f44336, #ff6b6b)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
