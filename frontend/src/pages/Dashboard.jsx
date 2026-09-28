import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const recentForms = [
    { id: 1, title: 'Income Certificate Application', lastOpened: 'Today', status: 'In Progress', action: 'Continue' },
    { id: 2, title: 'Education Scholarship Form', lastOpened: 'Yesterday', status: 'Completed', action: 'View' },
    { id: 3, title: 'Residence Certificate', lastOpened: '2 days ago', status: 'In Progress', action: 'Continue' }
  ];

  return (
    <div className="container py-5">
      {/* Greeting */}
      <div className="mb-5">
        <h2 className="fw-bold mb-2">Hello, User 👋</h2>
        <p className="text-muted-brand fs-5">What would you like to do today?</p>
      </div>

      {/* Primary Actions */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div 
            className="card border-0 rounded-4 shadow-sm h-100 p-4" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onClick={() => navigate('/find-form')}
            onMouseOver={(e) => e.currentTarget.classList.add('shadow')}
            onMouseOut={(e) => e.currentTarget.classList.remove('shadow')}
          >
            <div className="icon-wrapper mb-3" style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-search fs-3"></i>
            </div>
            <h3 className="fw-bold mb-3">Find a Form</h3>
            <p className="text-muted-brand mb-4">
              Search for a form and learn what it is, what you need, and how to fill it.
            </p>
            <div className="mt-auto">
              <span className="text-primary-brand fw-bold d-flex align-items-center">
                Find a Form <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div 
            className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-primary-brand text-white" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onClick={() => navigate('/upload-form')}
            onMouseOver={(e) => e.currentTarget.classList.add('shadow')}
            onMouseOut={(e) => e.currentTarget.classList.remove('shadow')}
          >
            <div className="bg-white text-primary-brand rounded-3 d-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-upload fs-3"></i>
            </div>
            <h3 className="fw-bold mb-3">Upload a Form</h3>
            <p className="text-white opacity-75 mb-4">
              Already have a form? Upload a PDF or image and let Form Saathi help you understand it.
            </p>
            <div className="mt-auto">
              <span className="fw-bold d-flex align-items-center">
                Upload a Form <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-5">
        {/* Recent Forms */}
        <div className="col-lg-8">
          <h4 className="fw-bold mb-4">Recent Forms</h4>
          
          {recentForms.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {recentForms.map((form) => (
                <div key={form.id} className="card border-0 rounded-4 shadow-sm p-3">
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-2 mb-md-0">
                      <h6 className="fw-bold mb-1">{form.title}</h6>
                      <span className="text-muted small">Last opened: {form.lastOpened}</span>
                    </div>
                    <div className="col-md-3 mb-2 mb-md-0">
                      <span className={`badge ${form.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'} rounded-pill`}>
                        {form.status}
                      </span>
                    </div>
                    <div className="col-md-3 text-md-end">
                      <button className="btn-outline-brand btn-sm px-3 rounded-pill">
                        {form.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center">
              <div className="text-muted-brand mb-3">
                <i className="bi bi-folder2-open fs-1"></i>
              </div>
              <h5>No recent forms yet.</h5>
              <p className="text-muted mb-4">Find a form or upload an existing form to get started.</p>
              <button className="btn-primary-brand px-4 py-2 mx-auto" onClick={() => navigate('/find-form')}>
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* AI Saathi & Quick Links */}
        <div className="col-lg-4">
          {/* AI Saathi Section */}
          <div className="card border-primary rounded-4 shadow-sm p-4 mb-4" style={{ backgroundColor: '#e0e7ff' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-robot fs-4"></i>
              </div>
              <h5 className="fw-bold mb-0 text-primary-brand">Need help?</h5>
            </div>
            <p className="text-dark opacity-75 mb-4">
              AI Saathi can explain confusing form fields and guide you through the process.
            </p>
            <button 
              className="btn-primary-brand w-100"
              onClick={() => navigate('/ai-saathi')}
            >
              Ask AI Saathi
            </button>
          </div>

          {/* Quick Links */}
          <h5 className="fw-bold mb-3 mt-5">Quick Access</h5>
          <div className="d-flex flex-column gap-2">
            <Link to="/find-form" className="text-decoration-none p-3 rounded-3 bg-white shadow-sm text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-file-earmark-text text-primary-brand me-2"></i> My Forms</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
            <Link to="/upload-form" className="text-decoration-none p-3 rounded-3 bg-white shadow-sm text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-folder text-primary-brand me-2"></i> Documents</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
            <Link to="/profile" className="text-decoration-none p-3 rounded-3 bg-white shadow-sm text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-question-circle text-primary-brand me-2"></i> Help</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
