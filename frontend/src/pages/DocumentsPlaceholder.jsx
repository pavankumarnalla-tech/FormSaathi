import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DocumentsPlaceholder = () => {
  const navigate = useNavigate();
  return (
    <div className="container section-padding text-center">
      <div className="py-5">
        <div className="icon-wrapper bg-primary-brand text-white mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
          <i className="bi bi-folder2-open fs-2"></i>
        </div>
        <h2 className="fw-bold mb-4">Documents</h2>
        <p className="lead text-muted-brand mb-2">
          Your supporting documents will appear here.
        </p>
        <p className="text-muted-brand mb-5">
          Documents can be added when needed while completing a form.
        </p>
        <button onClick={() => navigate(-1)} className="btn-outline-brand text-decoration-none px-4 py-2 me-3 mb-3">
          <i className="bi bi-arrow-left me-2"></i>Go Back
        </button>
        <Link to="/dashboard" className="btn-primary-brand text-decoration-none px-4 py-2 mb-3 d-inline-block">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default DocumentsPlaceholder;
