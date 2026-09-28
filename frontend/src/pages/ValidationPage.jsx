import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formFillDefinitions, mapAnalysisToFillSections } from '../data/formFillDefinitions';

/* ─────────────────────────────────────────────────────────
   Run full validation across ALL sections and ALL fields
───────────────────────────────────────────────────────── */
const runFullValidation = (sections, formValues) => {
  const issues = [];

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'file') {
        // Check required documents
        const uploaded = formValues[field.key];
        if (field.required && !uploaded) {
          issues.push({
            key: field.key,
            sectionName: section.name,
            fieldName: field.name,
            type: 'document',
            message: 'This document is required.',
          });
        }
        return;
      }

      const val = (formValues[field.key] || '').toString().trim();

      if (field.required && !val) {
        issues.push({
          key: field.key,
          sectionName: section.name,
          fieldName: field.name,
          type: 'required',
          message: 'Required information is missing.',
        });
        return;
      }

      if (val) {
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          issues.push({ key: field.key, sectionName: section.name, fieldName: field.name, type: 'format', message: 'Please enter a valid email address.' });
        }
        if (field.type === 'tel' && !/^\d{10}$/.test(val.replace(/\s/g, ''))) {
          issues.push({ key: field.key, sectionName: section.name, fieldName: field.name, type: 'format', message: 'Please enter a valid 10-digit mobile number.' });
        }
        if (field.type === 'number' && isNaN(Number(val))) {
          issues.push({ key: field.key, sectionName: section.name, fieldName: field.name, type: 'format', message: 'Please enter a valid number.' });
        }
        if (field.type === 'date' && isNaN(new Date(val).getTime()) && !/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
          issues.push({ key: field.key, sectionName: section.name, fieldName: field.name, type: 'format', message: 'Please enter a valid date.' });
        }
      }
    });
  });

  return issues;
};

