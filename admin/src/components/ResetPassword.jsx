import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  function validatePassword(password) {
    // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  }

  const sendResetOtp = async (e) => {
    e.preventDefault();
    const isResend = step === 2;
    if (isResend) {
      setResendLoading(true);
    } else {
      setLoading(true);
    }
    try {
      const res = await fetch('http://localhost:5001/admin/send-otp', {
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
      if (isResend) {
        setResendLoading(false);
      } else {
        setLoading(false);
      }
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
      const res = await fetch('http://localhost:5001/admin/reset-password', {
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
                <i className="bi bi-key-fill" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Reset Password
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Enter your email to reset password</p>
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
                      placeholder="Enter your admin email"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-lg w-100"
                    disabled={loading}
                    style={{
                      background: loading ? '#ccc' : 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFC107 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      padding: '15px 30px',
                      boxShadow: loading ? 'none' : '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translateY(0)',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 12px 35px rgba(255, 87, 34, 0.5), 0 6px 20px rgba(255, 152, 0, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)';
                      }
                    }}
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
                      placeholder="Enter 6-digit code"
                      maxLength="6"
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
                        placeholder="Enter new password"
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
                    className="btn btn-lg w-100"
                    disabled={loading}
                    style={{
                      background: loading ? '#ccc' : 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFC107 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      padding: '15px 30px',
                      boxShadow: loading ? 'none' : '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translateY(0)',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 12px 35px rgba(255, 87, 34, 0.5), 0 6px 20px rgba(255, 152, 0, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)';
                      }
                    }}
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
                    disabled={loading || resendLoading}
                    style={{
                      borderRadius: '15px',
                      border: '2px solid #FF9800',
                      color: '#FF9800',
                      fontWeight: 'bold',
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                  >
                    {resendLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Resending OTP...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-2"></i>Resend OTP
                      </>
                    )}
                  </button>
                </form>
              )}
              
              {message && (
                <div className="alert alert-info text-center mt-3" style={{ borderRadius: '15px' }}>
                  {message}
                </div>
              )}
              
              <div className="text-center mt-3">
                <p className="text-muted">Remember your password? <a href="/login" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 'bold' }}>Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;