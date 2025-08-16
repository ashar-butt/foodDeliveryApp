import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './ComplaintChat.css';

const ComplaintChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const socketConnection = io('http://localhost:5001');
    setSocket(socketConnection);

    socketConnection.emit('join-complaint', id);

    socketConnection.on('new-message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socketConnection.on('status-updated', (data) => {
      if (data.complaintId === id) {
        setComplaint(prev => ({ ...prev, status: data.status }));
      }
    });

    const handleAdminUpdate = () => {
      fetchComplaint();
    };

    window.addEventListener('adminUpdate', handleAdminUpdate);
    fetchComplaint();

    return () => {
      socketConnection.disconnect();
      window.removeEventListener('adminUpdate', handleAdminUpdate);
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`http://localhost:5001/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaint(response.data.complaint);
      setMessages(response.data.complaint.messages);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('message', newMessage);
      formData.append('sender', 'admin');
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await axios.post(
        `http://localhost:5001/complaints/${id}/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Emit to socket for real-time update
      socket.emit('send-message', {
        complaintId: id,
        message: newMessage,
        sender: 'admin',
        attachment: attachment ? response.data.complaint.messages[response.data.complaint.messages.length - 1].attachment : null
      });

      setNewMessage('');
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setAttachment(file);
    } else {
      alert('File size must be less than 5MB');
    }
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const oldStatus = complaint.status;
      
      const response = await axios.put(
        `http://localhost:5001/complaints/${id}/status`,
        { status, priority: complaint.priority || 'medium' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComplaint(prev => ({ ...prev, status }));
      
      // Update counter like cart system
      updateComplaintCounter(oldStatus, status);
      
      // Refresh counter from API
      await refreshComplaintCounter();
      
      // Emit status change to all connected clients
      if (socket) {
        socket.emit('status-updated', { complaintId: id, status, oldStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
      alert('Failed to update status. Please try again.');
    }
  };

  const updateComplaintCounter = (oldStatus, newStatus) => {
    let currentCount = parseInt(localStorage.getItem('complaintCount') || '0');
    
    // If changing FROM open to resolved/closed, decrease counter
    if (oldStatus === 'open' && (newStatus === 'resolved' || newStatus === 'closed')) {
      currentCount = Math.max(0, currentCount - 1);
    }
    // If changing TO open from resolved/closed, increase counter
    else if ((oldStatus === 'resolved' || oldStatus === 'closed') && newStatus === 'open') {
      currentCount += 1;
    }
    
    localStorage.setItem('complaintCount', currentCount.toString());
    window.dispatchEvent(new CustomEvent('updateComplaintCount', { detail: currentCount }));
  };

  const refreshComplaintCounter = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5001/complaints/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const openComplaints = response.data.complaints.filter(c => c.status === 'open').length;
      localStorage.setItem('complaintCount', openComplaints.toString());
      window.dispatchEvent(new CustomEvent('updateComplaintCount', { detail: openComplaints }));
    } catch (error) {
      console.error('Error refreshing complaint count:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge bg-warning',
      in_progress: 'badge bg-info',
      resolved: 'badge bg-success',
      closed: 'badge bg-secondary'
    };
    return badges[status] || 'badge bg-secondary';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger">
          Complaint not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="chat-header">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/complaints')}
        >
          ← Back to Complaints
        </button>
        <div className="complaint-info">
          <h4>{complaint.subject}</h4>
          <span className={getStatusBadge(complaint.status)}>
            {complaint.status.replace('_', ' ').toUpperCase()}
          </span>
        
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'admin' ? 'admin-message' : 'user-message'}`}
            >
              <div className="message-content">
                <div className="message-text">{message.message}</div>
                {message.attachment && (
                  <div className="message-attachment">
                    <a 
                      href={`http://localhost:5001/uploads/${message.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-link"
                    >
                      <i className="bi bi-paperclip"></i> {message.attachment}
                    </a>
                  </div>
                )}
              </div>
              <div className="message-meta">
                <span className="sender">{message.sender === 'admin' ? 'Support' : complaint.userId?.username}</span>
                <span className="timestamp">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {complaint.status !== 'closed' && (
          <form onSubmit={handleSendMessage} className="message-form">
            <textarea
              className="form-control mb-2"
              placeholder="Type your response..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows="2"
              style={{ resize: 'none' }}
            />
            <div className="d-flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="d-none"
                accept="image/*,.pdf,.doc,.docx"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
              >
                <i className="bi bi-paperclip"></i>
              </button>
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
            {attachment && (
              <div className="attachment-preview">
                Selected: {attachment.name}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => {
                    setAttachment(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </form>
        )}
      </div>

    </div>
  );
};

export default ComplaintChat;