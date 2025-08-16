import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';

const Profile = () => {
  const [user, setUser] = useState({ username: '', restaurantName: '', email: '', restaurantImage: '' });
  const [username, setUsername] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.username || '');
      setRestaurantName(parsedUser.restaurantName || '');
      setImage(parsedUser.restaurantImage || null);
    }

    // Listen for admin updates
    const handleAdminUpdate = async (event) => {
      if (event.detail.type === 'client') {
        // Fetch fresh client data from server
        try {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const res = await axios.get(`http://localhost:5001/Clientauth/client/${currentUser._id}`);
          if (res.data.success) {
            const updatedUser = res.data.client;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setUsername(updatedUser.username || '');
            setRestaurantName(updatedUser.restaurantName || '');
          }
        } catch (err) {
          console.error('Failed to fetch updated client data:', err);
        }
      }
    };

    window.addEventListener('adminUpdate', handleAdminUpdate);
    return () => window.removeEventListener('adminUpdate', handleAdminUpdate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    setLoading(true);

    console.log("User object before update:", user);
    if (!user || !user._id) {
      alert("User ID is missing. Please reload the page or login again.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('restaurantName', restaurantName);
      formData.append('clientId', user._id);
      if (password) {
        formData.append('password', password);
      }
      if (image) {
        formData.append('restaurantImage', image);
      }

      const res = await axios.put('http://localhost:5001/Clientauth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Show custom success message
        toast.addToast('Profile updated successfully!', 'success');
        // Also update local storage user info
        const updatedUser = { ...user, username, restaurantName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPassword('');
        // Navigate without full page reload
        navigate('/products');
      } else {
        // Show custom error message from server as alert instead of toast
        alert(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Server error during profile update', 'error');
      alert(err.response?.data?.message || 'Server error during profile update'); 
     
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
                    <i className="bi bi-shop text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2.5rem'
                }}>Restaurant Profile</h2>
                <p className="text-muted mb-0">Manage your restaurant account settings</p>
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="p-4 rounded-3 text-center" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid #FF9800'
                  }}>
                    <i className="bi bi-person-circle display-4 mb-3" style={{ color: '#FF5722' }}></i>
                    <h5 className="fw-bold">{user.username}</h5>
                    <p className="text-muted small mb-0">Restaurant Owner</p>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-envelope me-2"></i>Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={user.email}
                          readOnly
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #e0e0e0', 
                            padding: '12px 16px',
                            fontSize: '16px',
                            backgroundColor: '#f5f5f5'
                          }}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-person me-2"></i>Owner Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
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
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-shop me-2"></i>Restaurant Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
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
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-image me-2"></i>Restaurant Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={(e) => setImage(e.target.files[0])}
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
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: '#FF5722' }}>
                          <i className="bi bi-lock me-2"></i>New Password
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                            style={{
                              borderRadius: '12px 0 0 12px',
                              border: '2px solid #FF9800',
                              borderRight: 'none',
                              padding: '12px 16px',
                              fontSize: '16px',
                              transition: 'all 0.3s ease',
                              height: '48px',
                              boxShadow: '0 2px 8px rgba(255,87,34,0.07)',
                              boxSizing: 'border-box',
                              verticalAlign: 'middle'
                            }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                            onBlur={(e) => e.target.style.boxShadow = '0 2px 8px rgba(255,87,34,0.07)'}
                          />
                          <button
                            type="button"
                            className="btn"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                              border: '2px solid #FF9800',
                              borderLeft: 'none',
                              borderRadius: '0 12px 12px 0',
                              color: 'white',
                              padding: '0 16px',
                              display: 'flex',
                              alignItems: 'center',
                              height: '48px',
                              boxShadow: '0 2px 8px rgba(255,87,34,0.07)',
                              boxSizing: 'border-box',
                              verticalAlign: 'middle',
                              margin: 0
                            }}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                        {passwordError && (
                          <div className="text-danger mt-2" style={{ fontSize: '0.95em' }}>{passwordError}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-lg flex-fill" 
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          padding: '12px',
                          boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 4px 15px rgba(255, 87, 34, 0.3)'
                        }}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Profile
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-lg btn-outline-secondary"
                        onClick={() => navigate('/products')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          padding: '12px 24px'
                        }}
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

export default Profile;
