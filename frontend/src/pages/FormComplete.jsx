import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { forms } from '../data/formData';

const GENERATION_STAGES = [
  'Preparing official form template...',
  'Mapping your information to official fields...',
  'Formatting document layout...',
  'Finalizing PDF output...',
];

const FormComplete = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { formValues = {}, formMeta = {}, analysisData = null, sections = [] } = location.state || {};

  const catalogForm = forms.find(f => f.id === parseInt(id, 10));

  const [status, setStatus]           = useState('idle');   // idle | generating | done | error
  const [stage, setStage]             = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [filename, setFilename]       = useState('Official-Form-Filled.pdf');
  const [errorMsg, setErrorMsg]       = useState('');

  const isUploadFlow = !!analysisData;

  // Start generation automatically on mount
  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      generateForm();
    }
  }, []); // eslint-disable-line

  const generateForm = async () => {
    setStatus('generating');
    setErrorMsg('');
    setDownloadUrl(null);

    // Cycle visual stages
    let si = 0;
    setStage(GENERATION_STAGES[si]);
    const stageTimer = setInterval(() => {
      si = Math.min(si + 1, GENERATION_STAGES.length - 1);
      setStage(GENERATION_STAGES[si]);
    }, 700);

    try {
      // Build payload — filter out File objects (can't serialize to JSON)
      const serializableValues = {};
      Object.entries(formValues).forEach(([k, v]) => {
        if (v instanceof File) {
          serializableValues[k] = `[Uploaded Document: ${v.name}]`;
        } else {
          serializableValues[k] = v;
        }
      });

      const payload = {
        formName: formMeta.name || 'Official Form',
        formId: id || 'upload',
        sections: sections.map(sec => ({
          name: sec.name,
          fields: sec.fields
            .filter(f => f.type !== 'file')
            .map(f => ({
              label: f.name,
              key: f.key,
              value: serializableValues[f.key] || '',
            }))
        }))
      };

      const response = await axios.post('http://localhost:8000/api/forms/generate', payload, {
        responseType: 'blob',
        timeout: 30000,
      });

      clearInterval(stageTimer);

      // Create download URL from blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const rawName = formMeta.name || 'Official-Form';
      const safeFormName = rawName.replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '-');

      setDownloadUrl(url);
      setFilename(`${safeFormName}-Filled.pdf`);
      setStatus('done');

      // Save to My Forms (Local Storage)
      try {
        const stored = localStorage.getItem('formSaathi_myForms');
        let myForms = stored ? JSON.parse(stored) : [];
        const newForm = {
          id: id || 'upload',
          name: formMeta.name || 'Official Form',
          status: 'Completed',
          updatedAt: new Date().toISOString(),
          values: formValues,
          analysisData: analysisData
        };
        myForms = myForms.filter(f => f.id !== newForm.id);
        myForms.unshift(newForm);
        localStorage.setItem('formSaathi_myForms', JSON.stringify(myForms));
      } catch(e) {
        console.error("Failed to save to my forms", e);
      }
    } catch (err) {
      clearInterval(stageTimer);
      console.error(err);
      setErrorMsg('Something went wrong while preparing your official form. Please try again.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!downloadUrl) return;
    window.open(downloadUrl, '_blank');
  };

  /* ── Generating state ────────────────────────────────── */
  if (status === 'generating') {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <div className="spinner-border text-primary-brand mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
            <span className="visually-hidden">Preparing Official Form...</span>
          </div>
          <h3 className="fw-bold mb-3">Preparing Official Form...</h3>
          <p className="text-muted-brand lead">{stage}</p>
          <p className="text-muted small mt-3">{formMeta.name}</p>
        </div>
      </div>
    );
  }

  /* ── Error state ─────────────────────────────────────── */
  if (status === 'error') {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-exclamation-triangle-fill display-1 text-warning mb-4 d-block"></i>
          <h3 className="fw-bold mb-3">Form Preparation Failed</h3>
          <p className="text-muted-brand mb-4">{errorMsg}</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i>Back to Review
            </button>
            <button className="btn-primary-brand px-4" onClick={generateForm}>
              <i className="bi bi-arrow-repeat me-2"></i>Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Idle (no data) ──────────────────────────────────── */
  if (status === 'idle' && Object.keys(formValues).length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">No form data found.</h3>
        <button className="btn-primary-brand mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  /* ── Done ────────────────────────────────────────────── */
  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </li>
          <li className="breadcrumb-item active">Official Form Ready</li>
        </ol>
      </nav>

      {/* Success header */}
      <div className="text-center mb-5">
        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
          <i className="bi bi-check-lg" style={{ fontSize: '2.5rem' }}></i>
        </div>

        <h1 className="fw-bold mb-2">Official Form Ready!</h1>
        <p className="lead text-muted-brand mb-1">Your official application document has been generated with your details.</p>
        <p className="text-muted fw-bold">{formMeta.name}</p>
      </div>

      {/* Download card */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-7">
          <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white text-center">
            <div className="text-danger mb-3">
              <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '4rem' }}></i>
            </div>
            <h5 className="fw-bold mb-1">{filename}</h5>
            <p className="text-muted small mb-4">Your official form is ready to download and print.</p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4">
              <button className="btn-primary-brand px-4 py-3 fw-bold shadow-sm" onClick={handleDownload}>
                <i className="bi bi-download me-2"></i>Download Official PDF
              </button>
              <button className="btn btn-outline-brand px-4 py-3 fw-medium" onClick={handlePrint}>
                <i className="bi bi-printer me-2"></i>Print Official Form
              </button>
            </div>

            {catalogForm?.officialSourceUrl && (
              <a
                href={catalogForm.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-pill text-decoration-none d-inline-flex align-items-center justify-content-center mx-auto px-4 py-2"
              >
                <i className="bi bi-globe2 me-2"></i>View Official Source Portal
              </a>
            )}
          </div>

          {/* Important notice */}
          <div className="alert alert-info border-0 rounded-4 mt-4 d-flex align-items-start shadow-sm">
            <i className="bi bi-info-circle-fill fs-5 me-3 flex-shrink-0 mt-1"></i>
            <div className="small">
              <strong>Submission Guidance:</strong>
              <div className="mt-1">
                Please review and sign the printed form before submitting it along with your supporting documents (Aadhaar, address proof) to the nearest designated MeeSeva centre, Tahsildar office, or local municipal authority.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="d-flex flex-wrap justify-content-center gap-3">
        <button
          className="btn btn-outline-secondary rounded-pill px-4 py-2"
          onClick={() => navigate(isUploadFlow ? '/form/upload/review' : `/form/${id}/review`, { state: { formValues, formMeta, analysisData, sections } })}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Review
        </button>
        <button
          className="btn btn-outline-brand px-4 py-2"
          onClick={generateForm}
        >
          <i className="bi bi-arrow-repeat me-2"></i>Regenerate Form
        </button>
        <button className="btn-primary-brand px-4 py-2" onClick={() => navigate('/dashboard')}>
          <i className="bi bi-house me-2"></i>Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FormComplete;
