import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    restaurantName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/cart");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    // Strong password validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('restaurantName', formData.restaurantName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (image) {
        formDataToSend.append('restaurantImage', image);
      }

      const res = await axios.post('http://localhost:5001/Clientauth/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMessage('Signup successful. Redirecting to OTP verification...');
        toast.addToast('Signup successful. Redirecting to OTP verification...', 'success');
        setTimeout(() => {
          setMessage('');
          navigate('/OtpVerify', { state: { email: formData.email } });
        }, 1500);
      } else {
        setMessage(res.data.message || 'Signup failed');
        toast.addToast(res.data.message || 'Signup failed', 'error');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Server error during signup';
      setMessage(errorMessage);
      toast.addToast(errorMessage, 'error');
    }
  };

  React.useEffect(() => {
    let timeout;
    if (message) {
      timeout = setTimeout(() => setMessage(''), 3000);
    }
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-shop" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Join as Restaurant Owner!
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Start managing your restaurant</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-person"></i> Owner Name</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter owner name"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-shop"></i> Restaurant Name</label>
                  <input
                    type="text"
                    name="restaurantName"
                    className="form-control"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your restaurant name"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-image"></i> Restaurant Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your business email"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-lock"></i> Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '15px 0 0 15px',
                        border: '2px solid #FFE0B2',
                        borderRight: 'none',
                        padding: '12px 20px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        height: '48px',
                        boxShadow: '0 2px 8px rgba(255,87,34,0.07)',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                      placeholder="Create a secure password"
                      onFocus={e => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                      onBlur={e => e.target.style.boxShadow = '0 2px 8px rgba(255,87,34,0.07)'}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                        border: '2px solid #FFE0B2',
                        borderLeft: 'none',
                        borderRadius: '0 15px 15px 0',
                        color: 'white',
                        padding: '0 18px',
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

                <button 
                  type="submit" 
                  className="cool-btn cool-btn-primary cool-btn-lg w-100 mb-3"
                >
                  <i className="bi bi-shop me-2"></i>Create Restaurant Account
                </button>

                {message && (
                  <div className={`alert text-center`} style={{ 
                    borderRadius: '15px', 
                    border: message.includes('successful') ? '2px solid #4CAF50' : '2px solid #f44336',
                    backgroundColor: message.includes('successful') ? '#e8f5e8' : '#ffebee',
                    color: message.includes('successful') ? '#4CAF50' : '#f44336'
                  }}>
                    {message}
                  </div>
                )}
                
                <div className="text-center mt-3">
                  <p className="text-muted">Already have an account? <a href="/login" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 'bold' }}>Login here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
