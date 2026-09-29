import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-5 pb-4 mt-auto border-top">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-6 text-center text-md-start">
            <h5 className="fw-bold text-primary-brand mb-1">Form Saathi</h5>
            <p className="text-muted-brand mb-0 small">Your AI Assistant for Official Government Forms & Services.</p>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-3">
                <Link to="/find-form" className="text-decoration-none text-muted-brand small">Find Forms</Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="/help" className="text-decoration-none text-muted-brand small">Help & Guidance</Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="/ai-saathi" className="text-decoration-none text-muted-brand small">AI Saathi</Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4 text-muted opacity-25" />
        <div className="text-center text-muted small">
          <p className="mb-2" style={{ fontSize: '0.8rem' }}>
            <strong>Disclaimer:</strong> Form Saathi is an independent assistance platform that provides guidance and explanations. Always verify requirements and submit applications through the official government source.
          </p>
          <div>&copy; {new Date().getFullYear()} Form Saathi. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
