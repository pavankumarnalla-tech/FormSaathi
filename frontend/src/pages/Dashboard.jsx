import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentForms, setRecentForms] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('formSaathi_myForms');
      if (stored) {
        setRecentForms(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent forms', e);
    }
  }, []);

  const handleOpenForm = (form) => {
    if (form.id === 'upload') {
      navigate('/form/upload/fill', {
        state: {
          formValues: form.values,
          formMeta: { name: form.name, id: 'upload' },
          analysisData: form.analysisData,
          startSection: 0
        }
      });
    } else {
      navigate(`/form/${form.id}/fill`, {
        state: {
          formValues: form.values,
          formMeta: { name: form.name, id: form.id },
          startSection: 0
        }
      });
    }
  };

  return (
    <div className="container py-4">
      {/* Greeting Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'Citizen'} 👋</h2>
        <p className="text-muted-brand mb-0">What official form would you like to complete today?</p>
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
              Search government forms, view requirements, documents needed, and start guided filling.
            </p>
            <div className="mt-auto">
              <span className="text-primary-brand fw-bold d-flex align-items-center small">
                Search Catalog <i className="bi bi-arrow-right ms-2"></i>
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
              Have a PDF or scanned form? Upload it and let AI analyze fields and guide you step-by-step.
            </p>
            <div className="mt-auto">
              <span className="fw-bold d-flex align-items-center small">
                Upload & Analyze <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Forms Section */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="fw-bold mb-0">Recent Forms</h4>
            {recentForms.length > 0 && (
              <Link to="/my-forms" className="text-primary-brand text-decoration-none small fw-bold">
                View All ({recentForms.length})
              </Link>
            )}
          </div>
          
          {recentForms.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {recentForms.map((form, idx) => (
                <div key={idx} className="card border-0 rounded-4 shadow-sm p-3 bg-white">
                  <div className="row align-items-center g-2">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-1 text-dark">{form.name}</h6>
                      <span className="text-muted small">Updated: {new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="col-md-3">
                      <span className={`badge ${form.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>
                        {form.status}
                      </span>
                    </div>
                    <div className="col-md-3 text-md-end">
                      <button
                        className="btn btn-outline-brand btn-sm rounded-pill"
                        onClick={() => handleOpenForm(form)}
                      >
                        {form.status === 'Completed' ? 'View' : 'Continue'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 rounded-4 shadow-sm p-4 text-center bg-white">
              <div className="text-muted-brand mb-2">
                <i className="bi bi-folder2-open fs-2"></i>
              </div>
              <h5 className="fw-bold mb-1">No forms started yet</h5>
              <p className="text-muted mb-3 small">Search for a form or upload an existing PDF form to get started.</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn-primary-brand btn-sm px-3" onClick={() => navigate('/find-form')}>
                  Find a Form
                </button>
                <button className="btn btn-outline-brand btn-sm px-3" onClick={() => navigate('/upload-form')}>
                  Upload Form
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
              Ask AI Saathi questions about official forms, requirements, and document fields.
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
              <span><i className="bi bi-file-earmark-text text-primary-brand me-2"></i> My Forms</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
            <Link to="/documents" className="text-decoration-none p-3 rounded-3 bg-white shadow-sm text-dark d-flex justify-content-between align-items-center hover-lift" style={{ transition: 'all 0.2s' }}>
              <span><i className="bi bi-folder text-primary-brand me-2"></i> Documents</span>
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
