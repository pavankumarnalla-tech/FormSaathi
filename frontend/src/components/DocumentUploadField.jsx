import React, { useState, useRef } from 'react';

const MAX_SIZE_MB = 10;
const SUPPORTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * DocumentUploadField — renders a compact file-picker for supporting documents.
 *
 * Props:
 *   field        – field definition { name, key, required, description, docLabel }
 *   value        – current file | null
 *   onChange     – (key, file) => void
 */
const DocumentUploadField = ({ field, value, onChange }) => {
  const [error, setError] = useState(null);
  const ref = useRef(null);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setError(null);
    if (!SUPPORTED_TYPES.includes(selected.type)) {
      setError('Unsupported file type. Please upload PDF, JPG, or PNG.');
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds the ${MAX_SIZE_MB} MB limit.`);
      return;
    }
    onChange(field.key, selected);
  };

  const handleRemove = () => {
    onChange(field.key, null);
    if (ref.current) ref.current.value = '';
  };

  return (
    <div className="mb-4">
      <label className="fw-bold mb-1 d-block">
        {field.docLabel || field.name}
        {field.required
          ? <span className="text-danger ms-1">*</span>
          : <span className="text-muted fw-normal ms-2 small">(Optional)</span>}
      </label>
      <p className="text-muted small mb-2">{field.description}</p>

      {!value ? (
        <>
          <input type="file" ref={ref} accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFile} />
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => ref.current?.click()}
          >
            <i className="bi bi-upload me-2"></i> Upload Document
          </button>
          <p className="text-muted small mt-2 mb-0">PDF, JPG, PNG — max {MAX_SIZE_MB} MB</p>
        </>
      ) : (
        <div className="d-flex align-items-center gap-3 bg-light rounded-3 p-3">
          <i className={`bi ${value.type === 'application/pdf' ? 'bi-file-earmark-pdf-fill text-danger' : 'bi-file-image text-primary-brand'} fs-3`}></i>
          <div className="flex-grow-1">
            <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{value.name}</div>
            <div className="text-muted small">{(value.size / 1024).toFixed(1)} KB</div>
          </div>
          <button type="button" className="btn btn-sm btn-outline-danger rounded-pill" onClick={handleRemove}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )}

      {error && <div className="text-danger small mt-2"><i className="bi bi-exclamation-circle me-1"></i>{error}</div>}

      {/* Privacy note */}
      <p className="text-muted small mt-2 mb-0 fst-italic">
        <i className="bi bi-shield-lock me-1"></i>
        Your documents may contain personal information. Upload only what is needed for this form.
      </p>
    </div>
  );
};

export default DocumentUploadField;
