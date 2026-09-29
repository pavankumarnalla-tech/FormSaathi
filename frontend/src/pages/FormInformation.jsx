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
          <p className="text-muted-brand lead mb-4">We couldn't find the form or service you're looking for.</p>
          <button className="btn-primary-brand" onClick={() => navigate('/find-form')}>
            Back to Find a Form
          </button>
        </div>
      </div>
    );
  }

  const isOnlineService = form.serviceType === 'ONLINE_SERVICE';
  const isTemplateReady = form.status === 'official-template-ready';
  const isComingSoon    = form.status === 'coming-soon';

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

      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link text-muted p-0 me-3 text-decoration-none" onClick={() => navigate('/find-form')}>
          <i className="bi bi-arrow-left fs-4"></i>
        </button>
        <div>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {isTemplateReady ? (
              <span className="badge rounded-pill bg-success text-white px-3 py-2 fw-medium">
                <i className="bi bi-file-earmark-check-fill me-1"></i>Official Template Ready
              </span>
            ) : isOnlineService ? (
              <span className="badge rounded-pill bg-primary-brand text-white px-3 py-2 fw-medium">
                <i className="bi bi-laptop me-1"></i>Official Online Service
              </span>
            ) : (
              <span className="badge rounded-pill bg-secondary text-white px-3 py-2 fw-medium">
                <i className="bi bi-clock-history me-1"></i>Integration Pending
              </span>
            )}
            <span className={`badge rounded-pill px-3 py-2 fw-medium ${
              form.governmentLevel === 'NATIONAL' ? 'bg-info text-dark' : 'bg-warning text-dark'
            }`}>
              {form.governmentLevel === 'NATIONAL' ? '🇮🇳 National' : 'TS Telangana'}
            </span>
          </div>
          <h1 className="fw-bold mb-0">{form.name}</h1>
          <p className="text-muted small mt-1 mb-0">
            <i className="bi bi-building me-1"></i>{form.department} · {form.ministry}
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">

          {/* About */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-info-circle me-2"></i>About This {isOnlineService ? 'Service' : 'Form'}
            </h5>
            <p className="lead mb-4">{form.shortDescription}</p>
            <h6 className="fw-bold">Purpose</h6>
            <p className="text-muted-brand mb-0">{form.purpose}</p>
          </div>

          {/* Eligibility */}
          {form.eligibility && (
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
              <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
                <i className="bi bi-person-check me-2"></i>Who Can Apply?
              </h5>
              <p className="text-muted-brand mb-0">{form.eligibility}</p>
            </div>
          )}

          {/* Documents */}
          {form.requiredDocuments?.length > 0 && (
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
              <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
                <i className="bi bi-file-earmark-check me-2"></i>Documents You May Need
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
          )}

          {/* Instructions */}
          {form.instructions?.length > 0 && (
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
              <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
                <i className="bi bi-list-ol me-2"></i>
                {isOnlineService ? 'How to Apply' : 'Basic Instructions'}
              </h5>
              <ol className="text-muted-brand mb-0 ps-3">
                {form.instructions.map((inst, idx) => (
                  <li key={idx} className="mb-2">{inst}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Disclaimer */}
          <div className="alert border-0 rounded-4 py-3 px-4" style={{ background: '#fef9ec' }}>
            <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            <small className="text-dark">
              <strong>Official Reference:</strong> Form Saathi helps you understand and prepare official government applications.
              Always verify the latest requirements, fees, and submission procedures on the official government website.
              Last verified: <strong>{form.lastVerified}</strong>
            </small>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white position-sticky" style={{ top: '100px' }}>

            {/* Primary Action */}
            {isTemplateReady ? (
              <button
                className="btn-primary-brand w-100 py-3 mb-3 fw-bold shadow-sm"
                onClick={() => navigate(`/form/${form.id}/fill`)}
              >
                <i className="bi bi-pencil-square me-2"></i>Start Filling Form
              </button>
            ) : isOnlineService ? (
              <>
                <a
                  href={form.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-brand w-100 py-3 mb-3 fw-bold shadow-sm d-flex align-items-center justify-content-center text-decoration-none"
                >
                  <i className="bi bi-box-arrow-up-right me-2"></i>Open Official Portal
                </a>
                <p className="text-muted small text-center mb-3">
                  This service is completed directly on the official government portal.
                </p>
              </>
            ) : (
              <div className="alert alert-secondary text-center py-3 mb-3 small border-0 rounded-3">
                <i className="bi bi-info-circle me-1"></i>Official template available — integration pending.
              </div>
            )}

            {/* Official Source Button */}
            <a
              href={form.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary w-100 py-2 fw-medium rounded-pill text-decoration-none d-flex align-items-center justify-content-center gap-2 mb-4"
            >
              <i className="bi bi-globe2"></i>View Official Source
            </a>

            {/* Quick Facts */}
            <div className="border-top pt-4">
              <h6 className="fw-bold mb-4">Quick Facts</h6>

              <div className="mb-3">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-cash me-2"></i>Fee
                </div>
                <p className="mb-0 fw-medium small">{form.fee}</p>
              </div>

              <div className="mb-3">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-geo-alt me-2"></i>Where to Apply
                </div>
                <p className="mb-0 fw-medium small">{form.whereToApply}</p>
              </div>

              <div className="mb-3">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-building me-2"></i>Department
                </div>
                <p className="mb-0 fw-medium small">{form.department}</p>
              </div>

              <div>
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-calendar-check me-2"></i>Last Verified
                </div>
                <p className="mb-0 fw-medium small">{form.lastVerified}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="mt-4">
        <button className="btn btn-link text-muted text-decoration-none p-0" onClick={() => navigate('/find-form')}>
          <i className="bi bi-arrow-left me-2"></i>Back to Forms & Services
        </button>
      </div>
    </div>
  );
};

export default FormInformation;
