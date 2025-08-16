import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';
import API_BASE_URL from '../../../config/api';
import { imageService } from '../../../services/imageService';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({ name: '', price: '', description: '', image: '', discount: 0 });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/getproduct/${id}`);
        setProduct({
          name: res.data.name || res.data.title || '',
          price: res.data.price || '',
          description: res.data.description || res.data.desc || res.data.details || '',
          image: res.data.image || '',
          discount: res.data.discount || 0
        });
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError('No product ID found.');
      toast.addToast('No product ID found.', 'error');
      return;
    }
    if (!product.name || !product.price || !product.description) {
      setError('All fields are required.');
      toast.addToast('All fields are required.', 'error');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('discount', product.discount);
    formData.append('clientId', user._id);
    if (image) {
      formData.append('image', image);
    }
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/products/editproduct/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      toast.addToast('Product updated successfully!', 'success');
      // alert('Product Updated Successfully');
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      toast.addToast(err.response?.data?.message || 'Failed to update product', 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    return path ? imageService.getImageUrl(path) : '/placeholder.png';
  };

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3" style={{ color: '#FF5722' }}>Loading product details...</p>
    </div>
  );
  
  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger text-center" style={{ borderRadius: '15px', border: '2px solid #f44336' }}>
        <h4><i className="bi bi-x-circle"></i> Error</h4>
        <p className="mb-0">{error}</p>
      </div>
    </div>
  );

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
                    <i className="bi bi-pencil text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>Edit Product</h2>
                <p className="text-muted mb-0">Update your delicious menu item</p>
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="p-4 rounded-3 text-center" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid #FF9800'
                  }}>
                    <i className="bi bi-utensils display-4 mb-3" style={{ color: '#FF5722' }}></i>
                    <h5 className="fw-bold">{product.name || 'Product'}</h5>
                    <p className="text-muted small mb-0">Menu Item</p>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
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
                        {product.image && typeof product.image === 'string' && (
                          <div className="mt-3">
                            <p className="small text-muted mb-2">Current Image:</p>
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="img-fluid rounded shadow-sm"
                              onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                              style={{ 
                                maxHeight: '150px', 
                                objectFit: 'cover', 
                                borderRadius: '12px',
                                border: '2px solid #FF9800'
                              }}
                            />
                          </div>
                        )}
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
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Product
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

export default EditProduct;
