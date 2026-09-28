import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyFormsPage = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('formSaathi_myForms');
      if (stored) {
        setForms(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load my forms', e);
    }
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">My Forms</h2>
        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-file-earmark-text display-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold">No forms yet</h4>
          <p className="text-muted-brand mb-4">You haven't started or completed any forms recently.</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn-primary-brand" onClick={() => navigate('/find-form')}>Find a Form</button>
            <button className="btn btn-outline-brand" onClick={() => navigate('/upload-form')}>Upload a Form</button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {forms.map((form, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 feature-card p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="icon-wrapper bg-secondary-brand text-primary-brand mb-0">
                    <i className="bi bi-file-earmark-check"></i>
                  </div>
                  <span className={`badge ${form.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {form.status}
                  </span>
                </div>
                <h5 className="fw-bold mb-1">{form.name}</h5>
                <p className="text-muted small mb-3">Updated: {new Date(form.updatedAt).toLocaleDateString()}</p>
                <div className="mt-auto pt-3 border-top">
                  <button className="btn btn-sm btn-outline-brand w-100 rounded-pill" onClick={() => {
                      if(form.id === 'upload') {
                          navigate('/form/upload/fill', { state: { formValues: form.values, formMeta: {name: form.name, id: 'upload'}, analysisData: form.analysisData, startSection: 0 } });
                      } else {
                          navigate(`/form/${form.id}/fill`, { state: { formValues: form.values, formMeta: {name: form.name, id: form.id}, startSection: 0 } });
                      }
                  }}>
                    {form.status === 'Completed' ? 'View / Edit Again' : 'Continue Filling'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFormsPage;