/* ─────────────────────────────────────────────────────────
   Validation Page Component
───────────────────────────────────────────────────────── */
const ValidationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { formValues = {}, formMeta = {}, analysisData = null, returnSection = null } = location.state || {};

  // If arrived here with no form data, bounce back
  if (!formValues || Object.keys(formValues).length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle display-1 text-muted"></i>
        <h3 className="fw-bold mt-4">No form data found.</h3>
        <p className="text-muted-brand">Please fill the form first.</p>
        <button className="btn-primary-brand mt-3" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Reconstruct the sections (same logic as FormFill)
  const isUploadFlow = !!analysisData;
  const sections = isUploadFlow
    ? mapAnalysisToFillSections(analysisData.sections)
    : (formFillDefinitions[parseInt(id, 10)]?.sections || []);

  const issues = useMemo(() => runFullValidation(sections, formValues), [sections, formValues]);

  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0);
  const docFields = sections.reduce((acc, s) => acc + s.fields.filter(f => f.type === 'file').length, 0);
  const completedDocs = sections.reduce((acc, s) => acc + s.fields.filter(f => f.type === 'file' && formValues[f.key]).length, 0);
  const completedNonDoc = sections.reduce((acc, s) => acc + s.fields.filter(f => f.type !== 'file' && (formValues[f.key] || '').toString().trim()).length, 0);
  const hasIssues = issues.length > 0;

  const handleGoToField = (issue) => {
    // Find which section index this field belongs to
    const sectionIdx = sections.findIndex(s => s.fields.some(f => f.key === issue.key));
    navigate(isUploadFlow ? '/form/upload/fill' : `/form/${id}/fill`, {
      state: {
        formValues,
        formMeta,
        analysisData,
        startSection: sectionIdx >= 0 ? sectionIdx : 0,
      }
    });
  };

  const handleProceedToReview = () => {
    navigate(isUploadFlow ? '/form/upload/review' : `/form/${id}/review`, {
      state: { formValues, formMeta, analysisData, sections }
    });
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
              onClick={() => navigate(isUploadFlow ? '/form/upload/fill' : `/form/${id}/fill`, { state: { formValues, formMeta, analysisData } })}>
              Fill Form
            </button>
          </li>
          <li className="breadcrumb-item active">Validation</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-5">
        <h1 className="fw-bold mb-2">Form Check</h1>
        <p className="lead text-muted-brand">{formMeta.name}</p>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-5">
        <div className="col-sm-4">
          <div className="card border-0 rounded-4 shadow-sm p-4 text-center bg-white h-100">
            <div className="fs-1 fw-bold text-primary-brand">{completedNonDoc}</div>
            <div className="text-muted small mt-1">Fields Completed</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className={`card border-0 rounded-4 shadow-sm p-4 text-center h-100 ${hasIssues ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
            <div className={`fs-1 fw-bold ${hasIssues ? 'text-warning' : 'text-success'}`}>{issues.length}</div>
            <div className="text-muted small mt-1">{hasIssues ? 'Need Attention' : 'All Good!'}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card border-0 rounded-4 shadow-sm p-4 text-center bg-white h-100">
            <div className="fs-1 fw-bold text-success">{completedDocs} / {docFields}</div>
            <div className="text-muted small mt-1">Documents Uploaded</div>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {hasIssues ? (
        <div className="alert alert-warning border-0 rounded-4 d-flex align-items-start mb-5 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-3 flex-shrink-0 mt-1"></i>
          <div>
            <strong>{issues.length} item{issues.length > 1 ? 's' : ''} need{issues.length === 1 ? 's' : ''} your attention.</strong>
            <div className="mt-1 small">Please fix the highlighted items before proceeding to review.</div>
          </div>
        </div>
      ) : (
        <div className="alert alert-success border-0 rounded-4 d-flex align-items-center mb-5 shadow-sm">
          <i className="bi bi-check-circle-fill fs-4 me-3"></i>
          <div>
            <strong>Your information looks complete!</strong>
            <div className="mt-1 small">You can now proceed to the final review.</div>
          </div>
        </div>
      )}

      {/* Issues list */}
      {hasIssues && (
        <div className="card border-0 rounded-4 shadow-sm bg-white mb-5">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Items Needing Attention</h5>
            <div className="d-flex flex-column gap-3">
              {issues.map((issue, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {issue.type === 'document'
                        ? <i className="bi bi-folder-x text-warning"></i>
                        : issue.type === 'format'
                        ? <i className="bi bi-exclamation-circle text-warning"></i>
                        : <i className="bi bi-x-circle text-danger"></i>}
                      <strong>{issue.fieldName}</strong>
                      <span className="badge bg-light text-muted border small">{issue.sectionName}</span>
                    </div>
                    <div className="text-muted small">{issue.message}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-brand rounded-pill px-3 flex-shrink-0 ms-3"
                    onClick={() => handleGoToField(issue)}
                  >
                    Edit <i className="bi bi-pencil ms-1"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sections overview */}
      <div className="card border-0 rounded-4 shadow-sm bg-white mb-5">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Information Overview</h5>
          <div className="row g-3">
            {sections.map((section, si) => {
              const sectionIssues = issues.filter(i => i.sectionName === section.name).length;
              return (
                <div key={si} className="col-md-6">
                  <div className={`p-3 rounded-3 border ${sectionIssues > 0 ? 'border-warning bg-warning bg-opacity-10' : 'border-success bg-success bg-opacity-10'}`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold">{section.name}</span>
                      {sectionIssues > 0
                        ? <span className="badge bg-warning text-dark">{sectionIssues} issue{sectionIssues > 1 ? 's' : ''}</span>
                        : <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Complete</span>}
                    </div>
                    <div className="text-muted small mt-1">{section.fields.length} field{section.fields.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
        <button
          className="btn btn-outline-secondary rounded-pill px-4 py-2"
          onClick={() => navigate(isUploadFlow ? '/form/upload/fill' : `/form/${id}/fill`, { state: { formValues, formMeta, analysisData } })}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Form
        </button>
        <button
          className="btn-primary-brand px-5 py-2 fw-bold"
          onClick={handleProceedToReview}
        >
          {hasIssues ? 'Review Anyway' : 'Proceed to Review'} <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  );
};

export default ValidationPage;
