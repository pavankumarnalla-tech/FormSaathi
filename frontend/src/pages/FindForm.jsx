import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { allForms as forms } from '../data/formData';

const FindForm = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('ALL');     // ALL | NATIONAL | TELANGANA
  const [selectedType, setSelectedType] = useState('ALL');       // ALL | FORM | ONLINE_SERVICE

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filteredForms = forms.filter((form) => {
    const term = searchTerm.toLowerCase().trim();

    let matchesCategory = true;
    if (selectedCategory) {
      const formName = form.name.toLowerCase();
      const dept = (form.department || '').toLowerCase();
      
      switch (selectedCategory) {
        case 'identity':
          matchesCategory = dept.includes('aadhaar') || dept.includes('election') || formName.includes('identity');
          break;
        case 'certificates':
          matchesCategory = formName.includes('certificate');
          break;
        case 'education':
          matchesCategory = form.categoryId === 'education';
          break;
        case 'income':
          matchesCategory = form.categoryId === 'income' || formName.includes('income') || formName.includes('tax');
          break;
        case 'employment':
          matchesCategory = form.categoryId === 'labour' || formName.includes('pension') || formName.includes('employment');
          break;
        case 'healthcare':
          matchesCategory = form.categoryId === 'health';
          break;
        case 'transport':
          matchesCategory = formName.includes('transport') || formName.includes('vehicle') || formName.includes('driving');
          break;
        case 'social_welfare':
          matchesCategory = form.categoryId === 'welfare' || formName.includes('welfare');
          break;
        default:
          matchesCategory = false;
      }
    }

    const matchesLevel     = selectedLevel !== 'ALL' ? form.governmentLevel === selectedLevel : true;
    const matchesType      = selectedType  !== 'ALL' ? form.serviceType     === selectedType  : true;
    
    // Case-insensitive substring matching anywhere in name, category, department, description, purpose, keywords
    const name = (form.name || '').toLowerCase();
    const cat  = (form.categoryName || '').toLowerCase();
    const dept = (form.department || '').toLowerCase();
    const desc = (form.shortDescription || '').toLowerCase();
    const purp = (form.purpose || '').toLowerCase();
    const kw   = (form.keywords || []).map(k => (k || '').toLowerCase());

    const matchesSearch = term === '' ||
      name.includes(term) ||
      cat.includes(term) ||
      dept.includes(term) ||
      desc.includes(term) ||
      purp.includes(term) ||
      kw.some(k => k.includes(term));

    return matchesCategory && matchesLevel && matchesType && matchesSearch;
  });

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedLevel('ALL');
    setSelectedType('ALL');
  };

  const hasActiveFilter = selectedCategory || selectedLevel !== 'ALL' || selectedType !== 'ALL' || searchTerm;

  // ── Card rendering ────────────────────────────────────────────────────────
  const renderFormCard = (form) => {
    const isOnlineService = form.serviceType === 'ONLINE_SERVICE';
    const isTemplateReady = form.status === 'official-template-ready';

    return (
      <div key={form.id} className="col-md-6 col-lg-4">
        <div className="card border-0 rounded-4 shadow-sm h-100 d-flex flex-column p-4">
          {/* Top badges */}
          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            {isTemplateReady ? (
              <span className="badge rounded-pill bg-success text-white px-3 py-2 small">
                <i className="bi bi-file-earmark-check-fill me-1"></i>Official Template Ready
              </span>
            ) : isOnlineService ? (
              <span className="badge rounded-pill bg-primary-brand text-white px-3 py-2 small">
                <i className="bi bi-laptop me-1"></i>Official Online Service
              </span>
            ) : (
              <span className="badge rounded-pill bg-secondary text-white px-3 py-2 small">
                <i className="bi bi-clock-history me-1"></i>Integration Pending
              </span>
            )}

            <span className={`badge rounded-pill px-3 py-2 small ${
              form.governmentLevel === 'NATIONAL' ? 'bg-info text-dark' : 'bg-warning text-dark'
            }`}>
              {form.governmentLevel === 'NATIONAL' ? '🇮🇳 National' : 'TS Telangana'}
            </span>
          </div>

          {/* Title & description */}
          <h5 className="fw-bold mb-1">{form.name}</h5>
          <p className="text-muted small mb-1">
            <i className="bi bi-building me-1"></i>{form.department}
          </p>
          <p className="text-muted-brand small flex-grow-1 mb-4">
            {form.shortDescription}
          </p>

          {/* Action button */}
          <div className="mt-auto">
            <button
              className="btn-outline-brand w-100 d-flex justify-content-between align-items-center py-2"
              onClick={() => navigate(`/form/${form.id}`)}
            >
              View Details & Guidance
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
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
          <li className="breadcrumb-item active" aria-current="page">Find a Government Form or Service</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-5 text-center">
        <h1 className="fw-bold mb-3">Find a Government Form or Service</h1>
        <p className="lead text-muted-brand">
          Search for an official government form or service, or browse by category.
        </p>
        <div className="alert alert-info border-0 rounded-4 d-inline-flex align-items-start text-start px-4 py-3 small mt-2" style={{ maxWidth: '680px' }}>
          <i className="bi bi-info-circle-fill me-2 mt-1 flex-shrink-0"></i>
          <span>
            Form Saathi helps you understand and prepare government forms. Always verify the latest requirements
            and submission instructions on the official government website.
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-pill p-2 flex-row align-items-center bg-white">
            <i className="bi bi-search ms-3 text-muted fs-5"></i>
            <input
              type="text"
              className="form-control border-0 shadow-none fs-6 py-2 px-3"
              placeholder="Search by name, department, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn btn-link text-muted p-0 me-3" onClick={() => setSearchTerm('')}>
                <i className="bi bi-x-circle-fill fs-5"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center">
            {/* Government Level */}
            <div className="d-flex gap-2 align-items-center">
              <span className="text-muted small fw-bold">Level:</span>
              {['ALL', 'NATIONAL', 'TELANGANA'].map(level => (
                <button
                  key={level}
                  className={`btn btn-sm rounded-pill px-3 ${selectedLevel === level ? 'btn-primary-brand text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level === 'ALL' ? 'All' : level === 'NATIONAL' ? '🇮🇳 National' : 'TS Telangana'}
                </button>
              ))}
            </div>
            {/* Divider */}
            <span className="text-muted d-none d-md-inline">|</span>
            {/* Service Type */}
            <div className="d-flex gap-2 align-items-center">
              <span className="text-muted small fw-bold">Type:</span>
              {[
                { val: 'ALL', label: 'All' },
                { val: 'FORM', label: '📄 Forms' },
                { val: 'ONLINE_SERVICE', label: '💻 Online Services' }
              ].map(({ val, label }) => (
                <button
                  key={val}
                  className={`btn btn-sm rounded-pill px-3 ${selectedType === val ? 'btn-primary-brand text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedType(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="col-12 mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0">Browse by Category</h5>
          {hasActiveFilter && (
            <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={clearAllFilters}>
              <i className="bi bi-x-circle me-1"></i>Clear All Filters
            </button>
          )}
        </div>
        <div className="d-flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`card border-0 shadow-sm rounded-4 flex-grow-1 ${selectedCategory === cat.id ? 'bg-primary-brand text-white' : 'bg-white'}`}
              style={{ cursor: 'pointer', transition: 'all 0.2s', minWidth: '140px', flexBasis: 'calc(25% - 1rem)' }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="card-body p-3 text-center">
                <i className={`bi ${cat.icon} fs-3 mb-2 d-block ${selectedCategory === cat.id ? 'text-white' : 'text-primary-brand'}`}></i>
                <h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>{cat.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="mb-4 d-flex align-items-end justify-content-between">
        <div>
          <h4 className="fw-bold mb-1">
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name} Forms & Services`
              : selectedLevel !== 'ALL'
              ? `${selectedLevel === 'NATIONAL' ? 'National' : 'Telangana'} Forms & Services`
              : 'All Forms & Services'}
          </h4>
          {searchTerm && (
            <p className="text-muted-brand mb-0 small">
              Search results for: <strong>"{searchTerm}"</strong>
            </p>
          )}
        </div>
        <div className="text-muted small">
          {filteredForms.length} result{filteredForms.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Results grid */}
      <div className="row g-4">
        {filteredForms.length > 0 ? (
          filteredForms.map(renderFormCard)
        ) : (
          <div className="col-12">
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-light">
              <i className="bi bi-search fs-1 text-muted opacity-50 mb-3"></i>
              <h4 className="fw-bold">No forms or services found.</h4>
              <p className="text-muted-brand mb-4">
                Try a different search term, choose another category, or clear the filters.
              </p>
              <button className="btn-primary-brand px-4" onClick={clearAllFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindForm;
