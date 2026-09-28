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
            Use the "Find a Form" section to search for official government forms by name or category.
            Once you select a form, Form Saathi will guide you through a simple, conversational interface to fill it out.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-upload me-2 text-primary-brand"></i>Upload a Form</h5>
          <p className="text-muted-brand">
            If you already have a physical or PDF form, you can upload it. Form Saathi uses AI to analyze the form,
            understand the required fields, and extract any information you have already filled in. It will then
            guide you to complete the remaining information.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-robot me-2 text-primary-brand"></i>AI Assistance</h5>
          <p className="text-muted-brand">
            While filling out any form, look for the "Need help?" button next to a field. Clicking this will
            open the AI Saathi panel, where you can get simple explanations about what the field means, what you
            should enter, and where to find the required information.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-file-earmark-check me-2 text-primary-brand"></i>Validation & Review</h5>
          <p className="text-muted-brand">
            Before generating the final PDF, Form Saathi will validate your answers to ensure nothing is missing
            or incorrectly formatted (like invalid phone numbers or missing documents). You will be given a chance
            to review and edit all your information.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold"><i className="bi bi-printer me-2 text-primary-brand"></i>Generating the PDF</h5>
          <p className="text-muted-brand">
            Once everything is correct, you can generate the official PDF. Form Saathi will map your answers
            to the correct format. You can then download and print it. <strong>Note:</strong> Form Saathi does not
            submit forms on your behalf. You must submit the generated form to the respective government authority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
