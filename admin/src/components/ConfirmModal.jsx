import React from 'react';

const ConfirmModal = ({ show, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return 'bi-exclamation-triangle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      default: return 'bi-question-circle-fill';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'danger': return '#dc3545';
      case 'warning': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999
    }}>
      <div className="bg-white rounded-4 shadow-lg p-4" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className={`bi ${getIcon()} display-4`} style={{ color: getColor() }}></i>
          </div>
          <h5 className="fw-bold mb-2">{title}</h5>
          <p className="text-muted mb-0">{message}</p>
        </div>
        <div className="d-flex gap-3">
          <button 
            className="btn btn-outline-secondary flex-fill"
            onClick={onClose}
            style={{ borderRadius: '15px' }}
          >
            Cancel
          </button>
          <button 
            className="btn flex-fill"
            onClick={onConfirm}
            style={{
              background: `linear-gradient(45deg, ${getColor()}, ${getColor()}dd)`,
              color: 'white',
              border: 'none',
              borderRadius: '15px'
            }}
          >
            <i className="bi bi-check me-2"></i>Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;