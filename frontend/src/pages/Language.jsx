import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Language = () => {
  const [selectedLang, setSelectedLang] = useState('');
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
  ];

  useEffect(() => {
    // Load previously selected language if any
    const saved = localStorage.getItem('formSaathiLanguage');
    if (saved) {
      setSelectedLang(saved);
    }
  }, []);

  const handleSelect = (code) => {
    setSelectedLang(code);
  };

  const handleContinue = () => {
    if (selectedLang) {
      localStorage.setItem('formSaathiLanguage', selectedLang);
      navigate('/login');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="text-center mb-4">
            <i className="bi bi-globe fs-3 text-primary-brand mb-2 d-inline-block"></i>
            <h2 className="fw-bold mb-2">Choose your language</h2>
            <p className="text-muted-brand mb-0">
              Select the language you are most comfortable with.
            </p>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            {languages.map((lang) => (
              <div 
                key={lang.code}
                className={`language-card selectable rounded-4 p-3 ${selectedLang === lang.code ? 'selected' : 'border bg-white'}`}
                onClick={() => handleSelect(lang.code)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{lang.nativeName}</h5>
                    <span className="text-muted small">{lang.name}</span>
                  </div>
                  {selectedLang === lang.code && (
                    <i className="bi bi-check-circle-fill fs-5 text-primary-brand"></i>
                  )}
                  {selectedLang !== lang.code && (
                    <i className="bi bi-circle fs-5 text-muted opacity-25"></i>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              className="btn-primary-brand w-100 rounded-pill py-2.5"
              onClick={handleContinue}
              disabled={!selectedLang}
              style={{ opacity: !selectedLang ? 0.6 : 1 }}
            >
              Continue <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;
