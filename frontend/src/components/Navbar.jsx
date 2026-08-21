import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <FaChartLine className="brand-icon" />
          <span>Stock Pulse</span>
        </Link>
        
        <div className="mobile-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={mobileMenuOpen ? 'nav-links active' : 'nav-links'}>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeMenu}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/portfolio" className="nav-link" onClick={closeMenu}>Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link to="/watchlist" className="nav-link" onClick={closeMenu}>Watchlist</Link>
              </li>
              <li className="nav-item user-info">
                <span className="user-name">Hi, {user?.name || 'User'}</span>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-link" onClick={closeMenu}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
