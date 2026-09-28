import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('formSaathiLanguage');
    if (saved) {
      setPreferredLang(saved);
    }
  }, []);

  const getLanguageName = (code) => {
    switch(code) {
      case 'te': return 'Telugu (తెలుగు)';
      case 'hi': return 'Hindi (हिन्दी)';
      case 'en': default: return 'English';
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="d-flex align-items-center mb-4">
            <Link to="/dashboard" className="btn btn-link text-muted-brand p-0 me-3 text-decoration-none">
              <i className="bi bi-arrow-left fs-4"></i>
            </Link>
            <h2 className="fw-bold mb-0">My Profile</h2>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5">
            <div className="text-center mb-5">
              <div className="bg-secondary-brand text-primary-brand rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person fs-1"></i>
              </div>
              <h3 className="fw-bold">{user?.full_name || 'Form Saathi User'}</h3>
              <p className="text-muted-brand mb-0">{user?.email || 'Verified Account'}</p>
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 mt-2">
                <i className="bi bi-shield-check me-1"></i> Active Citizen Account
              </span>
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-bold text-uppercase mb-1">Full Name</label>
              <div className="p-3 bg-light rounded-3 border fw-medium">
                {user?.full_name || 'N/A'}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-bold text-uppercase mb-1">Registered Email</label>
              <div className="p-3 bg-light rounded-3 border fw-medium">
                {user?.email || 'N/A'}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-bold text-uppercase mb-1">Account Created</label>
              <div className="p-3 bg-light rounded-3 border">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-bold text-uppercase mb-1">Preferred Language</label>
              <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                <span className="fw-medium">{getLanguageName(preferredLang)}</span>
                <Link to="/language" className="text-primary-brand text-decoration-none small fw-bold">
                  Change
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
