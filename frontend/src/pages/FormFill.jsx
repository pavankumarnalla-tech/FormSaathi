import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { forms } from '../data/formData';
import { formFillDefinitions, defaultSections, mapAnalysisToFillSections } from '../data/formFillDefinitions';
import FormField from '../components/FormField';
import AISaathiPanel from '../components/AISaathiPanel';

/* ─────────────────────────────────────────────────────────
   Validation helpers
───────────────────────────────────────────────────────── */
const validateSection = (fields, formValues) => {
  const errors = {};
  fields.forEach((f) => {
    if (f.type === 'file') return; // file validation is handled in DocumentUploadField
    const val = formValues[f.key] || '';
    if (f.required && !val.toString().trim()) {
      errors[f.key] = `${f.name} is required.`;
      return;
    }
    if (val && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errors[f.key] = 'Please enter a valid email address.';
    }
    if (val && f.type === 'tel' && !/^\d{10}$/.test(val.replace(/\s/g, ''))) {
      errors[f.key] = 'Please enter a valid 10-digit mobile number.';
    }
    if (val && f.type === 'number' && isNaN(Number(val))) {
      errors[f.key] = 'Please enter a valid number.';
    }
  });
  return errors;
};

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
const FormFill = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ── Resolve source ──────────────────────────────────────
  // source = 'find' (Find a Form flow) or 'upload' (Upload flow via FormAnalysis)
  const analysisData = location.state?.analysisData || null; // passed from FormAnalysis
  const isUploadFlow = !!analysisData;

  // Resolve form meta
  const formMeta = isUploadFlow
    ? { id: 'upload', name: analysisData?.formSummary?.name || 'Uploaded Form', categoryName: '' }
    : forms.find((f) => f.id === parseInt(id, 10));

  // Resolve sections
  const rawSections = isUploadFlow
    ? mapAnalysisToFillSections(analysisData.sections)
    : (formFillDefinitions[parseInt(id, 10)]?.sections || defaultSections(formMeta?.name));

  // ── State ───────────────────────────────────────────────
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [formValues, setFormValues] = useState(() => {
    // Initialise: prefill detected values from upload flow
    const init = {};
    rawSections.forEach((section) => {
      section.fields.forEach((f) => {
        init[f.key] = f.prefillValue || '';
      });
    });
    return init;
  });
  const [prefillSources, setPrefillSources] = useState(() => {
    const init = {};
    rawSections.forEach((section) => {
      section.fields.forEach((f) => {
        if (f.prefillSource) init[f.key] = f.prefillSource;
      });
    });
    return init;
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [aiField, setAiField] = useState(null); // field object currently receiving AI help
  const language = localStorage.getItem('formSaathiLanguage') || 'English';

  // ── If form not found (find-form flow with bad id) ──────
  if (!formMeta) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-file-earmark-x display-1 text-muted"></i>
        <h3 className="fw-bold mt-4">Form not found</h3>
        <button className="btn-primary-brand mt-4" onClick={() => navigate('/find-form')}>
          Back to Find a Form
        </button>
      </div>
    );
  }

  const currentSection = rawSections[currentSectionIdx];
  const totalSections = rawSections.length;
  const isLastSection = currentSectionIdx === totalSections - 1;

  // ── Handlers ────────────────────────────────────────────
  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    // Clear error when user types
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleNext = () => {
    const errors = validateSection(currentSection.fields, formValues);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      document.getElementById(`field_${firstErrorKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFieldErrors({});
    if (isLastSection) {
      navigate(`/form/${id || 'upload'}/validation`, { state: { formValues, formMeta, analysisData } });
    } else {
      setCurrentSectionIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </li>
          {isUploadFlow
            ? <li className="breadcrumb-item"><button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate(-2)}>Form Analysis</button></li>
            : <li className="breadcrumb-item"><button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate(`/form/${id}`)}>Form Info</button></li>
          }
          <li className="breadcrumb-item active">Fill Form</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-secondary-brand text-primary-brand rounded-pill px-3 py-2 mb-2">
          <i className="bi bi-robot me-1"></i>Form Saathi — Guided Filling
        </span>
        <h1 className="fw-bold mb-1">{formMeta.name}</h1>
        <p className="text-muted-brand">Answer simple questions — Form Saathi will guide you step by step.</p>
        {isUploadFlow && (
          <div className="alert alert-info border-0 rounded-3 py-2 px-3 small d-inline-block mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Fields detected from your uploaded form have been pre-filled. Please review them carefully before continuing.
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold text-primary-brand">
            Step {currentSectionIdx + 1} of {totalSections}: {currentSection.name}
          </span>
          <span className="text-muted small">{Math.round(((currentSectionIdx + 1) / totalSections) * 100)}% complete</span>
        </div>
        <div className="progress rounded-pill" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-primary-brand"
            style={{ width: `${((currentSectionIdx + 1) / totalSections) * 100}%`, transition: 'width 0.4s ease' }}
          />
        </div>
        {/* Section breadcrumb trail */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {rawSections.map((sec, i) => (
            <span
              key={i}
              className={`badge rounded-pill px-3 py-2 ${
                i < currentSectionIdx ? 'bg-success text-white' :
                i === currentSectionIdx ? 'bg-primary-brand text-white' : 'bg-light text-muted'
              }`}
            >
              {i < currentSectionIdx && <i className="bi bi-check-circle me-1"></i>}
              {sec.name}
            </span>
          ))}
        </div>
      </div>

      {/* Two-column layout: Form | AI Saathi */}
      <div className="row g-4 align-items-start">
        {/* Main form column */}
        <div className={aiField ? 'col-lg-7' : 'col-lg-9'}>
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white">
            <h4 className="fw-bold mb-1">{currentSection.name}</h4>
            <p className="text-muted-brand mb-4 small">
              Fill in all required fields marked with <span className="text-danger">*</span>
            </p>

            {currentSection.fields.map((field) => (
              <div key={field.key} id={`field_${field.key}`}>
                <FormField
                  field={field}
                  value={formValues[field.key]}
                  onChange={handleChange}
                  error={fieldErrors[field.key]}
                  prefillSource={prefillSources[field.key]}
                  onAskAI={() => setAiField(field)}
                />
              </div>
            ))}

            {/* Navigation buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                onClick={handleBack}
                disabled={currentSectionIdx === 0}
              >
                <i className="bi bi-arrow-left me-2"></i>Back
              </button>
              <button
                type="button"
                className="btn-primary-brand px-5 py-2 fw-bold"
                onClick={handleNext}
              >
                {isLastSection ? <>Continue <i className="bi bi-arrow-right ms-2"></i></> : <>Save & Continue <i className="bi bi-arrow-right ms-2"></i></>}
              </button>
            </div>
          </div>
        </div>

        {/* AI Saathi panel */}
        <div className="col-lg-3 d-none d-lg-block" style={{ position: 'sticky', top: '100px' }}>
          {aiField ? (
            <AISaathiPanel
              formName={formMeta.name}
              sectionName={currentSection.name}
              field={aiField}
              language={language}
              onClose={() => setAiField(null)}
            />
          ) : (
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-light text-center">
              <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-robot fs-4"></i>
              </div>
              <h6 className="fw-bold mb-2">AI Saathi</h6>
              <p className="text-muted small mb-0">
                Click <strong>"Need help?"</strong> next to any field to get a simple explanation from AI Saathi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile AI Saathi modal trigger */}
      {aiField && (
        <div className="d-lg-none position-fixed bottom-0 start-0 end-0 p-3 bg-white shadow-lg border-top" style={{ zIndex: 1050 }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-bold"><i className="bi bi-robot me-2 text-primary-brand"></i>AI Saathi</span>
            <button className="btn btn-sm btn-link text-muted" onClick={() => setAiField(null)}>Close</button>
          </div>
          <AISaathiPanel
            formName={formMeta.name}
            sectionName={currentSection.name}
            field={aiField}
            language={language}
            onClose={() => setAiField(null)}
          />
        </div>
      )}

    </div>
  );
};

export default FormFill;
