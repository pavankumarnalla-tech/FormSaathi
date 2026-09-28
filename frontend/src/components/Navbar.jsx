import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [preferredLang, setPreferredLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('formSaathiLanguage');
    if (saved) {
      setPreferredLang(saved);
    }
  }, [location]);

  const getLanguageName = (code) => {
    switch(code) {
      case 'te': return 'తెలుగు';
      case 'hi': return 'హిन्दी';
      case 'en': default: return 'English';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to={isAuthenticated ? "/dashboard" : "/"}>
          <i className="bi bi-file-earmark-text-fill text-primary-brand me-2 fs-3"></i>
          <span className="fw-bold fs-4 text-primary-brand">Form Saathi</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            
            {isAuthenticated ? (
              <>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <Link className={`nav-link fw-medium ${location.pathname === '/dashboard' ? 'text-primary-brand' : 'text-dark'}`} to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <Link className={`nav-link fw-medium ${location.pathname === '/profile' ? 'text-primary-brand' : 'text-dark'}`} to="/profile">
                    <i className="bi bi-person-circle me-1 text-primary-brand"></i>
                    {user?.full_name ? user.full_name.split(' ')[0] : 'Profile'}
                  </Link>
                </li>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <Link className="nav-link text-dark fw-medium" to="/language">
                    <i className="bi bi-globe me-1"></i> {getLanguageName(preferredLang)}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3 mb-2 mb-lg-0">
                  <Link className="nav-link text-dark fw-medium" to="/language">
                    <i className="bi bi-globe me-1"></i> Language
                  </Link>
                </li>
                <li className="nav-item me-2 mb-2 mb-lg-0">
                  <Link className="btn btn-outline-brand btn-sm px-3 py-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn-primary-brand text-decoration-none btn-sm px-3 py-2 d-inline-block" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
