import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
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
            <h2 className="fw-bold mb-0">Profile</h2>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5">
            <div className="text-center mb-5">
              <div className="bg-secondary-brand text-primary-brand rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person fs-1"></i>
              </div>
              <h3 className="fw-bold">User</h3>
              <p className="text-muted-brand">Demo Account</p>
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-bold text-uppercase mb-1">Email / Mobile</label>
              <div className="p-3 bg-light rounded-3 border">
                demo@user.com
              </div>
            </div>

            <div className="mb-4">
              <label className="text-muted small fw-bold text-uppercase mb-1">Preferred Language</label>
              <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                <span>{getLanguageName(preferredLang)}</span>
                <Link to="/language" className="text-primary-brand text-decoration-none small fw-medium">
                  Change
                </Link>
              </div>
            </div>

            <div className="mt-5">
              <button className="btn-primary-brand w-100 py-3">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
