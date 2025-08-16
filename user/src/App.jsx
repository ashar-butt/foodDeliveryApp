import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './assets/Components/Navbar/Navbar';
import Footer from './assets/Components/Footer/Footer';
import './App.css';
import Products from './assets/Components/Products/Products';
import Offers from './assets/Components/Offers/Offers';
import Contact from './assets/Components/Contact/Contact';
import Login from './assets/Components/Login/Login';
import Signup from './assets/Components/SignUp/Signup';
import Logout from './assets/Components/Logout/Logout';
import OtpVerify from './assets/Components/SignUp/OtpVerify';
import Profile from './assets/Components/Profile/Profile';
import Cart from './assets/Components/Cart/Cart';
import Checkout from './assets/Components/Checkout/Checkout';
import OrderConfirmation from './assets/Components/Orders/OrderConfirmation';
import RecentOrders from './assets/Components/Orders/RecentOrders';
import Restaurants from './assets/Components/Restaurants/Restaurants';
import RestaurantProducts from './assets/Components/Restaurants/RestaurantProducts';
import OrderProgress from './assets/Components/OrderProgress/OrderProgress';
import ResetPassword from './assets/Components/ResetPassword/ResetPassword';
import UserReviews from './assets/Components/Reviews/UserReviews';
import AllReviews from './assets/Components/Reviews/AllReviews';
import HelpCenter from './assets/Components/HelpCenter/HelpCenter';
import ComplaintChat from './assets/Components/HelpCenter/ComplaintChat';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check user auth state
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    
    const handleAdminUpdate = async (event) => {
      if (event.detail.type === 'user') {
        try {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const res = await fetch(`http://localhost:5001/auth/user/${currentUser._id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              localStorage.setItem('user', JSON.stringify(data.user));
              setUser(data.user);
            }
          }
        } catch (err) {
          console.error('Failed to refresh user data:', err);
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
      {user && <Navbar />}
      {user && location.pathname === '/restaurants' && <OrderProgress />}
      <main className="flex-grow-1">
        <Routes>
          {/* Default: always redirect to login unless logged in */}
          <Route path="/" element={user ? <Navigate to="/restaurants" /> : <Navigate to="/login" replace />} />
          {/* Protected routes: only accessible if logged in */}
          <Route path="/products" element={user ?<Products/> : <Navigate to="/login" replace />} />
          <Route path="/offers" element={user ?<Offers /> : <Navigate to="/login" replace />} />
          <Route path="/contact" element={user ?<Contact /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={user ?<Profile /> : <Navigate to="/login" replace />} />
          <Route path="/cart" element={user ?<Cart /> : <Navigate to="/login" replace />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" replace />} />
          <Route path="/order-confirmation" element={user ? <OrderConfirmation /> : <Navigate to="/login" replace />} />
          <Route path="/recent-orders" element={user ?<RecentOrders />: <Navigate to="/login" replace />} />
          <Route path="/my-reviews" element={user ? <UserReviews /> : <Navigate to="/login" replace />} />
          <Route path="/all-reviews" element={user ?<AllReviews /> : <Navigate to="/login" replace />} />
          <Route path="/help-center" element={user ? <HelpCenter /> : <Navigate to="/login" replace />} />
          <Route path="/help-center/chat/:id" element={user ? <ComplaintChat /> : <Navigate to="/login" replace />} />
          <Route path="/restaurants" element={user ? <Restaurants /> : <Navigate to="/login" replace />} />
          <Route path="/restaurant/:restaurantId/products" element={user ? <RestaurantProducts /> : <Navigate to="/login" replace />} />
          {/* If already logged in, prevent showing Login/Signup pages */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/restaurants" replace />} />
          <Route path="/OtpVerify" element={!user ? <OtpVerify /> : <Navigate to="/restaurants" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/restaurants" replace />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset-password" element={!user ? <ResetPassword />: <Navigate to="/restaurants" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
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
