import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FormAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisResult = location.state?.result;

  useEffect(() => {
    // If accessed directly without analyzing a form, kick back to upload
    if (!analysisResult) {
      navigate('/upload-form', { replace: true });
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { formSummary, sections, isDemoMode } = analysisResult;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'found':
        return <span className="badge bg-success rounded-pill px-3 py-2"><i className="bi bi-check-circle me-1"></i>Found</span>;
      case 'empty':
        return <span className="badge bg-secondary rounded-pill px-3 py-2"><i className="bi bi-circle me-1"></i>Empty</span>;
      case 'review':
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-2"><i className="bi bi-exclamation-triangle me-1"></i>Review</span>;
      default:
        return <span className="badge bg-light text-dark rounded-pill px-3 py-2">{status}</span>;
    }
  };

  return (
    <div className="container py-5">
      
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/upload-form')}>
              Upload a Form
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Analysis Result</li>
        </ol>
      </nav>

      <div className="mb-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
        <div>
          <h1 className="fw-bold mb-2">Form Analysis</h1>
          <p className="lead text-muted-brand mb-0">Information detected from your uploaded form.</p>
        </div>
        {isDemoMode && (
          <div className="mt-3 mt-md-0">
            <span className="badge bg-warning text-dark fs-6 px-3 py-2 shadow-sm">
              <i className="bi bi-cone-striped me-2"></i> DEMO MODE ACTIVE
            </span>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Left Column: Summary & Sections */}
        <div className="col-lg-4">
          
          <div className="card border-0 rounded-4 shadow-sm bg-primary-brand text-white p-4 mb-4">
            <h5 className="fw-bold opacity-75 mb-3 text-uppercase small">Form Identified</h5>
            <h3 className="fw-bold mb-3">{formSummary.name}</h3>
            <div className="d-flex align-items-center mb-0">
              <i className="bi bi-robot fs-4 me-2"></i>
              <span className="fw-medium">Confidence: {formSummary.confidence}</span>
            </div>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
            <h5 className="fw-bold border-bottom pb-3 mb-4">Completion Summary</h5>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-medium">Total Fields Detected</span>
              <span className="fw-bold fs-5">{formSummary.totalFields}</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-success fw-medium"><i className="bi bi-check-circle-fill me-2"></i>Found</span>
              <span className="fw-bold fs-5 text-success">{formSummary.completedFields}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-secondary fw-medium"><i className="bi bi-circle me-2"></i>Empty</span>
              <span className="fw-bold fs-5 text-secondary">{formSummary.emptyFields}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-warning text-dark fw-medium"><i className="bi bi-exclamation-triangle-fill me-2"></i>Needs Review</span>
              <span className="fw-bold fs-5 text-warning text-dark">{formSummary.needsReview}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Fields list */}
        <div className="col-lg-8">
          
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h4 className="fw-bold mb-4">Detected Fields</h4>
            
            <div className="accordion border-0" id="fieldsAccordion">
              {sections.map((section, idx) => (
                <div className="accordion-item border-0 mb-3 bg-light rounded-4 overflow-hidden" key={idx}>
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button fw-bold bg-light shadow-none" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#collapse${idx}`} 
                      aria-expanded="true"
                    >
                      {section.name}
                    </button>
                  </h2>
                  <div id={`collapse${idx}`} className="accordion-collapse collapse show" data-bs-parent="#fieldsAccordion">
                    <div className="accordion-body pt-0 px-4 pb-4">
                      
                      <div className="table-responsive">
                        <table className="table table-borderless mb-0 align-middle">
                          <tbody>
                            {section.fields.map((field, fIdx) => (
                              <tr key={fIdx} className="border-bottom">
                                <td className="py-3" style={{ width: '40%' }}>
                                  <div className="fw-bold text-dark">{field.name}</div>
                                  <div className="small text-muted">{field.help}</div>
                                </td>
                                <td className="py-3" style={{ width: '40%' }}>
                                  {field.value ? (
                                    <span className="fw-medium text-primary-brand">{field.value}</span>
                                  ) : (
                                    <span className="text-muted fst-italic">--</span>
                                  )}
                                </td>
                                <td className="py-3 text-end" style={{ width: '20%' }}>
                                  {getStatusBadge(field.status)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="row mt-3 mb-5">
        <div className="col-12 d-flex flex-column flex-md-row justify-content-center gap-3">
          <button 
            className="btn btn-outline-secondary px-4 py-3 rounded-pill fw-medium"
            onClick={() => navigate('/upload-form')}
          >
            Upload Another Form
          </button>
          <button 
            className="btn btn-outline-brand px-4 py-3 fw-medium"
            onClick={() => navigate('/upload-form')} // Effectively restarting process
          >
            <i className="bi bi-arrow-repeat me-2"></i> Analyze Again
          </button>
          <button 
            className="btn-primary-brand px-5 py-3 fw-bold fs-5 shadow-sm"
            onClick={() => navigate(`/form/demo/fill`)}
          >
            Continue to Form Saathi <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

    </div>
  );
};

export default FormAnalysis;
