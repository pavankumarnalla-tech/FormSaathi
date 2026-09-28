import React from 'react';
import { Link } from 'react-router-dom';

const LoginPlaceholder = () => {
  return (
    <div className="container section-padding text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="bg-light p-5 rounded-4 shadow-sm border">
            <div className="icon-wrapper bg-primary-brand text-white mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
              <i className="bi bi-person-lock fs-2"></i>
            </div>
            <h2 className="fw-bold mb-3">Login Route Placeholder</h2>
            <p className="lead text-muted-brand mb-4">
              Login will be implemented in Step 3.
            </p>
            <Link to="/" className="btn-outline-brand text-decoration-none">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPlaceholder;
