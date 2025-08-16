import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    discount: 0
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', Number(product.price));
      formData.append('description', product.description);
      formData.append('discount', product.discount);
      formData.append('clientId', user._id);
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/products/addproduct`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData
      });

      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch (err) {
          setMessage(`Failed to add: Unknown error. Status: ${res.status}`);
          return;
        }
        setMessage(`Failed to add: ${data.message || 'Unknown error'} (Status: ${res.status})`);
        return;
      }

      const data = await res.json();
      setMessage('Product added successfully!');
      setProduct({ name: '', price: '', description: '', discount: 0 });
      setImage(null);
      navigate('/products');
    } catch (err) {
      setMessage('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="admin-card p-5 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="text-center mb-5">
                <div className="d-flex justify-content-center mb-3">
                  <div className="d-flex align-items-center justify-content-center" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                    borderRadius: '50%',
                    boxShadow: '0 8px 25px rgba(255, 87, 34, 0.3)'
                  }}>
                    <i className="bi bi-plus-circle text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>Add New Product</h2>
                <p className="text-muted mb-0">Create a delicious menu item for your restaurant</p>
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="p-4 rounded-3 text-center" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid #FF9800'
                  }}>
                    <i className="bi bi-utensils display-4 mb-3" style={{ color: '#FF5722' }}></i>
                    <h5 className="fw-bold">{product.name || 'New Product'}</h5>
                    <p className="text-muted small mb-0">Menu Item</p>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-utensils me-2"></i>Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={product.name}
                          onChange={handleChange}
                          required
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #FF9800', 
                            padding: '12px 16px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          Price (PKR)
                        </label>
                        <input
                          type="number"
                          name="price"
                          className="form-control"
                          value={product.price}
                          onChange={handleChange}
                          required
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #FF9800', 
                            padding: '12px 16px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-tag me-2"></i>Discount (%)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          className="form-control"
                          value={product.discount}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #FF9800', 
                            padding: '12px 16px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-image me-2"></i>Product Image
                        </label>
                        <input
                          type="file"
                          name="image"
                          className="form-control"
                          onChange={handleImageChange}
                          accept="image/*"
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #FF9800', 
                            padding: '12px 16px',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-12 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-card-text me-2"></i>Description
                        </label>
                        <textarea
                          name="description"
                          className="form-control"
                          value={product.description}
                          onChange={handleChange}
                          required
                          rows="4"
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #FF9800', 
                            padding: '12px 16px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            resize: 'vertical'
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          placeholder="Describe your delicious product..."
                        />
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3 mt-4">
                      <button 
                        type="submit" 
                        className={`cool-btn cool-btn-primary cool-btn-lg flex-fill ${loading ? 'cool-btn-loading' : ''}`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Add Product
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button" 
                        className="cool-btn cool-btn-danger cool-btn-lg"
                        onClick={() => navigate('/products')}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Cancel
                      </button>
                    </div>
                    
                    {message && (
                      <div className="alert alert-info text-center mt-3" style={{ borderRadius: '12px', border: '2px solid #2196F3' }}>
                        {message}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
