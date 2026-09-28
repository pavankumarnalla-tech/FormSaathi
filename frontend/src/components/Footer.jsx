import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-5 pb-4 mt-auto border-top">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-6 text-center text-md-start">
            <h5 className="fw-bold text-primary-brand mb-2">Form Saathi</h5>
            <p className="text-muted-brand mb-0">Your AI Saathi for Official Forms.</p>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-3">
                <Link to="#" className="text-decoration-none text-muted-brand">About</Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="#" className="text-decoration-none text-muted-brand">Help</Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="#" className="text-decoration-none text-muted-brand">Privacy</Link>
              </li>
              <li className="list-inline-item">
                <Link to="#" className="text-decoration-none text-muted-brand">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4 text-muted" />
        <div className="text-center text-muted-brand small">
          &copy; {new Date().getFullYear()} Form Saathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
