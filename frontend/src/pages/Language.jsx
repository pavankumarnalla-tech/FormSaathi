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
    <div className="container section-padding">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-5">
            <i className="bi bi-globe fs-1 text-primary-brand mb-3 d-inline-block"></i>
            <h2 className="fw-bold mb-3">Choose your language</h2>
            <p className="text-muted-brand fs-5">
              Select the language you are most comfortable with.
            </p>
          </div>

          <div className="d-flex flex-column gap-3 mb-5">
            {languages.map((lang) => (
              <div 
                key={lang.code}
                className={`language-card selectable rounded-4 ${selectedLang === lang.code ? 'selected' : 'border'}`}
                onClick={() => handleSelect(lang.code)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold mb-1 text-dark">{lang.nativeName}</h4>
                    <span className="text-muted small">{lang.name}</span>
                  </div>
                  {selectedLang === lang.code && (
                    <i className="bi bi-check-circle-fill fs-3 text-primary-brand"></i>
                  )}
                  {selectedLang !== lang.code && (
                    <i className="bi bi-circle fs-3 text-muted opacity-25"></i>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              className="btn-primary-brand fs-5 px-5 py-3 w-100 rounded-pill"
              onClick={handleContinue}
              disabled={!selectedLang}
              style={{ opacity: !selectedLang ? 0.6 : 1 }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;
