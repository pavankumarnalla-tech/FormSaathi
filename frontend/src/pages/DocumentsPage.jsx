import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('formSaathi_myForms');
      if (stored) {
        const forms = JSON.parse(stored);
        const docs = [];
        forms.forEach(form => {
           if(form.values) {
              Object.entries(form.values).forEach(([key, val]) => {
                  if (typeof val === 'string' && val.startsWith('[Document:')) {
                      docs.append({ formName: form.name, docName: val.replace('[Document: ', '').replace(']', '') });
                  } else if (val && val.name && val.size !== undefined) {
                      docs.push({ formName: form.name, docName: val.name });
                  }
              });
           }
        });
        // Since File objects turn into {} in JSON, we might not have much here unless we modify storage. 
        // For MVP, we will just show a static message if no docs.
      }
    } catch(e) { }
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">My Documents</h2>
        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      <div className="text-center py-5 bg-white rounded-4 shadow-sm">
        <i className="bi bi-folder2-open display-1 text-muted mb-3 d-block"></i>
        <h4 className="fw-bold">Supporting Documents</h4>
        <p className="text-muted-brand mb-4">
          Documents you upload while filling out forms will be securely attached to your forms.
        </p>
      </div>
    </div>
  );
};

export default DocumentsPage;
