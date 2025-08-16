import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5001/admin/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        localStorage.setItem("adminToken", res.data.token);
        window.location.href = "/";
      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-gear-fill" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Admin Login
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Access the admin dashboard</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your admin email"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-lock"></i> Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      required
                      onChange={(e) => setPassword(e.target.value)}
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
                      placeholder="Enter your password"
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
                </div>

                <button 
                  type="submit" 
                  className="btn btn-lg w-100 mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 50%, #FFC107 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    padding: '15px 30px',
                    boxShadow: '0 8px 25px rgba(255, 87, 34, 0.4), 0 4px 15px rgba(255, 152, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    cursor: 'pointer'
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
                  <i className="bi bi-box-arrow-in-right me-2"></i>Access Dashboard
                </button>

                {message && (
                  <div className="alert alert-warning text-center" style={{ borderRadius: '15px', border: '2px solid #FF9800' }}>
                    {message}
                  </div>
                )}
                
                <div className="text-center mt-3">
                  <p className="text-muted mt-2">Forgot your password? <a href="/reset-password" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 'bold' }}>Reset here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;