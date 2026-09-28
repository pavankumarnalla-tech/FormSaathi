import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formFillDefinitions, mapAnalysisToFillSections } from '../data/formFillDefinitions';

const ReviewPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { formValues = {}, formMeta = {}, analysisData = null, sections: passedSections } = location.state || {};

  if (!formValues || Object.keys(formValues).length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle display-1 text-muted"></i>
        <h3 className="fw-bold mt-4">No form data found.</h3>
        <button className="btn-primary-brand mt-3" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const isUploadFlow = !!analysisData;
  const sections = passedSections ||
    (isUploadFlow
      ? mapAnalysisToFillSections(analysisData.sections)
      : (formFillDefinitions[parseInt(id, 10)]?.sections || []));

  const handleEditSection = (sectionIdx) => {
    navigate(isUploadFlow ? '/form/upload/fill' : `/form/${id}/fill`, {
      state: { formValues, formMeta, analysisData, startSection: sectionIdx }
    });
  };

  const handleGenerate = () => {
    navigate(isUploadFlow ? '/form/upload/complete' : `/form/${id}/complete`, {
      state: { formValues, formMeta, analysisData, sections }
    });
  };

  const displayValue = (field, val) => {
    if (!val || (typeof val === 'string' && !val.trim())) return <span className="text-muted fst-italic">Not provided</span>;
    if (field.type === 'file') {
      return <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Document uploaded: {val.name}</span>;
    }
    return <span className="fw-medium">{val.toString()}</span>;
  };

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted"
              onClick={() => navigate(isUploadFlow ? '/form/upload/validation' : `/form/${id}/validation`, { state: { formValues, formMeta, analysisData } })}>
              Validation
            </button>
          </li>
          <li className="breadcrumb-item active">Review</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-5">
        <h1 className="fw-bold mb-2">Final Review</h1>
        <p className="lead text-muted-brand mb-0">{formMeta.name}</p>
        <div className="alert alert-info border-0 rounded-3 mt-3 py-2 px-3 small d-inline-block">
          <i className="bi bi-info-circle me-2"></i>
          Please review all information carefully before generating the form.
        </div>
      </div>

      {/* Section-by-section review */}
      <div className="d-flex flex-column gap-4 mb-5">
        {sections.map((section, si) => (
          <div key={si} className="card border-0 rounded-4 shadow-sm bg-white">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold mb-0">{section.name}</h5>
                <button
                  className="btn btn-sm btn-outline-brand rounded-pill px-3"
                  onClick={() => handleEditSection(si)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit
                </button>
              </div>
              <div className="row g-3">
                {section.fields.map((field) => (
                  <div key={field.key} className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <div className="text-muted small mb-1">{field.name}{field.required && <span className="text-danger ms-1">*</span>}</div>
                      <div>{displayValue(field, formValues[field.key])}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="alert alert-warning border-0 rounded-4 mb-5 d-flex align-items-start shadow-sm">
        <i className="bi bi-shield-exclamation fs-4 me-3 flex-shrink-0 mt-1"></i>
        <div>
          <strong>Please verify all information before generating the form.</strong>
          <div className="mt-1 small">
            Form Saathi does not submit your application to any government portal.
            After downloading the generated form, you must submit it through the appropriate official channel.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
        <button
          className="btn btn-outline-secondary rounded-pill px-4 py-2"
          onClick={() => navigate(isUploadFlow ? '/form/upload/validation' : `/form/${id}/validation`, { state: { formValues, formMeta, analysisData } })}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Validation
        </button>
        <button className="btn-primary-brand px-5 py-2 fw-bold shadow-sm" onClick={handleGenerate}>
          <i className="bi bi-file-earmark-arrow-down me-2"></i>Generate Official Form
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
