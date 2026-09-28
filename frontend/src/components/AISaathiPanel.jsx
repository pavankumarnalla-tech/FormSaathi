import React, { useState } from 'react';
import axios from 'axios';

// Predefined demo answers keyed by common field names (lower-cased words)
const DEMO_ANSWERS = {
  'annual':         'This refers to the total income earned by your family from all sources (salary, agriculture, business, etc.) in one full year. Check your salary slips or previous income certificate.',
  'income':         'Enter the total yearly earnings of your household — include salary, business income, rent, farming income, and any other regular earnings.',
  'aadhaar':        'Your Aadhaar is a 12-digit unique identity number issued by UIDAI. It is printed on your Aadhaar card. You can also find it in your DigiLocker account.',
  'date of birth':  'Enter your date of birth exactly as shown on your Aadhaar card or birth certificate. Use the format DD/MM/YYYY.',
  'address':        'Enter your current place of living — include your house/door number, street name, area, city or village name, district, state, and PIN code.',
  'mobile':         'Enter your active 10-digit Indian mobile phone number. This will be used to receive status updates and OTPs.',
  'occupation':     'Your occupation is your main job or profession. For example: Farmer, Govt. Employee, Private Employee, Business Owner, Daily Wage Worker.',
  'signature':      'In the physical form, this is where you sign your name. For the digital form, your submission itself acts as your declaration.',
  'gender':         'Select the gender that matches your official documents. If your documents show a different identity, choose the option that applies to you.',
  'caste':          'Select the caste category as mentioned in your official caste certificate. If you do not have one, select "General".',
  'bank':           'Enter your active bank account number. Scholarship/benefit amounts will be deposited into this account.',
  'ifsc':           'IFSC stands for Indian Financial System Code. It is an 11-character code that identifies your bank branch. Find it on your passbook\'s first page or on your cheque leaf.',
  'default':        'I can help you understand what to fill in this field. Could you tell me specifically what is confusing? In the meantime, fill in the information matching your official documents.'
};

const getDemoAnswer = (fieldName) => {
  const lower = (fieldName || '').toLowerCase();
  for (const [keyword, answer] of Object.entries(DEMO_ANSWERS)) {
    if (lower.includes(keyword)) return answer;
  }
  return DEMO_ANSWERS.default;
};

/**
 * AISaathiPanel — contextual AI help panel shown alongside a form field.
 *
 * Props:
 *   formName     – name of the form currently being filled
 *   sectionName  – current section name
 *   field        – current field definition { name, description }
 *   language     – selected language string (e.g. "English")
 *   onClose      – callback to close the panel
 */
const AISaathiPanel = ({ formName, sectionName, field, language = 'English', onClose }) => {
  const [question, setQuestion] = useState('What should I enter here?');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const quickQuestions = [
    'What should I enter here?',
    'What does this mean?',
    'Where can I find this information?',
    'Give me an example.',
  ];

  const askAI = async (q) => {
    const currentQ = q || question;
    if (!currentQ.trim()) return;
    setLoading(true);
    setAnswer(null);
    setError(null);
    setIsDemoMode(false);

    try {
      const res = await axios.post('http://localhost:8000/api/ai/assist', {
        formName,
        sectionName,
        fieldName: field.name,
        fieldDescription: field.description || '',
        question: currentQ,
        language
      }, { timeout: 12000 });

      if (res.data?.answer) {
        setAnswer(res.data.answer);
        setIsDemoMode(res.data.isDemoMode || false);
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      // Graceful local demo fallback
      setAnswer(getDemoAnswer(field.name));
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 rounded-4 shadow p-4 bg-white" style={{ maxWidth: '360px', minWidth: '260px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-robot fs-6"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0">AI Saathi</h6>
            {isDemoMode && <span className="badge bg-warning text-dark small">Demo Mode</span>}
          </div>
        </div>
        <button className="btn btn-link text-muted p-0" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Context pill */}
      <div className="mb-3">
        <span className="badge bg-secondary-brand text-primary-brand rounded-pill px-3 py-2 small fw-medium">
          <i className="bi bi-input-cursor-text me-1"></i>{field.name}
        </span>
      </div>

      {/* Quick question chips */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {quickQuestions.map((q) => (
          <button
            key={q}
            type="button"
            className={`btn btn-sm rounded-pill border ${question === q ? 'btn-primary-brand' : 'btn-outline-secondary'}`}
            style={{ fontSize: '0.72rem' }}
            onClick={() => { setQuestion(q); }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Custom question input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control border-0 bg-light rounded-start-pill"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askAI()}
        />
        <button className="btn btn-primary-brand rounded-end-pill px-3" onClick={() => askAI()} disabled={loading}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="text-center py-3 text-muted-brand">
          <div className="spinner-border spinner-border-sm me-2"></div>
          AI Saathi is thinking...
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-warning border-0 rounded-3 small mb-0">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
          <button className="btn btn-sm btn-link p-0 ms-2" onClick={() => askAI()}>Try again</button>
        </div>
      )}

      {answer && !loading && (
        <div className="bg-light rounded-3 p-3">
          {isDemoMode && (
            <p className="text-warning small mb-2 fw-bold">
              <i className="bi bi-cone-striped me-1"></i>AI Demo Mode — sample explanation
            </p>
          )}
          <p className="mb-0 small text-dark" style={{ lineHeight: 1.6 }}>{answer}</p>
        </div>
      )}

      {!answer && !loading && !error && (
        <p className="text-muted small text-center mb-0">Select a quick question or type your own.</p>
      )}
    </div>
  );
};

export default AISaathiPanel;
