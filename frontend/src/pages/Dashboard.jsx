import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('formSaathi_savedForms');
      if (stored) {
        setSavedForms(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved forms', e);
    }
  }, []);

  return (
    <div className="container py-4">
      {/* Greeting Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'Citizen'} 👋</h2>
        <p className="text-muted-brand mb-0">What government form or service would you like to explore today?</p>
      </div>

      {/* Primary Actions */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div
            className="card border-0 rounded-4 shadow-sm h-100 p-4 transition-transform hover-lift bg-white"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/find-form')}
          >
            <div className="icon-wrapper mb-3">
              <i className="bi bi-search fs-4"></i>
            </div>
            <h4 className="fw-bold mb-2">Find a Form</h4>
            <p className="text-muted-brand mb-3">
              Search 170+ official government forms, view requirements, documents needed, and field-by-field guidance.
            </p>
            <div className="mt-auto">
              <span className="text-primary-brand fw-bold d-flex align-items-center small">
                Explore Form Catalogue <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-primary-brand text-white transition-transform hover-lift"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/upload-form')}
          >
            <div className="bg-white text-primary-brand rounded-3 d-flex align-items-center justify-content-center mb-3" style={{ width: '44px', height: '44px' }}>
              <i className="bi bi-upload fs-4"></i>
            </div>
            <h4 className="fw-bold mb-2">Upload a Form</h4>
            <p className="text-white opacity-90 mb-3">
              Have a PDF or scanned form? Upload it and let Form Saathi analyze and explain its fields and requirements.
            </p>
            <div className="mt-auto">
              <span className="fw-bold d-flex align-items-center small">
                Upload & Understand <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Saved & Recently Viewed Forms Section */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="fw-bold mb-0">Saved Forms & Services</h4>
            {savedForms.length > 0 && (
              <Link to="/my-forms" className="text-primary-brand text-decoration-none small fw-bold">
                View All ({savedForms.length})
              </Link>
            )}
          </div>

          {savedForms.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {savedForms.slice(0, 5).map((form, idx) => (
                <div key={idx} className="card border-0 rounded-4 shadow-sm p-3 bg-white">
                  <div className="row align-items-center g-2">
                    <div className="col-md-7">
                      <h6 className="fw-bold mb-1 text-dark">{form.name}</h6>
                      <span className="text-muted small">
                        <i className="bi bi-building me-1"></i>{form.department || 'Government Department'}
                      </span>
                    </div>
                    <div className="col-md-5 text-md-end">
                      <button
                        className="btn btn-outline-brand btn-sm rounded-pill px-3"
                        onClick={() => navigate(`/form/${form.id}`)}
                      >
                        <i className="bi bi-eye me-1"></i>View Guidance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 rounded-4 shadow-sm p-4 text-center bg-white">
              <div className="text-muted-brand mb-2">
                <i className="bi bi-bookmark-star fs-2"></i>
              </div>
              <h5 className="fw-bold mb-1">No forms saved yet</h5>
              <p className="text-muted mb-3 small">Browse the catalogue and save forms for easy access to guidance & instructions.</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn-primary-brand btn-sm px-4" onClick={() => navigate('/find-form')}>
                  Explore Forms Catalogue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Saathi & Quick Links */}
        <div className="col-lg-4">
          {/* AI Saathi Section */}
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4" style={{ backgroundColor: '#e0e7ff' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-robot fs-5"></i>
              </div>
              <h5 className="fw-bold mb-0 text-primary-brand">AI Saathi Assistant</h5>
            </div>
            <p className="text-dark opacity-90 small mb-3">
              Ask AI Saathi questions about government form instructions, required documents, or application procedures.
            </p>
            <button
              className="btn-primary-brand w-100"
              onClick={() => navigate('/ai-saathi')}
            >
              Ask AI Saathi <i className="bi bi-chat-text ms-1"></i>
            </button>
          </div>

          {/* Quick Links */}
          <h5 className="fw-bold mb-3">Quick Access</h5>
          <div className="d-flex flex-column gap-2">
            <Link to="/my-forms" className="text-decoration-none p-3 rounded-3 bg-white shadow-sm text-dark d-flex justify-content-between align-items-center hover-lift" style={{ transition: 'all 0.2s' }}>
              <span><i className="bi bi-bookmark text-primary-brand me-2"></i> Saved Forms</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
            <Link to="/help" className="text-decoration-none p-3 rounded-3 bg-white shadow-sm text-dark d-flex justify-content-between align-items-center hover-lift" style={{ transition: 'all 0.2s' }}>
              <span><i className="bi bi-question-circle text-primary-brand me-2"></i> Help & Guidance</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
