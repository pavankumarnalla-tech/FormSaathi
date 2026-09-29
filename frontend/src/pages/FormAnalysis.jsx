import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AISaathiPanel from '../components/AISaathiPanel';

const ANALYSIS_STAGES = [
  "Reading document...",
  "Detecting form structure...",
  "Extracting required documents...",
  "Generating field guidance..."
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
  const [aiField, setAiField]     = useState(null);

  const stageTimerRef = useRef(null);
  const language = localStorage.getItem('formSaathiLanguage') || 'English';

  useEffect(() => {
    if (!result) {
      navigate('/upload-form', { replace: true });
    }
  }, []); // eslint-disable-line

  if (!result) return null;

  // Extract guidance schema fields (supports both new guidance format and legacy fallback)
  const formTitle = result.formTitle || result.formSummary?.name || file?.name || 'Uploaded Form';
  const purpose = result.purpose || 'Official application form analyzed from uploaded document.';
  const requiredDocuments = result.requiredDocuments || [];
  const importantInstructions = result.importantInstructions || [];

  // Standardize fieldsGuidance list
  let fieldsGuidance = result.fieldsGuidance || [];
  if (!fieldsGuidance.length && result.sections) {
    // Map legacy sections to guidance format if needed
    result.sections.forEach(sec => {
      (sec.fields || []).forEach(f => {
        fieldsGuidance.push({
          name: f.name || f.label || 'Field',
          whatItMeans: f.help || `Official field for ${f.name || 'entry'}.`,
          whatToEnter: `Enter ${f.name || 'details'} as specified on the form.`
        });
      });
    });
  }

  /* ── Analyze Again ───────────────────────────────────── */
  const handleAnalyzeAgain = async () => {
    if (!file) {
      setError("No uploaded form is available to analyze again. Please upload a form first.");
      return;
    }
    setAnalyzing(true);
    setError(null);

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
    navigate('/upload-form', { replace: true, state: {} });
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

  return (
    <div className="container py-4 py-md-5">

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/upload-form')}>Upload a Form</button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Form Analysis & Guidance</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-4">
        <span className="badge rounded-pill bg-primary-brand text-white px-3 py-2 mb-2">
          <i className="bi bi-file-earmark-check me-1"></i>Uploaded Form Guidance
        </span>
        <h1 className="fw-bold mb-1">{formTitle}</h1>
        {file && <p className="text-muted small mb-0"><i className="bi bi-paperclip me-1"></i>Source Document: {file.name}</p>}
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
        {/* Main Content */}
        <div className="col-lg-8">

          {/* 1. About This Form */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-file-earmark-text me-2"></i>About This Form
            </h5>
            <p className="lead mb-0">{purpose}</p>
          </div>

          {/* 2. Required Documents */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-folder-check me-2"></i>Required Documents
            </h5>
            {requiredDocuments.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="mb-3 d-flex align-items-start">
                    <i className="bi bi-check-square-fill text-success me-3 mt-1 fs-5"></i>
                    <span className="text-dark fw-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted fst-italic mb-0">
                <i className="bi bi-info-circle me-2"></i>No specific required documents explicitly listed on this uploaded form.
              </p>
            )}
          </div>

          {/* 3. Field-by-Field Guidance */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
              <div>
                <h5 className="fw-bold text-primary-brand mb-1">
                  <i className="bi bi-card-checklist me-2"></i>Field-by-Field Guidance
                </h5>
                <p className="text-muted small mb-0">Fields detected from your uploaded document.</p>
              </div>
              {fieldsGuidance.length > 0 && (
                <span className="badge bg-secondary-brand text-primary-brand rounded-pill px-3 py-2">
                  {fieldsGuidance.length} Fields Detected
                </span>
              )}
            </div>

            {fieldsGuidance.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {fieldsGuidance.map((field, idx) => (
                  <div key={idx} className="p-4 rounded-3 border bg-light">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="fw-bold mb-0 text-dark">{field.name}</h6>
                      <button
                        className="btn btn-sm btn-outline-brand rounded-pill px-3"
                        onClick={() => setAiField({ name: field.name, description: field.whatItMeans })}
                      >
                        <i className="bi bi-robot me-1"></i>Ask AI Saathi
                      </button>
                    </div>

                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded border-start border-primary border-3">
                          <small className="text-uppercase fw-bold text-primary d-block mb-1">
                            <i className="bi bi-info-circle me-1"></i>What it means
                          </small>
                          <p className="mb-0 small text-muted-brand">{field.whatItMeans}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 bg-white rounded border-start border-success border-3">
                          <small className="text-uppercase fw-bold text-success d-block mb-1">
                            <i className="bi bi-pencil me-1"></i>What to enter
                          </small>
                          <p className="mb-0 small text-dark fw-medium">{field.whatToEnter}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-light border rounded-3 p-4 text-center mb-0">
                <i className="bi bi-info-circle fs-3 text-muted mb-2 d-block"></i>
                <p className="text-muted mb-0 fw-medium">No fields detected on this uploaded form.</p>
              </div>
            )}
          </div>

          {/* 4. Important Instructions */}
          {importantInstructions.length > 0 && (
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
              <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
                <i className="bi bi-list-task me-2"></i>Important Instructions
              </h5>
              <ol className="mb-0 ps-3">
                {importantInstructions.map((inst, idx) => (
                  <li key={idx} className="mb-2 text-muted-brand">{inst}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Disclaimer */}
          <div className="alert border-0 rounded-4 py-3 px-4 shadow-sm" style={{ background: '#fef9ec' }}>
            <div className="d-flex align-items-start">
              <i className="bi bi-shield-exclamation text-warning fs-4 me-3 flex-shrink-0 mt-1"></i>
              <div>
                <strong className="text-dark small d-block mb-1">Independent Guidance Platform Disclaimer</strong>
                <small className="text-muted">
                  Form Saathi provides guidance based on document analysis. Always verify official submission requirements with the appropriate government department.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white position-sticky" style={{ top: '100px' }}>
            <h6 className="fw-bold mb-3">Form Guidance Actions</h6>

            <button
              className="btn btn-outline-brand w-100 py-3 mb-3 fw-medium rounded-pill"
              onClick={() => navigate('/ai-saathi', { state: { formName: formTitle } })}
            >
              <i className="bi bi-robot me-2"></i>Ask AI Saathi About This Form
            </button>

            <button
              className="btn-primary-brand w-100 py-3 mb-3 fw-bold shadow-sm"
              onClick={() => navigate('/find-form')}
            >
              <i className="bi bi-search me-2"></i>Explore Official Forms Catalogue
            </button>

            <div className="border-top pt-4 mt-2">
              <button
                className="btn btn-outline-secondary w-100 py-2 mb-2 rounded-pill small"
                onClick={handleAnalyzeAgain}
                disabled={!file}
              >
                <i className="bi bi-arrow-repeat me-2"></i>Re-analyze Uploaded File
              </button>

              <button
                className="btn btn-outline-secondary w-100 py-2 rounded-pill small"
                onClick={handleUploadAnother}
              >
                <i className="bi bi-upload me-2"></i>Upload Another Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Saathi Modal Panel when triggered */}
      {aiField && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050, maxWidth: '400px' }}>
          <AISaathiPanel
            formName={formTitle}
            sectionName="Uploaded Form Field Guidance"
            field={aiField}
            language={language}
            onClose={() => setAiField(null)}
          />
        </div>
      )}
    </div>
  );
};

export default FormAnalysis;
