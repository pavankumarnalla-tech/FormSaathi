import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Language from './pages/Language'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import FindForm from './pages/FindForm'
import FormInformation from './pages/FormInformation'
import UploadForm from './pages/UploadForm'
import FormAnalysis from './pages/FormAnalysis'
import DocumentsPlaceholder from './pages/DocumentsPlaceholder'
import NotFound from './pages/NotFound'
import PlaceholderPage from './components/PlaceholderPage'

// Simple frontend-only protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('formSaathi_auth') === 'true';
  return isAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/language" element={<Language />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Dashboard Quick Access */}
          <Route path="/my-forms" element={<ProtectedRoute><PlaceholderPage title="My Forms" stepNumber="6" /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentsPlaceholder /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><PlaceholderPage title="Help & Support" stepNumber="7" /></ProtectedRoute>} />

          {/* Find Form Routes */}
          <Route path="/find-form" element={<ProtectedRoute><FindForm /></ProtectedRoute>} />
          <Route path="/form/:id" element={<ProtectedRoute><FormInformation /></ProtectedRoute>} />
          
          <Route 
            path="/form/:id/explanation" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="AI Form Explanation" stepNumber="7" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/form/:id/fill" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Form Saathi Filling" stepNumber="6" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/form/demo/fill" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Form Saathi Filling" stepNumber="6" />
              </ProtectedRoute>
            } 
          />
          
          {/* Upload and Form Analysis Routes */}
          <Route path="/upload-form" element={<ProtectedRoute><UploadForm /></ProtectedRoute>} />
          <Route path="/form-analysis" element={<ProtectedRoute><FormAnalysis /></ProtectedRoute>} />

          <Route 
            path="/ai-saathi" 
            element={
              <ProtectedRoute>
                <PlaceholderPage title="AI Saathi" stepNumber="7" />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
