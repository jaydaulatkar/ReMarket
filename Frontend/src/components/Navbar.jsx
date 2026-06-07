// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Search, PlusCircle, User, LogOut, LogIn } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <ShoppingBag className="brand-icon" />
          <span>ReMarket</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/browse" className="nav-link">
            <Search size={18} /> Browse
          </Link>
          
          {user ? (
            <>
              <Link to="/create-listing" className="nav-link">
                <PlusCircle size={18} /> Sell
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
