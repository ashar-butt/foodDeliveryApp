import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';
import { useLocation } from 'react-router-dom';

const OtpVerify = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/auth/signup-otp-verify', {
        email,
        otp,
      });

      if (res.data.success) {
        setMessage('OTP verified successfully. Redirecting to login...');
        toast.addToast('OTP verified successfully. Redirecting to login...', 'success');
        setTimeout(() => {
          setMessage('');
          navigate('/login');
        }, 1500);
      } else {
        setMessage(res.data.message || 'OTP verification failed');
        toast.addToast(res.data.message || 'OTP verification failed', 'error');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error during OTP verification');
      toast.addToast('Server error during OTP verification', 'error');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage('Please enter your email to resend OTP');
      toast.addToast('Please enter your email to resend OTP', 'error');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5001/auth/resend-otp', { email });
      if (res.data.success) {
        setMessage('OTP resent successfully');
        toast.addToast('OTP resent successfully', 'success');
      } else {
        setMessage(res.data.message || 'Failed to resend OTP');
        toast.addToast(res.data.message || 'Failed to resend OTP', 'error');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error during resending OTP');
      toast.addToast('Server error during resending OTP', 'error');
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-shield-check" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Verify Your Account
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Enter the OTP sent to your email</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-key"></i> OTP Code</label>
                  <input
                    type="text"
                    name="otp"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '20px',
                      textAlign: 'center',
                      letterSpacing: '5px'
                    }}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                  />
                </div>

                <button 
                  type="submit" 
                  className="cool-btn cool-btn-success cool-btn-lg w-100 mb-3"
                >
                  <i className="bi bi-check-circle me-2"></i>Verify OTP
                </button>

                <button
                  type="button"
                  className="btn btn-outline-warning w-100 mb-3"
                  onClick={handleResendOtp}
                  style={{
                    borderRadius: '15px',
                    border: '2px solid #FF9800',
                    color: '#FF9800',
                    fontWeight: 'bold',
                    padding: '12px 20px',
                    fontSize: '16px'
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>Resend OTP
                </button>

                {message && (
                  <div className="alert alert-info text-center" style={{ borderRadius: '15px', border: '2px solid #2196F3' }}>
                    {message}
                  </div>
                )}
                
                <div className="text-center mt-3">
                  <p className="text-muted small">Didn't receive the code? Check your spam folder or click resend</p>
                </div>
              </form>
              
              <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #FFE0B2' }}>
                <p className="text-muted mb-2">Need to access your account?</p>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    onClick={() => navigate('/login')} 
                    className="cool-btn cool-btn-primary cool-btn-sm"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </button>
                  <button 
                    onClick={() => navigate('/signup')} 
                    className="cool-btn cool-btn-success cool-btn-sm"
                  >
                    <i className="bi bi-person-plus me-2"></i>Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
