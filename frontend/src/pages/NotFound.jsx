import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container section-padding text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary-brand mb-3">404</h1>
        <h2 className="fw-bold mb-4">Page not found</h2>
        <p className="lead text-muted-brand mb-5">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary-brand text-decoration-none px-4 py-2">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
