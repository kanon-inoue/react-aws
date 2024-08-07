import React from 'react';
import { useAuth } from '../auth/AuthContext';
import '../App.css';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">Petowners</div>
      {isLoggedIn && (
        <div className="navbar-links">
          <a href="/posts" className="navbar-item">Home</a>
          <a href="/account" className="navbar-item">Dogs Account</a>
          <a href="/login" onClick={logout} className="navbar-item">Logout</a>
          {/* Add additional links or content here */}
        </div>
      )}
      {!isLoggedIn && (
        <div className="navbar-links">
          <a href="/login" className="navbar-item">Sign in</a>
          {/* Add additional links or content here */}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
