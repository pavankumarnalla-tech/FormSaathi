import React, { useState } from 'react';
import axios from 'axios';

/**
 * AISaathiPanel — contextual AI help panel shown alongside a form field.
 *
 * Props:
 *   formName     – name of the form currently being filled
 *   sectionName  – current section name
 *   field        – current field definition { name, description }
 *   language     – selected language string (e.g. "English")
 *   onClose      – callback to close the panel / back to form
 */
const AISaathiPanel = ({ formName, sectionName, field, language = 'English', onClose }) => {
  const [question, setQuestion] = useState('What should I enter here?');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const res = await axios.post('http://localhost:8000/api/ai/assist', {
        formName: formName || 'Official Application',
        sectionName: sectionName || 'General',
        fieldName: field.name,
        fieldDescription: field.description || '',
        question: currentQ,
        language
      }, { timeout: 15000 });

      if (res.data && res.data.answer) {
        setAnswer(res.data.answer);
      } else {
        throw new Error('Empty response from AI server');
      }
    } catch (err) {
      console.error('AI Assistance error:', err);
      const serverMsg = err.response?.data?.detail;
      setError(serverMsg || 'AI assistance is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 rounded-4 shadow p-4 bg-white" style={{ maxWidth: '380px', minWidth: '280px' }}>
      {/* Header with Back to Form Button */}
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={onClose}>
          <i className="bi bi-arrow-left me-1"></i>Back to Form
        </button>
        <div className="d-flex align-items-center">
          <div className="bg-primary-brand text-white rounded-circle d-flex align-items-center justify-content-center me-1" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-robot fs-6"></i>
          </div>
          <span className="fw-bold small text-primary-brand">AI Saathi</span>
        </div>
      </div>

      {/* Field Context pill */}
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
            style={{ fontSize: '0.75rem' }}
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
          placeholder="Ask a question..."
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
          <div className="spinner-border spinner-border-sm me-2 text-primary-brand" role="status"></div>
          AI Saathi is thinking...
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-warning border-0 rounded-3 small mb-0">
          <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
          {error}
          <div className="mt-2 text-end">
            <button className="btn btn-sm btn-outline-brand rounded-pill px-3 py-1" onClick={() => askAI()}>
              <i className="bi bi-arrow-repeat me-1"></i>Retry
            </button>
          </div>
        </div>
      )}

      {answer && !loading && (
        <div className="bg-light rounded-3 p-3 border">
          <p className="mb-0 small text-dark" style={{ lineHeight: 1.6 }}>{answer}</p>
        </div>
      )}

      {!answer && !loading && !error && (
        <p className="text-muted small text-center mb-0">Select a quick question or type your query.</p>
      )}

      {/* Bottom Back Button */}
      <div className="mt-3 pt-2 border-top text-center">
        <button className="btn btn-link text-muted small text-decoration-none p-0" onClick={onClose}>
          <i className="bi bi-arrow-left me-1"></i>Back to Form
        </button>
      </div>
    </div>
  );
};

export default AISaathiPanel;
