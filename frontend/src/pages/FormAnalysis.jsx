import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ANALYSIS_STAGES = [
  "Reading document...",
  "Detecting form structure...",
  "Identifying fields...",
  "Preparing analysis..."
];

const FormAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Receive both result and the original file from UploadForm via router state
  const initialResult = location.state?.result;
  const passedFile   = location.state?.file;

  const [result, setResult]       = useState(initialResult);
  const [file, setFile]           = useState(passedFile);
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage]         = useState('');
  const [error, setError]         = useState(null);

  const stageTimerRef = useRef(null);

  useEffect(() => {
    if (!result) {
      navigate('/upload-form', { replace: true });
    }
  }, []); // eslint-disable-line

  if (!result) return null;

  const { formSummary, sections, isDemoMode } = result;

  /* ── Analyze Again ───────────────────────────────────── */
  const handleAnalyzeAgain = async () => {
    if (!file) {
      setError("No uploaded form is available to analyze again. Please upload a form first.");
      return;
    }
    setAnalyzing(true);
    setError(null);

    // Cycle through visual stages
    let stageIdx = 0;
    setStage(ANALYSIS_STAGES[stageIdx]);
    stageTimerRef.current = setInterval(() => {
      stageIdx++;
      if (stageIdx < ANALYSIS_STAGES.length) setStage(ANALYSIS_STAGES[stageIdx]);
    }, 800);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("http://localhost:8000/api/forms/analyze", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(stageTimerRef.current);
      if (response.data?.success) {
        setTimeout(() => {
          setResult(response.data.data);
          setAnalyzing(false);
        }, 600);
      } else {
        throw new Error("Invalid response.");
      }
    } catch (err) {
      clearInterval(stageTimerRef.current);
      setAnalyzing(false);
      setError("Analysis failed. Please try again.");
      console.error(err);
    }
  };

  /* ── Upload Another Form ─────────────────────────────── */
  const handleUploadAnother = () => {
    // Clear both file and result, go fresh
    navigate('/upload-form', { replace: true, state: {} });
  };

  /* ── Continue to Form Saathi ─────────────────────────── */
  const handleContinue = () => {
    navigate('/form/upload/fill', { state: { analysisData: result } });
  };

  /* ── Status badge helper ─────────────────────────────── */
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

  /* ── Analyzing overlay ───────────────────────────────── */
  if (analyzing) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <div className="spinner-border text-primary-brand mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
            <span className="visually-hidden">Analyzing...</span>
          </div>
          <h4 className="fw-bold mb-3">Analyzing your form again...</h4>
          <p className="text-muted-brand lead">{stage}</p>
          {file && <p className="text-muted small mt-3">Using: <strong>{file.name}</strong></p>}
        </div>
      </div>
    );
  }

  /* ── Main render ─────────────────────────────────────── */
  return (
    <div className="container py-5">

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/upload-form')}>Upload a Form</button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Analysis Result</li>
        </ol>
      </nav>

      {/* Title bar */}
      <div className="mb-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
        <div>
          <h1 className="fw-bold mb-2">Form Analysis</h1>
          <p className="lead text-muted-brand mb-0">Information detected from your uploaded form.</p>
          {file && <p className="text-muted small mt-1"><i className="bi bi-paperclip me-1"></i>{file.name}</p>}
        </div>
        {isDemoMode && (
          <div className="mt-3 mt-md-0">
            <span className="badge bg-warning text-dark fs-6 px-3 py-2 shadow-sm">
              <i className="bi bi-cone-striped me-2"></i>DEMO MODE ACTIVE
            </span>
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center border-0 rounded-4 shadow-sm mb-4">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
          <div>
            {error}
            {!file && (
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => navigate('/upload-form')}>
                  Upload a Form
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Left column — summary */}
        <div className="col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm bg-primary-brand text-white p-4 mb-4">
            <h5 className="fw-bold opacity-75 mb-3 text-uppercase small">Form Identified</h5>
            <h3 className="fw-bold mb-3">{formSummary.name}</h3>
            <div className="d-flex align-items-center">
              <i className="bi bi-robot fs-4 me-2"></i>
              <span className="fw-medium">Confidence: {formSummary.confidence}</span>
            </div>
          </div>

          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
            <h5 className="fw-bold border-bottom pb-3 mb-4">Completion Summary</h5>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-medium">Total Fields</span>
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
              <span className="fw-medium" style={{ color: '#b45309' }}><i className="bi bi-exclamation-triangle-fill me-2"></i>Needs Review</span>
              <span className="fw-bold fs-5" style={{ color: '#b45309' }}>{formSummary.needsReview}</span>
            </div>
          </div>
        </div>

        {/* Right column — fields */}
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
                      aria-expanded={idx === 0 ? 'true' : 'false'}
                    >
                      {section.name}
                    </button>
                  </h2>
                  <div id={`collapse${idx}`} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}>
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
                                  {field.value
                                    ? <span className="fw-medium text-primary-brand">{field.value}</span>
                                    : <span className="text-muted fst-italic">--</span>}
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

      {/* Action buttons */}
      <div className="row mt-3 mb-5">
        <div className="col-12 d-flex flex-column flex-sm-row justify-content-center gap-3 align-items-center flex-wrap">
          <div className="text-center">
            <button
              className="btn btn-outline-secondary px-4 py-3 rounded-pill fw-medium w-100"
              onClick={handleUploadAnother}
            >
              <i className="bi bi-upload me-2"></i>Upload Another Form
            </button>
            <div className="text-muted small mt-1">Start with a different file</div>
          </div>
          <div className="text-center">
            <button
              className="btn btn-outline-brand px-4 py-3 fw-medium w-100"
              onClick={handleAnalyzeAgain}
              disabled={!file}
              title={!file ? "No file available to analyze again" : "Retry analysis of this file"}
            >
              <i className="bi bi-arrow-repeat me-2"></i>Analyze Again
            </button>
            <div className="text-muted small mt-1">Retry analysis of {file ? `"${file.name}"` : 'this file'}</div>
          </div>
          <div className="text-center">
            <button
              className="btn-primary-brand px-5 py-3 fw-bold fs-5 shadow-sm w-100"
              onClick={handleContinue}
            >
              Continue to Form Saathi <i className="bi bi-arrow-right ms-2"></i>
            </button>
            <div className="text-muted small mt-1">Fill the form with AI assistance</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FormAnalysis;
