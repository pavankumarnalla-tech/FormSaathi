import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { forms } from '../data/formData';
import AISaathiPanel from '../components/AISaathiPanel';
import API_BASE from '../api/config';

const FormInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = forms.find((f) => f.id === parseInt(id, 10));

  const [aiField, setAiField] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [fieldsGuidance, setFieldsGuidance] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [loadingGuidance, setLoadingGuidance] = useState(true);
  const getLanguageName = (code) => {
    if (code === 'te' || code === 'Telugu') return 'Telugu';
    if (code === 'hi' || code === 'Hindi') return 'Hindi';
    return 'English';
  };
  const rawLanguage = localStorage.getItem('formSaathiLanguage') || 'en';
  const language = getLanguageName(rawLanguage);

  // Check if form is saved in localStorage
  useEffect(() => {
    if (!form) return;
    try {
      const stored = localStorage.getItem('formSaathi_savedForms');
      if (stored) {
        const savedList = JSON.parse(stored);
        setIsSaved(savedList.some((f) => f.id === form.id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [form]);

  // Fetch dynamic form guidance from backend
  useEffect(() => {
    if (!form) return;
    let isMounted = true;
    setLoadingGuidance(true);

    const fetchGuidance = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/forms/guidance`, {
          formId: form.id,
          formName: form.name,
          department: form.department || '',
          purpose: form.purpose || '',
          localPdfPath: form.localPdfPath || null,
          language: language,
        }, { timeout: 15000 });

        if (isMounted && res.data) {
          setFieldsGuidance(res.data.fields || []);
          setRequiredDocuments(res.data.requiredDocuments || []);
        }
      } catch (err) {
        console.error('Failed to fetch guidance:', err);
        if (isMounted) {
          setFieldsGuidance([]);
          setRequiredDocuments([]);
        }
      } finally {
        if (isMounted) setLoadingGuidance(false);
      }
    };

    fetchGuidance();

    return () => { isMounted = false; };
  }, [form, language]);

  const toggleSaveForm = () => {
    if (!form) return;
    try {
      const stored = localStorage.getItem('formSaathi_savedForms');
      let savedList = stored ? JSON.parse(stored) : [];
      if (isSaved) {
        savedList = savedList.filter((f) => f.id !== form.id);
        setIsSaved(false);
      } else {
        savedList.unshift({
          id: form.id,
          name: form.name,
          department: form.department,
          categoryName: form.categoryName,
          officialSourceUrl: form.officialSourceUrl,
          savedAt: new Date().toISOString(),
        });
        setIsSaved(true);
      }
      localStorage.setItem('formSaathi_savedForms', JSON.stringify(savedList));
    } catch (e) {
      console.error(e);
    }
  };

  if (!form) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-file-earmark-x display-1 text-muted mb-4 d-inline-block"></i>
          <h2 className="fw-bold mb-3">Form or Service Not Found</h2>
          <p className="text-muted-brand lead mb-4">We couldn't find the requested government form or service.</p>
          <button className="btn-primary-brand" onClick={() => navigate('/find-form')}>
            Back to Find a Form
          </button>
        </div>
      </div>
    );
  }

  // ISSUE 1 FIX: Official Links & PDF serving
  const officialSourceUrl = form.officialSourceUrl || form.officialApplicationUrl || 'https://ts.meeseva.telangana.gov.in/TSDeptPortal/Meeseva-Applications.html';
  const hasLocalPdf = !!form.localPdfPath;
  const rawPdfUrl = hasLocalPdf ? `${API_BASE}/api/forms/raw-pdf/${form.localPdfPath}` : null;

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
          <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '250px' }}>
            {form.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-start">
          <button className="btn btn-link text-muted p-0 me-3 text-decoration-none mt-1" onClick={() => navigate('/find-form')}>
            <i className="bi bi-arrow-left fs-4"></i>
          </button>
          <div>
            <div className="d-flex flex-wrap gap-2 mb-2">
              <span className="badge rounded-pill bg-primary-brand text-white px-3 py-2 fw-medium">
                <i className="bi bi-info-circle me-1"></i>Official Guidance & Information
              </span>
              <span className="badge rounded-pill bg-info text-dark px-3 py-2 fw-medium">
                {form.governmentLevel || 'TELANGANA'}
              </span>
            </div>
            <h1 className="fw-bold mb-1">{form.name}</h1>
            <p className="text-muted small mb-0">
              <i className="bi bi-building me-1"></i>{form.department} · {form.ministry}
            </p>
          </div>
        </div>

        {/* Save / Bookmark Button */}
        <button
          className={`btn ${isSaved ? 'btn-success' : 'btn-outline-brand'} rounded-pill px-4 py-2 fw-medium flex-shrink-0`}
          onClick={toggleSaveForm}
        >
          <i className={`bi ${isSaved ? 'bi-bookmark-check-fill' : 'bi-bookmark'} me-2`}></i>
          {isSaved ? 'Form Saved' : 'Save to My Forms'}
        </button>
      </div>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">

          {/* 1. About This Form */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-file-earmark-text me-2"></i>About This Form
            </h5>
            <p className="lead mb-4">{form.shortDescription || form.purpose}</p>
            <h6 className="fw-bold text-dark mb-2">Primary Purpose</h6>
            <p className="text-muted-brand mb-0">{form.purpose}</p>
          </div>

          {/* 2. Who Can Apply? (Eligibility) */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-person-check me-2"></i>Who Can Apply?
            </h5>
            {form.eligibility ? (
              <p className="text-muted-brand mb-0">{form.eligibility}</p>
            ) : (
              <p className="text-muted fst-italic mb-0">
                <i className="bi bi-info-circle me-2"></i>Eligibility information is not available in the current official source.
              </p>
            )}
          </div>

          {/* 3. What You Need (Required Documents) */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
              <i className="bi bi-folder-check me-2"></i>What You Need (Required Documents)
            </h5>
            {loadingGuidance ? (
              <div className="py-2">
                <div className="spinner-border spinner-border-sm text-primary-brand me-2" role="status"></div>
                <span className="text-muted small">Loading required documents...</span>
              </div>
            ) : requiredDocuments && requiredDocuments.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="mb-3 d-flex align-items-start">
                    <i className="bi bi-check-circle-fill text-success me-3 mt-1 fs-5"></i>
                    <span className="text-dark fw-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted fst-italic mb-0">
                <i className="bi bi-info-circle me-2"></i>Required document information is unavailable for this form.
              </p>
            )}
          </div>

          {/* 4. Field-by-Field Guidance (ISSUE 2 FIX — DYNAMIC & CACHED) */}
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
              <div>
                <h5 className="fw-bold text-primary-brand mb-1">
                  <i className="bi bi-card-checklist me-2"></i>Field-by-Field Guidance
                </h5>
                <p className="text-muted small mb-0">Form-specific guidance extracted from the official form.</p>
              </div>
              {!loadingGuidance && fieldsGuidance.length > 0 && (
                <span className="badge bg-secondary-brand text-primary-brand rounded-pill px-3 py-2">
                  {fieldsGuidance.length} Fields Analyzed
                </span>
              )}
            </div>

            {loadingGuidance ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary-brand mb-3" role="status"></div>
                <p className="text-muted small mb-0">Analyzing form details and loading guidance...</p>
              </div>
            ) : fieldsGuidance.length > 0 ? (
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
                <p className="text-muted mb-0 fw-medium">Detailed field guidance is unavailable for this form.</p>
              </div>
            )}
          </div>

          {/* 5. Important Instructions */}
          {form.instructions && form.instructions.length > 0 && (
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 mb-4 bg-white">
              <h5 className="fw-bold text-primary-brand border-bottom pb-3 mb-4">
                <i className="bi bi-list-task me-2"></i>Important Instructions
              </h5>
              <ol className="mb-0 ps-3">
                {form.instructions.map((inst, idx) => (
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
                <strong className="text-dark small d-block mb-1">Independent Assistance Platform Disclaimer</strong>
                <small className="text-muted">
                  Form Saathi is an independent assistance platform that provides guidance and explanations. Always verify requirements and submit official application forms through the official government portal or designated authority.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white position-sticky" style={{ top: '100px' }}>

            {/* Prominent Official Source CTA (ISSUE 1 FIX) */}
            <h6 className="fw-bold mb-3">Official Application Source</h6>
            <a
              href={officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-brand w-100 py-3 mb-3 fw-bold shadow-sm d-flex align-items-center justify-content-center text-decoration-none"
            >
              <i className="bi bi-box-arrow-up-right me-2"></i>Open Official Source
            </a>

            {/* View / Download Official Form (ISSUE 1 FIX) */}
            {rawPdfUrl ? (
              <a
                href={rawPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-brand w-100 py-3 mb-3 fw-bold rounded-pill text-decoration-none d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>View / Download Official Form
              </a>
            ) : (
              <div className="alert alert-secondary text-center small py-2 px-3 mb-3 rounded-pill">
                <i className="bi bi-file-earmark-x me-2"></i>Official form PDF unavailable
              </div>
            )}

            {/* Quick Facts */}
            <div className="border-top pt-4 mt-2">
              <h6 className="fw-bold mb-4">Service Quick Facts</h6>

              <div className="mb-3">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-building me-2"></i>Department
                </div>
                <p className="mb-0 fw-medium small">{form.department || 'Government Department'}</p>
              </div>

              <div className="mb-3">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-cash me-2"></i>Prescribed Fee
                </div>
                <p className="mb-0 fw-medium small">{form.fee || 'As prescribed by official portal'}</p>
              </div>

              <div className="mb-3">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-geo-alt me-2"></i>Where to Apply / Submit
                </div>
                <p className="mb-0 fw-medium small">{form.whereToApply || 'Nearest MeeSeva Centre or official government portal'}</p>
              </div>

              <div>
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="bi bi-calendar-check me-2"></i>Last Source Verification
                </div>
                <p className="mb-0 fw-medium small">{form.lastVerified || '2026-09-29'}</p>
              </div>
            </div>

            {/* AI Assistant helper trigger */}
            <div className="border-top pt-4 mt-4 text-center">
              <div className="bg-light rounded-4 p-3">
                <i className="bi bi-robot fs-3 text-primary-brand mb-2 d-block"></i>
                <h6 className="fw-bold mb-1">Have Questions?</h6>
                <p className="text-muted small mb-3">Ask AI Saathi about document requirements or form instructions.</p>
                <button
                  className="btn btn-sm btn-outline-brand rounded-pill w-100 py-2"
                  onClick={() => navigate('/ai-saathi', { state: { formName: form.name } })}
                >
                  Chat with AI Saathi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Saathi Modal Panel when triggered */}
      {aiField && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050, maxWidth: '400px' }}>
          <AISaathiPanel
            formName={form.name}
            sectionName="Form Field Guidance"
            field={aiField}
            language={language}
            onClose={() => setAiField(null)}
          />
        </div>
      )}
    </div>
  );
};

export default FormInformation;
