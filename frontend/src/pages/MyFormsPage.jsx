import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyFormsPage = () => {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    loadSavedForms();
  }, []);

  const loadSavedForms = () => {
    try {
      const stored = localStorage.getItem('formSaathi_savedForms');
      if (stored) {
        setSavedForms(JSON.parse(stored));
      } else {
        setSavedForms([]);
      }
    } catch (e) {
      console.error('Failed to load saved forms', e);
    }
  };

  const handleRemoveSaved = (e, formId) => {
    e.stopPropagation();
    try {
      const updated = savedForms.filter(f => f.id !== formId);
      localStorage.setItem('formSaathi_savedForms', JSON.stringify(updated));
      setSavedForms(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Saved Forms & Services</h2>
          <p className="text-muted small mb-0">Quick access to official guidance & document requirements for your bookmarked forms.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>Dashboard
        </button>
      </div>

      {savedForms.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-bookmark-star display-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold">No saved forms yet</h4>
          <p className="text-muted-brand mb-4">Save forms while exploring the catalogue to easily access guidance and instructions later.</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn-primary-brand px-4" onClick={() => navigate('/find-form')}>Explore Forms Catalogue</button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {savedForms.map((form, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-white d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-bookmark-fill"></i>
                  </div>
                  <button
                    className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                    title="Remove from Saved Forms"
                    onClick={(e) => handleRemoveSaved(e, form.id)}
                  >
                    <i className="bi bi-trash"></i> Remove
                  </button>
                </div>
                <h5 className="fw-bold mb-1">{form.name}</h5>
                <p className="text-muted small mb-3">
                  <i className="bi bi-building me-1"></i>{form.department || 'Government Department'}
                </p>
                <div className="mt-auto pt-3 border-top">
                  <button
                    className="btn btn-outline-brand w-100 rounded-pill py-2 fw-medium"
                    onClick={() => navigate(`/form/${form.id}`)}
                  >
                    <i className="bi bi-eye me-2"></i>View Form Guidance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFormsPage;
