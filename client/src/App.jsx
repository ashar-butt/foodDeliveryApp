// 📍 Path: App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './assets/Components/Navbar/Navbar';
import Footer from './assets/Components/Footer/Footer';
import './App.css';
import Products from './assets/Components/Products/Products';
import AddProduct from './assets/Components/Products/AddProduct';
import EditProduct from './assets/Components/Products/EditProduct';
import Contact from './assets/Components/Contact/Contact';
import Login from './assets/Components/Login/Login';
import Signup from './assets/Components/SignUp/Signup';
import Logout from './assets/Components/Logout/Logout';
import OtpVerify from './assets/Components/SignUp/OtpVerify';
import DeleteProduct from './assets/Components/Products/DeleteProduct';
import Profile from './assets/Components/Profile/Profile';
import Orders from './assets/Components/Orders/Orders';
import OrderDetails from './assets/Components/Orders/OrderDetails';
import OrderProgress from './assets/Components/OrderProgress/OrderProgress';
import ResetPassword from './assets/Components/ResetPassword/ResetPassword';
import ClientReviews from './assets/Components/Reviews/ClientReviews';

const AppContent = () => {
  const [client, setClient] = useState(null);
  const location = useLocation();

  // Check user auth state
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== "undefined") {
        setClient(JSON.parse(storedUser));
      } else {
        setClient(null);
      }
    };
    
    const handleAdminUpdate = async (event) => {
      if (event.detail.type === 'client') {
        try {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const res = await fetch(`http://localhost:5001/Clientauth/client/${currentUser._id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              localStorage.setItem('user', JSON.stringify(data.client));
              setClient(data.client);
            }
          }
        } catch (err) {
          console.error('Failed to refresh client data:', err);
        }
      }
    };
    
    checkUser();
    window.addEventListener('userLogin', checkUser);
    window.addEventListener('adminUpdate', handleAdminUpdate);
    return () => {
      window.removeEventListener('userLogin', checkUser);
      window.removeEventListener('adminUpdate', handleAdminUpdate);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {client && <Navbar />}
      {client && location.pathname === '/products' && <OrderProgress />}
      <main className="flex-grow-1">
        <Routes>
          {/* Default: always redirect to login unless logged in */}
          <Route path="/" element={client ? <Navigate to="/products" /> : <Navigate to="/login" replace />} />
          {/* Protected routes: only accessible if logged in */}
          <Route path="/products" element={client ? <Products/> : <Navigate to="/login" replace />} />
          <Route path="/deleteproduct/:id" element={client ? <DeleteProduct/> : <Navigate to="/login" replace />} />
          <Route path="/addproduct" element={client ? <AddProduct /> : <Navigate to="/login" replace />} />
          <Route path="/editproduct/:id" element={client ? <EditProduct /> : <Navigate to="/login" replace />} />
          {/* <Route path="/offers" element={client ? <Offers /> : <Navigate to="/login" replace />} /> */}
          <Route path="/contact" element={client ? <Contact /> : <Navigate to="/login" replace /> } />
          <Route path="/profile" element={client ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/orders" element={client ? <Orders /> : <Navigate to="/login" replace />} />
          <Route path="/order-details/:orderId" element={client ? <OrderDetails /> : <Navigate to="/login" replace />} />
          <Route path="/reviews" element={client ? <ClientReviews /> : <Navigate to="/login" replace />} />
          {/* <Route path="/cart" element={client ? <Cart /> : <Navigate to="/login" replace />} /> */}
          {/* If already logged in, prevent showing Login/Signup pages */}
          <Route path="/login" element={!client ? <Login /> : <Navigate to="/products" replace />} />
          <Route path="/OtpVerify" element={!client ? <OtpVerify /> : <Navigate to="/products" replace />} />
          <Route path="/signup" element={!client ? <Signup /> : <Navigate to="/products" replace />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset-password" element={!client ? <ResetPassword /> : <Navigate to="/products" replace />} />
        </Routes>
      </main>
      {client && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
