import React from 'react';
import DocumentUploadField from './DocumentUploadField';

/**
 * FormField — dynamic field renderer for the Form Saathi filling experience.
 *
 * Props:
 *   field          – field definition object
 *   value          – current field value (string, File, or null)
 *   onChange       – (key, value) => void
 *   error          – validation error string | null
 *   prefillSource  – 'uploaded_form' | null (shows detected badge)
 *   onAskAI        – () => void  — opens AI panel for this field
 */
const FormField = ({ field, value, onChange, error, prefillSource, onAskAI }) => {
  const isPrefilled = prefillSource === 'uploaded_form';

  const labelEl = (
    <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
      <label className="fw-bold mb-0">
        {field.name}
        {field.required
          ? <span className="text-danger ms-1">*</span>
          : <span className="text-muted fw-normal ms-2 small">(Optional)</span>}
      </label>
      <button
        type="button"
        className="btn btn-sm btn-link text-primary-brand p-0 text-decoration-none small"
        onClick={onAskAI}
        title="Ask AI Saathi for help with this field"
      >
        <i className="bi bi-robot me-1"></i>Need help?
      </button>
    </div>
  );

  if (field.type === 'file') {
    return <DocumentUploadField field={field} value={value} onChange={onChange} />;
  }

  const inputClass = `form-control ${error ? 'is-invalid' : ''} ${isPrefilled ? 'border-success' : ''}`;

  let inputEl = null;

  switch (field.type) {
    case 'radio':
      inputEl = (
        <div className="d-flex flex-wrap gap-3 mt-1">
          {(field.options || []).map((opt) => (
            <div key={opt} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={field.key}
                id={`${field.key}_${opt}`}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(field.key, opt)}
              />
              <label className="form-check-label" htmlFor={`${field.key}_${opt}`}>{opt}</label>
            </div>
          ))}
        </div>
      );
      break;

    case 'select':
      inputEl = (
        <select
          className={inputClass}
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">— Select —</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
      break;

    case 'textarea':
      inputEl = (
        <textarea
          className={inputClass}
          rows={3}
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );
      break;

    case 'date':
      inputEl = (
        <input
          type="date"
          className={inputClass}
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );
      break;

    default:
      inputEl = (
        <input
          type={field.type === 'phone' ? 'tel' : field.type || 'text'}
          className={inputClass}
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );
  }

  return (
    <div className="mb-4">
      {labelEl}
      {field.description && (
        <p className="text-muted small mb-2">{field.description}</p>
      )}
      {inputEl}
      {isPrefilled && (
        <div className="text-success small mt-1">
          <i className="bi bi-check-circle-fill me-1"></i>Detected from uploaded form — please review and edit if needed.
        </div>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default FormField;
