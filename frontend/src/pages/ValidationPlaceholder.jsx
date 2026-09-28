import React from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationPlaceholder = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '72px', height: '72px' }}>
          <i className="bi bi-shield-check fs-2"></i>
        </div>
        <span className="badge bg-secondary-brand text-primary-brand rounded-pill px-3 py-2 mb-3 d-inline-block">Step 8 — Coming Soon</span>
        <h2 className="fw-bold mb-3">Validation & Review</h2>
        <p className="lead text-muted-brand mb-2">Your completed information will be checked here.</p>
        <p className="text-muted-brand mb-5">
          In Step 8, Form Saathi will validate your responses, highlight missing or inconsistent information, 
          and let you review everything before proceeding.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button className="btn btn-outline-secondary rounded-pill px-4 py-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back to Form
          </button>
          <button className="btn-primary-brand px-4 py-2" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationPlaceholder;
