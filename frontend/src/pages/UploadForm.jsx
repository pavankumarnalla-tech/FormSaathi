import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_SIZE_MB = 10;
  const SUPPORTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  useEffect(() => {
    let timer;
    if (isAnalyzing) {
      const stages = [
        "Reading document...",
        "Detecting form structure...",
        "Identifying fields...",
        "Preparing analysis..."
      ];
      let currentStage = 0;
      setAnalysisStage(stages[currentStage]);
      
      timer = setInterval(() => {
        currentStage++;
        if (currentStage < stages.length) {
          setAnalysisStage(stages[currentStage]);
        }
      }, 800); // cycle stages visually
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    processSelectedFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    processSelectedFile(selected);
  };

  const processSelectedFile = (selected) => {
    setError(null);
    if (!selected) return;

    if (!SUPPORTED_TYPES.includes(selected.type)) {
      setError("This file type is not supported. Please upload a PDF or image (JPG/PNG).");
      setFile(null);
      setPreview(null);
      return;
    }

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`This file is too large. Maximum file size is ${MAX_SIZE_MB} MB.`);
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selected);
    if (selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview('pdf');
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const getLanguageName = (code) => {
        if (code === 'te' || code === 'Telugu') return 'Telugu';
        if (code === 'hi' || code === 'Hindi') return 'Hindi';
        return 'English';
      };
      const rawLang = localStorage.getItem('formSaathiLanguage') || 'en';
      const langName = getLanguageName(rawLang);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", langName);

      // Using localhost:8000 for the backend MVP
      const response = await axios.post("http://localhost:8000/api/forms/analyze", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.success) {
        // Wait a small moment to let the UI finish the "stages" visually
        setTimeout(() => {
          // IMPORTANT FIX: Passing the actual File object along with the result so "Analyze Again" can use it
          navigate('/form-analysis', { state: { result: response.data.data, file: file } });
        }, 1500);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err) {
      setIsAnalyzing(false);
      // Show the exact backend error detail if available, otherwise a clear fallback
      const backendDetail = err.response?.data?.detail;
      setError(backendDetail || "Unable to analyze this form. The backend may be offline. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none text-muted" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Upload a Form</li>
        </ol>
      </nav>

      <div className="mb-5 text-center">
        <h1 className="fw-bold mb-3">Upload Your Form</h1>
        <p className="lead text-muted-brand">
          Already have a form? Upload the PDF or image and Form Saathi will help you understand it.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          {error && (
            <div className="alert alert-danger d-flex align-items-start mb-4 border-0 rounded-4 shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-4 me-3 mt-1"></i>
              <div className="flex-grow-1">
                <div className="mb-2">{error}</div>
                {file && (
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill"
                    onClick={() => { setError(null); handleAnalyze(); }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>Retry
                  </button>
                )}
              </div>
            </div>
          )}

          {!file && (
            <div 
              className="card border-2 rounded-4 bg-light text-center p-5 border-dashed"
              style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="mb-4 text-muted opacity-50">
                <i className="bi bi-cloud-arrow-up display-1"></i>
              </div>
              <h4 className="fw-bold mb-3">Drag & drop your form here</h4>
              <p className="text-muted-brand mb-4">OR</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf, .jpg, .jpeg, .png" 
                style={{ display: 'none' }} 
              />
              <button 
                className="btn-primary-brand px-4 py-2 mx-auto mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
              <p className="text-muted small mb-0">
                PDF, JPG, JPEG, PNG supported. Maximum file size: {MAX_SIZE_MB} MB.
              </p>
            </div>
          )}

          {file && !isAnalyzing && (
            <div className="card border-0 rounded-4 shadow-sm p-4 text-center">
              <h5 className="fw-bold border-bottom pb-3 mb-4">Selected File</h5>
              
              <div className="d-flex flex-column align-items-center mb-4">
                {preview === 'pdf' ? (
                  <div className="bg-light rounded p-4 mb-3 text-danger d-inline-block">
                    <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '4rem' }}></i>
                  </div>
                ) : (
                  <img src={preview} alt="Preview" className="img-fluid rounded shadow-sm mb-3" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                )}
                
                <h6 className="fw-bold mb-1">{file.name}</h6>
                <span className="text-muted small">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <button className="btn btn-outline-danger px-4 py-2 rounded-pill" onClick={handleRemove}>
                  <i className="bi bi-trash me-2"></i>Remove
                </button>
                <button className="btn-primary-brand px-4 py-2" onClick={handleAnalyze}>
                  <i className="bi bi-cpu me-2"></i>Analyze Form
                </button>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center">
              <div className="spinner-border text-primary-brand mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="fw-bold mb-3">Analyzing your form...</h4>
              <p className="text-muted-brand lead mb-0">
                {analysisStage}
              </p>
            </div>
          )}

          {/* Privacy Note */}
          <div className="text-center mt-4">
            <p className="text-muted small px-md-5">
              <i className="bi bi-shield-lock me-1"></i>
              Your uploaded document may contain personal information. Only upload documents you are comfortable processing through this application.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadForm;
