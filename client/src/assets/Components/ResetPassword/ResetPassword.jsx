import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  }

  const sendResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/Clientauth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('OTP sent to your email');
        setStep(2);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/Clientauth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Password reset successful');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-key" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Reset Password
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Admin Panel</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              {step === 1 ? (
                <form onSubmit={sendResetOtp}>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                    <input
                      type="email"
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
                    />
                  </div>
                  <button 
                    type="submit" 
                    className={`cool-btn cool-btn-primary cool-btn-lg w-100 ${loading ? 'cool-btn-loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope me-2"></i>Send OTP
                      </>
                    )}
                  </button>
                  
             
                </form>
              ) : (
                <form onSubmit={resetPassword}>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-key"></i> OTP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      style={{ 
                        borderRadius: '15px', 
                        border: '2px solid #FFE0B2', 
                        padding: '12px 20px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-lock"></i> New Password</label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                        onFocus={e => e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 152, 0, 0.25)'}
                        onBlur={e => e.target.style.boxShadow = '0 2px 8px rgba(255,87,34,0.07)'}
                      />
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
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
                        <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {passwordError && (
                      <div className="text-danger mt-2" style={{ fontSize: '0.95em' }}>{passwordError}</div>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    className={`cool-btn cool-btn-primary cool-btn-lg w-100 ${loading ? 'cool-btn-loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>Reset Password
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-warning w-100 mt-3"
                    onClick={sendResetOtp}
                    disabled={loading}
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
                </form>
              )}
              
              {message && (
                <div className="alert alert-info text-center mt-3" style={{ borderRadius: '15px' }}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
