import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { forms } from '../data/formData';

const FindForm = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter logic
  const filteredForms = forms.filter((form) => {
    const term = searchTerm.toLowerCase().trim();
    
    // Category match
    const matchesCategory = selectedCategory ? form.categoryId === selectedCategory : true;
    
    // Search term match
    const matchesSearch = term === '' || 
      form.name.toLowerCase().includes(term) ||
      form.shortDescription.toLowerCase().includes(term) ||
      form.categoryName.toLowerCase().includes(term) ||
      form.keywords.some(keyword => keyword.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // toggle off
    } else {
      setSelectedCategory(categoryId);
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
          <li className="breadcrumb-item active" aria-current="page">Find a Form</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-5 text-center">
        <h1 className="fw-bold mb-3">Find a Form</h1>
        <p className="lead text-muted-brand">
          Search for the official form you need or browse by category.
        </p>
      </div>

      {/* Search Bar */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-pill p-2 flex-row align-items-center bg-white">
            <i className="bi bi-search ms-3 text-muted fs-5"></i>
            <input 
              type="text" 
              className="form-control border-0 shadow-none fs-5 py-2 px-3" 
              placeholder="Search forms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn btn-link text-muted p-0 me-3" 
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x-circle-fill fs-5"></i>
              </button>
            )}
            <button className="btn-primary-brand rounded-pill px-4">Search</button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Categories Sidebar/Top */}
        <div className="col-12 mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0">Browse by category</h5>
            {selectedCategory && (
              <button 
                className="btn btn-sm btn-outline-secondary rounded-pill"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
            )}
          </div>
          
          <div className="d-flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className={`card border-0 shadow-sm rounded-4 flex-grow-1 ${selectedCategory === cat.id ? 'bg-primary-brand text-white' : 'bg-white'}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s', minWidth: '160px', flexBasis: 'calc(25% - 1rem)' }}
                onClick={() => handleCategoryClick(cat.id)}
                onMouseOver={(e) => e.currentTarget.classList.add('shadow')}
                onMouseOut={(e) => e.currentTarget.classList.remove('shadow')}
              >
                <div className="card-body p-3 text-center">
                  <i className={`bi ${cat.icon} fs-3 mb-2 d-block ${selectedCategory === cat.id ? 'text-white' : 'text-primary-brand'}`}></i>
                  <h6 className="fw-bold mb-0">{cat.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-4 d-flex align-items-end justify-content-between">
        <div>
          <h4 className="fw-bold mb-1">
            {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} Forms` : 'All Forms'}
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

      {/* Form List */}
      <div className="row g-4">
        {filteredForms.length > 0 ? (
          filteredForms.map((form) => (
            <div key={form.id} className="col-md-6 col-lg-4">
              <div className="card border-0 rounded-4 shadow-sm h-100 d-flex flex-column p-4 transition-transform hover-lift">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-secondary-brand text-primary-brand rounded d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-file-earmark-text fs-5"></i>
                  </div>
                  <span className="badge bg-light text-secondary border border-secondary-subtle rounded-pill">
                    {form.categoryName}
                  </span>
                </div>
                <h5 className="fw-bold mb-2">{form.name}</h5>
                <p className="text-muted-brand small flex-grow-1 mb-4">
                  {form.shortDescription}
                </p>
                <div className="mt-auto">
                  <button 
                    className="btn-outline-brand w-100 d-flex justify-content-between align-items-center py-2"
                    onClick={() => navigate(`/form/${form.id}`)}
                  >
                    View Details <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-light">
              <div className="mb-3">
                <i className="bi bi-search fs-1 text-muted opacity-50"></i>
              </div>
              <h4 className="fw-bold">No forms found.</h4>
              <p className="text-muted-brand mb-4">
                Try a different search term or choose another category.
              </p>
              <div>
                <button 
                  className="btn-primary-brand px-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindForm;
