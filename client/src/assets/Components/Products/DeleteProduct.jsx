import React, { useState } from 'react';
import { useToast } from '../Toast/ToastProvider';
// import 'Product.css';
const DeleteProduct = ({ productId, onDeleteSuccess, buttonClassName, buttonStyle }) => {
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5001/products/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId: user._id })
      });
      if (response.ok) {
        toast.addToast('Product deleted successfully', 'success');
        if (onDeleteSuccess) {
          onDeleteSuccess(productId);
        }
      } else {
        const errorData = await response.json();
        toast.addToast(errorData.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      toast.addToast('Error deleting product: ' + error.message, 'error');
    }
  };

  return (
    <>
      <button
        className={buttonClassName || "btn ms-2"}
        onClick={() => setShowConfirm(true)}
        style={{
          ...(buttonStyle || {
            marginTop: '1rem',
            backgroundColor: 'transparent',
            color: '#dc3545',
            border: '2px solid #dc3545',
            borderRadius: '50px',
            padding: '0.5rem 1.5rem',
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.5,
            transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }),
          animation: 'delete-pulse 2s ease-in-out infinite'
        }}
        onMouseOver={(e) => {
          if (!buttonStyle) {
            e.target.style.backgroundColor = '#dc3545';
            e.target.style.color = '#fff';
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.animation = 'none';
          } else {
            e.target.style.background = 'linear-gradient(45deg, #dc3545, #ff4757)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.animation = 'none';
          }
        }}
        onMouseOut={(e) => {
          if (!buttonStyle) {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#dc3545';
            e.target.style.transform = 'none';
            e.target.style.animation = 'delete-pulse 2s ease-in-out infinite';
          } else {
            e.target.style.background = 'linear-gradient(45deg, #f44336, #ff6b6b)';
            e.target.style.transform = 'scale(1)';
            e.target.style.animation = 'delete-pulse 2s ease-in-out infinite';
          }
        }}
      >
        <i className="bi bi-trash" style={{
          animation: 'trash-shake 1.5s ease-in-out infinite'
        }}></i>
      </button>

      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999
        }}>
          <div className="bg-white p-4 rounded-4 shadow-lg" style={{ maxWidth: '400px', width: '90%' }}>
            <h5 className="text-center mb-3" style={{ color: '#FF5722' }}>
              <i className="bi bi-exclamation-triangle me-2"></i>Confirm Delete
            </h5>
            <p className="text-center mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="d-flex gap-3">
              <button 
                className="btn btn-outline-secondary flex-fill"
                onClick={() => setShowConfirm(false)}
                style={{ borderRadius: '15px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger flex-fill"
                onClick={handleDelete}
                style={{ borderRadius: '15px' }}
              >
                <i className="bi bi-trash me-2"></i>Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteProduct;
