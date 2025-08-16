import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const OrderStatusTracker = ({ orderId, currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const toast = useToast();

  useEffect(() => {
    if (!orderId) return;

    const checkOrderStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/orders/status/${orderId}`);
        if (res.data.status !== status) {
          const newStatus = res.data.status;
          setStatus(newStatus);
          
          const statusMessages = {
            confirmed: 'Your order has been confirmed!',
            preparing: 'Your order is being prepared!',
            ready: 'Your order is ready! Delivery in 15 minutes.',
            delivered: 'Your order has been delivered!',
            cancelled: 'Your order has been cancelled.'
          };
          
          toast.addToast(statusMessages[newStatus] || 'Order status updated', 'info');
          if (onStatusUpdate) onStatusUpdate(newStatus);
        }
      } catch (err) {
        console.error('Error checking order status:', err);
      }
    };

    const interval = setInterval(checkOrderStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [orderId, status, toast, onStatusUpdate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF5722';
      case 'ready': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <i className="bi bi-clock"></i>;
      case 'confirmed': return <i className="bi bi-check-circle"></i>;
      case 'preparing': return <i className="bi bi-fire"></i>;
      case 'ready': return <i className="bi bi-check2-circle"></i>;
      case 'delivered': return <i className="bi bi-truck"></i>;
      case 'cancelled': return <i className="bi bi-x-circle"></i>;
      default: return <i className="bi bi-list-ul"></i>;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending': return 'Order placed, waiting for confirmation';
      case 'confirmed': return 'Order confirmed, preparation will start soon';
      case 'preparing': return 'Your delicious meal is being prepared';
      case 'ready': return 'Order ready! Delivery in 15 minutes';
      case 'delivered': return 'Order delivered successfully!';
      case 'cancelled': return 'Order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  return (
    <div className="order-status-tracker">
      <div 
        className="status-badge d-inline-flex align-items-center px-3 py-2"
        style={{
          backgroundColor: getStatusColor(status),
          color: 'white',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {getStatusIcon(status)} {status.toUpperCase()}
      </div>
      <p className="status-message mt-2 mb-0 small text-muted">
        {getStatusMessage(status)}
      </p>
    </div>
  );
};

export default OrderStatusTracker;
