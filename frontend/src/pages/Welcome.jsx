import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="badge bg-secondary-brand text-primary-brand px-3 py-2 rounded-pill mb-3 fw-medium">
                Your AI Saathi for Official Forms
              </span>
              <h1 className="display-4 fw-bold text-dark mb-4">
                Discover Forms.<br />
                <span className="text-primary-brand">Understand Them Easily.</span>
              </h1>
              <p className="lead text-muted-brand mb-5">
                Form Saathi helps you discover government forms, understand their purpose and requirements, and provides simple AI explanations.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <button 
                  className="btn-primary-brand fs-5 px-4 py-2"
                  onClick={() => navigate('/language')}
                >
                  Get Started
                </button>
                <button
                  className="btn-outline-brand fs-5 px-4 py-2"
                  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                >
                  How It Works
                </button>
              </div>
            </div>
            
            <div className="col-lg-6 text-center">
              <div className="bg-light p-4 rounded-4 shadow-sm position-relative">
                <div className="d-flex flex-column gap-3 align-items-center">
                  <div className="bg-white p-3 rounded-3 shadow-sm border w-75 d-flex align-items-center justify-content-between">
                    <span className="text-muted fw-bold">Government Form</span>
                    <i className="bi bi-file-earmark-pdf fs-4 text-secondary"></i>
                  </div>
                  <i className="bi bi-arrow-down fs-4 text-primary-brand"></i>
                  <div className="bg-primary-brand p-3 rounded-3 shadow-sm border w-75 d-flex align-items-center justify-content-between text-white">
                    <span className="fw-bold">AI Explanation</span>
                    <i className="bi bi-robot fs-4"></i>
                  </div>
                  <i className="bi bi-arrow-down fs-4 text-primary-brand"></i>
                  <div className="bg-white p-3 rounded-3 shadow-sm border w-75 d-flex align-items-center justify-content-between border-primary">
                    <span className="text-primary-brand fw-bold">Understand Fields & Requirements</span>
                    <i className="bi bi-list-check fs-4 text-primary-brand"></i>
                  </div>
                  <i className="bi bi-arrow-down fs-4 text-success"></i>
                  <div className="bg-white p-3 rounded-3 shadow-sm border w-75 d-flex align-items-center justify-content-between border-success">
                    <span className="text-success fw-bold">Official Form</span>
                    <i className="bi bi-file-earmark-check-fill fs-4 text-success"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Form Saathi?</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-card p-4">
                <div className="icon-wrapper">
                  <i className="bi bi-search"></i>
                </div>
                <h5 className="fw-bold mb-3">Discover Forms</h5>
                <p className="text-muted-brand mb-0">Search 170+ official government forms and services across multiple departments.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card p-4">
                <div className="icon-wrapper">
                  <i className="bi bi-robot"></i>
                </div>
                <h5 className="fw-bold mb-3">AI Guidance</h5>
                <p className="text-muted-brand mb-0">Ask AI Saathi what a field means, what documents you need, and how to apply.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card p-4">
                <div className="icon-wrapper">
                  <i className="bi bi-upload"></i>
                </div>
                <h5 className="fw-bold mb-3">Upload & Analyze</h5>
                <p className="text-muted-brand mb-0">Upload any government PDF and get a field-by-field plain-language breakdown.</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card p-4">
                <div className="icon-wrapper">
                  <i className="bi bi-translate"></i>
                </div>
                <h5 className="fw-bold mb-3">Your Language</h5>
                <p className="text-muted-brand mb-0">Get all guidance in English, Telugu, or Hindi — whichever you choose.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
          </div>
          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="step-card">
                <div className="step-number">01</div>
                <h5 className="fw-bold mb-2">Find a Form</h5>
                <p className="text-muted-brand small mb-0">Search and discover the government form you need from our catalogue.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="step-card">
                <div className="step-number">02</div>
                <h5 className="fw-bold mb-2">Understand the Form</h5>
                <p className="text-muted-brand small mb-0">Get simple AI explanations of the form, fields, eligibility, required documents, and instructions.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="step-card">
                <div className="step-number">03</div>
                <h5 className="fw-bold mb-2">Upload & Analyze</h5>
                <p className="text-muted-brand small mb-0">Upload a government form PDF and let Form Saathi explain its actual fields and requirements.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="step-card">
                <div className="step-number">04</div>
                <h5 className="fw-bold mb-2">Use the Official Form</h5>
                <p className="text-muted-brand small mb-0">Open or download the original official government form directly from its official source.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <h3 className="fw-bold mb-3">Simple for you. Accurate for the form.</h3>
          <p className="lead opacity-75 mb-0 mx-auto" style={{ maxWidth: '600px' }}>
            Form Saathi simplifies the experience while keeping the required information aligned with the official form.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center bg-light">
        <div className="container">
          <h3 className="fw-bold mb-4">Ready to simplify your form?</h3>
          <button 
            className="btn-primary-brand fs-5 px-5 py-3"
            onClick={() => navigate('/language')}
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
