import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api/config';

const AISaathiPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am AI Saathi. How can I help you with your official forms or documents today?'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('formSaathiLanguage');
    if (savedLang) {
      if (savedLang === 'te') setLanguage('Telugu');
      else if (savedLang === 'hi') setLanguage('Hindi');
      else setLanguage('English');
    }
  }, []);

  const quickTopics = [
    'What documents do I need for Income Certificate?',
    'What is an IFSC code?',
    'How do I upload and analyze my form?',
    'Where do I submit my completed form?'
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/api/ai/assist`, {
        formName: 'General Form Guidance',
        sectionName: 'General Inquiry',
        fieldName: 'General Guidance',
        fieldDescription: 'Citizen assistance inquiry',
        question: query,
        language: language
      }, { timeout: 15000 });

      if (response.data && response.data.answer) {
        setMessages((prev) => [...prev, { sender: 'ai', text: response.data.answer }]);
      } else {
        throw new Error('No answer returned');
      }
    } catch (err) {
      const errorText = err.response?.data?.detail || 'AI Saathi is temporarily unavailable. Please try again.';
      setError(errorText);
      setMessages((prev) => [...prev, { sender: 'ai', text: errorText, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-secondary-brand text-primary-brand rounded-pill px-3 py-2 mb-2">
            <i className="bi bi-robot me-1"></i>AI Assistant
          </span>
          <h2 className="fw-bold mb-1">AI Saathi Assistant</h2>
          <p className="text-muted-brand mb-0">Ask questions about official forms, requirements, and document fields in {language}.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      {/* Main Chat Layout */}
      <div className="card border-0 rounded-4 shadow-sm bg-white p-4">
        {/* Quick Topics */}
        <div className="mb-4">
          <label className="text-muted small fw-bold text-uppercase mb-2 d-block">Quick Topics</label>
          <div className="d-flex flex-wrap gap-2">
            {quickTopics.map((topic, idx) => (
              <button
                key={idx}
                className="btn btn-sm btn-outline-brand rounded-pill"
                onClick={() => handleSend(topic)}
                disabled={loading}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Display */}
        <div className="border rounded-4 p-3 p-md-4 mb-4 bg-light" style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-3 rounded-4 shadow-sm max-w-75 ${
                  msg.sender === 'user'
                    ? 'bg-primary-brand text-white rounded-bottom-end-0'
                    : msg.isError
                    ? 'bg-danger bg-opacity-10 text-danger rounded-bottom-start-0 border border-danger'
                    : 'bg-white text-dark rounded-bottom-start-0'
                }`}
                style={{ maxWidth: '80%' }}
              >
                <div className="d-flex align-items-center mb-1 small opacity-75">
                  <i className={`bi ${msg.sender === 'user' ? 'bi-person-fill' : 'bi-robot'} me-1`}></i>
                  <strong>{msg.sender === 'user' ? 'You' : 'AI Saathi'}</strong>
                </div>
                <div style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="bg-white p-3 rounded-4 shadow-sm text-muted rounded-bottom-start-0">
                <div className="spinner-border spinner-border-sm text-primary-brand me-2" role="status"></div>
                AI Saathi is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg bg-light border-0 rounded-start-4"
              placeholder={`Ask a question in ${language}...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
            />
            <button
              className="btn-primary-brand px-4 rounded-end-4"
              type="submit"
              disabled={loading || !inputQuery.trim()}
            >
              <i className="bi bi-send-fill me-2"></i>Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISaathiPage;
