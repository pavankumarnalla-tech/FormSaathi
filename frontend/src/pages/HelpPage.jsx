import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">Help & Support</h2>
        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      <div className="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5">
        <h4 className="fw-bold mb-4 text-primary-brand">How to use Form Saathi</h4>
        
        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-search me-2 text-primary-brand"></i>Find a Form</h5>
          <p className="text-muted-brand">
            Use the "Find a Form" section to explore our catalogue of official government forms.
            For each form, you will find detailed guidance on its purpose, eligibility criteria, required documents, and a field-by-field breakdown explaining exactly what you need to enter.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-upload me-2 text-primary-brand"></i>Upload a Form</h5>
          <p className="text-muted-brand">
            Have a blank PDF or scanned form from a government office? Upload it to Form Saathi.
            Our AI will analyze the document and automatically extract the fields, providing you with a clean, user-friendly guide on how to complete it.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-robot me-2 text-primary-brand"></i>AI Saathi Assistant</h5>
          <p className="text-muted-brand">
            If you ever get stuck or don't understand a specific requirement, you can ask AI Saathi.
            The assistant can explain complex government terminology, clarify instructions, and guide you through the process in simple terms.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-bookmark-star me-2 text-primary-brand"></i>Save & Access Later</h5>
          <p className="text-muted-brand">
            You can save the guidance for any form to your account. This allows you to quickly access the requirements and instructions later when you are ready to physically fill out and submit the official form to the respective government authority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
