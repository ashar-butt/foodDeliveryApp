import { useState, useEffect } from 'react'
import axios from 'axios'
import ConfirmModal from './ConfirmModal'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  useEffect(() => {
    fetchProducts()
    const interval = setInterval(fetchProducts, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchProducts = () => {
    axios.get('http://localhost:5001/admin/products')
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const deleteProduct = (product) => {
    setProductToDelete(product)
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    axios.delete(`http://localhost:5001/admin/products/${productToDelete._id}`)
      .then(() => {
        fetchProducts()
        setShowConfirm(false)
        setProductToDelete(null)
      })
      .catch(err => console.error(err))
  }

  const editProduct = (product) => {
    setEditingProduct(product._id)
    setEditForm({ 
      name: product.name, 
      description: product.description,
      price: product.price,
      category: product.category
    })
  }

  const saveProduct = () => {
    axios.put(`http://localhost:5001/admin/products/${editingProduct}`, editForm)
      .then(() => {
        fetchProducts()
        setEditingProduct(null)
        setEditForm({})
        // Trigger real-time update
        window.dispatchEvent(new CustomEvent('adminUpdate', { detail: { type: 'product', action: 'update' } }))
      })
      .catch(err => console.error(err))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.clientId?.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category))]
  const categoryColors = {
    'Fast Food': 'bg-danger',
    'Pizza': 'bg-warning text-dark',
    'Burgers': 'bg-info',
    'Chinese': 'bg-success',
    'Desserts': 'bg-primary',
    'Beverages': 'bg-secondary'
  }

  return (
    <div className="container mt-4">
      <div className="admin-card p-5 mb-4 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFB74D 100%)',
        color: 'white',
        animation: 'slideInUp 0.6s ease-out both'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
          animation: 'background-rotate 15s linear infinite',
          zIndex: 1
        }}></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-4">
            <div className="mb-4 position-relative">
              <div className="position-absolute" style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'pulse 3s infinite'
              }}></div>
              <i className="bi bi-basket-fill position-relative" style={{ 
                fontSize: '3.5rem',
                color: 'white',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                animation: 'icon-bounce 2s ease-in-out infinite'
              }}></i>
            </div>
            <h1 className="fw-bold mb-3" style={{ 
              fontSize: '3rem',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              animation: 'fadeInDown 0.8s ease-out 0.2s both'
            }}>Product Management</h1>
            <p className="lead mb-4" style={{ 
              fontSize: '1.2rem',
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
        <div className="row mb-4" style={{
          animation: 'slideInUp 0.8s ease-out 0.2s both'
        }}>
          <div className="col-md-4">
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
          <div className="col-md-3">
            <select 
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ border: '2px solid #FF9800' }}
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={`category-${index}`} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#FF5722' }}></div>
            <p className="mt-3 text-muted">Loading products...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th><i className="bi bi-card-text me-2"></i>Product</th>
                  <th><i className="bi bi-shop me-2"></i>Restaurant</th>
                  <th>Price</th>
                  <th><i className="bi bi-calendar me-2"></i>Added</th>
                  <th><i className="bi bi-gear me-2"></i>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product._id} style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.05}s both`
                  }}>
                    <td>
                      <div className="d-flex align-items-center">
                        {product.image ? (
                          <img 
                            src={`http://localhost:5001${product.image}`}
                            alt={product.name}
                            className="me-3 rounded"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="me-3 d-flex align-items-center justify-content-center" style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                            borderRadius: '8px',
                            color: 'white'
                          }}>
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold">{product.name}</div>
                          <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shop-window me-2" style={{ color: '#FF5722' }}></i>
                        <span>{product.clientId?.restaurantName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold" style={{ color: '#28a745' }}>
                          PKR {product.price?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    
                    <td className="text-muted small">
                      {product.createdAt ? (
                        <div>
                          <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                          <small className="text-muted">{new Date(product.createdAt).toLocaleTimeString()}</small>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm position-relative overflow-hidden"
                          onClick={() => editProduct(product)}
                          style={{
                            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '8px 12px',
                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px) scale(1.05)'
                            e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)'
                            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)'
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className="btn-delete btn-sm position-relative overflow-hidden"
                          onClick={() => deleteProduct(product)}
                          title="Delete Product"
                          style={{
                            animation: 'delete-pulse 2s ease-in-out infinite'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px) scale(1.05)';
                            e.target.style.animation = 'none';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.animation = 'delete-pulse 2s ease-in-out infinite';
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <p className="text-muted">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {editingProduct && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999
        }}>
          <div className="bg-white rounded-4 shadow-lg position-relative overflow-hidden" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(255,87,34,0.05) 0%, rgba(255,152,0,0.05) 100%)',
              zIndex: 1
            }}></div>
            <div className="p-5 position-relative" style={{ zIndex: 2 }}>
              <div className="text-center mb-4">
                <div className="mb-3 d-flex align-items-center justify-content-center" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  borderRadius: '15px',
                  margin: '0 auto',
                  boxShadow: '0 8px 25px rgba(255, 87, 34, 0.3)'
                }}>
                  <i className="bi bi-basket-fill text-white" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Edit Product</h4>
                <p className="text-muted mb-0 small">Update product information</p>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                    <i className="bi bi-tag me-2"></i>Product Name
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    style={{ 
                      borderRadius: '15px',
                      border: '2px solid #FFE0B2',
                      padding: '12px 16px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                    <i className="bi bi-currency-dollar me-2"></i>Price (PKR)
                  </label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                    style={{ 
                      borderRadius: '15px',
                      border: '2px solid #FFE0B2',
                      padding: '12px 16px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter price"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                  <i className="bi bi-grid me-2"></i>Category
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  style={{ 
                    borderRadius: '15px',
                    border: '2px solid #FFE0B2',
                    padding: '12px 16px',
                    fontSize: '16px'
                  }}
                  placeholder="Enter category"
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: '#FF5722' }}>
                  <i className="bi bi-card-text me-2"></i>Description
                </label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  style={{ 
                    borderRadius: '15px',
                    border: '2px solid #FFE0B2',
                    padding: '12px 16px',
                    fontSize: '16px',
                    resize: 'none'
                  }}
                  placeholder="Enter product description"
                />
              </div>
              
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-outline-secondary flex-fill"
                  onClick={() => setEditingProduct(null)}
                  style={{ 
                    borderRadius: '15px',
                    border: '2px solid #6c757d',
                    fontWeight: 'bold',
                    padding: '12px 20px'
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button 
                  className="btn flex-fill"
                  onClick={saveProduct}
                  style={{
                    background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: 'bold',
                    padding: '12px 20px',
                    boxShadow: '0 8px 25px rgba(255, 87, 34, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 12px 35px rgba(255, 87, 34, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.3)'
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete product "${productToDelete?.name}" from "${productToDelete?.clientId?.restaurantName}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  )
}

export default Products