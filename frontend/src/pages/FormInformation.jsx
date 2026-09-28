import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forms } from '../data/formData';

const FormInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const form = forms.find(f => f.id === parseInt(id, 10));

  if (!form) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-file-earmark-x display-1 text-muted mb-4 d-inline-block"></i>
          <h2 className="fw-bold mb-3">Form not found.</h2>
          <p className="text-muted-brand lead mb-4">We couldn't find the form you're looking for.</p>
          <button className="btn-primary-brand" onClick={() => navigate('/find-form')}>
            Back to Find a Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/find-form')}>Find a Form</button>
          </li>
          <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '200px' }}>
            {form.name}
          </li>
        </ol>
      </nav>

      {/* Header Actions */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link text-muted p-0 me-3 text-decoration-none" onClick={() => navigate('/find-form')}>
          <i className="bi bi-arrow-left fs-4"></i>
        </button>
        <div>
          <span className="badge bg-secondary-brand text-primary-brand rounded-pill mb-2 px-3 py-2 fw-medium">
            Form Information
          </span>
          <h1 className="fw-bold mb-0">{form.name}</h1>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">
          
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-info-circle me-2"></i> About This Form
            </h5>
            <p className="lead mb-4">{form.shortDescription}</p>
            <h6 className="fw-bold">Purpose</h6>
            <p className="text-muted-brand mb-0">{form.purpose}</p>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-person-check me-2"></i> Who Can Apply?
            </h5>
            <p className="text-muted-brand mb-0">{form.eligibility}</p>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-file-earmark-check me-2"></i> Documents You May Need
            </h5>
            <ul className="list-unstyled mb-0">
              {form.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="mb-3 d-flex align-items-start">
                  <i className="bi bi-check-square-fill text-success me-3 mt-1"></i>
                  <span className="text-dark">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-list-ol me-2"></i> Basic Instructions
            </h5>
            <ol className="text-muted-brand mb-0 ps-3">
              {form.instructions.map((inst, idx) => (
                <li key={idx} className="mb-2">{inst}</li>
              ))}
            </ol>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4">
          
          {/* Action Card */}
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white position-sticky" style={{ top: '100px' }}>
            <button 
              className="btn-primary-brand w-100 py-3 mb-3 fw-bold shadow-sm"
              onClick={() => navigate(`/form/${form.id}/fill`)}
            >
              Start Filling
            </button>
            <button 
              className="btn-outline-brand w-100 py-3 fw-bold"
              onClick={() => navigate(`/form/${form.id}/explanation`)}
            >
              <i className="bi bi-robot me-2"></i> Understand This Form
            </button>
          </div>

          {/* Quick Facts */}
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-light">
            <h6 className="fw-bold mb-4 border-bottom pb-2">Quick Facts</h6>
            
            <div className="mb-4">
              <div className="d-flex align-items-center text-muted small fw-bold text-uppercase mb-2">
                <i className="bi bi-cash me-2 fs-6"></i> Fee
              </div>
              <p className="mb-0 fw-medium">
                {form.fee}
              </p>
            </div>

            <div className="mb-4">
              <div className="d-flex align-items-center text-muted small fw-bold text-uppercase mb-2">
                <i className="bi bi-geo-alt me-2 fs-6"></i> Where to Apply
              </div>
              <p className="mb-0 fw-medium">
                {form.whereToApply}
              </p>
            </div>

            <div>
              <div className="d-flex align-items-center text-muted small fw-bold text-uppercase mb-2">
                <i className="bi bi-link-45deg me-2 fs-6"></i> Official Source
              </div>
              <div className="alert alert-warning py-2 px-3 border-0 rounded-3 small mb-0 d-flex align-items-start">
                <i className="bi bi-exclamation-triangle-fill text-warning me-2 mt-1"></i>
                <span className="text-dark opacity-75">{form.officialSource}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="mt-4">
        <button className="btn btn-link text-muted text-decoration-none p-0" onClick={() => navigate('/find-form')}>
          <i className="bi bi-arrow-left me-2"></i> Back to Forms
        </button>
      </div>

    </div>
  );
};

export default FormInformation;
